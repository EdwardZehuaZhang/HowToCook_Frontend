import React from 'react';
import Link from 'next/link';
import { fetchRecipes } from '@/services/api';

/**
 * Parse markdown links and return React components
 */
export function parseMarkdownLinks(text: string): React.ReactNode[] {
  if (!text) return [null];

  const combinedRegex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = combinedRegex.exec(text)) !== null) {
    // Add text before the formatted section
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    if (match[0].startsWith('[')) {
      // This is a link - use previous link handling logic
      const linkText = match[2];
      const url = match[3];
      
      parts.push(
        <Link
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {linkText}
        </Link>
      );
    } else {
      // This is bold text
      const boldText = match[4];
      parts.push(
        <strong key={match.index} className="font-bold">
          {boldText}
        </strong>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add any remaining text after the last formatting
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

/**
 * Convert relative image paths to absolute URLs in markdown content
 * 
 * @param markdownText Original markdown text with relative image paths
 * @param baseUrl Base URL for images (from recipe.sourceUrl)
 * @param allImageUrls List of all available image URLs
 * @returns Markdown with image URLs replaced with absolute paths
 */
export function replaceImagePaths(markdownText: string, baseUrl: string, allImageUrls: string[]): string {
  if (!markdownText) return '';
  
  // Regular expression to match markdown image syntax: ![alt](./path.jpg) or ![alt](../path.jpg) or ![alt](path.jpg)
  const imageRegex = /!\[(.*?)\]\(([^)]+)\)/g;
  
  // We'll keep the original content if no replacements are needed
  let hasReplacements = false;
  const replacedText = markdownText.replace(imageRegex, (match, alt, path) => {
    // Skip if it's already an absolute URL
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return match;
    }
    
    hasReplacements = true;
    
    // Extract just the filename from the path, handling various relative formats
    const filename = path.replace(/^\.\.?\//g, '').split('/').pop();
    if (!filename) return match;

    // Try to find a matching URL in allImageUrls
    const fullUrl = allImageUrls.find(url => {
      if (!url) return false;
      
      try {
        // Extract filename from URL using URL API
        const urlObj = new URL(url);
        const urlFilename = urlObj.pathname.split('/').pop();
        
        // Check both encoded and decoded versions
        return url.includes(encodeURIComponent(filename)) || 
               url.includes(filename) || 
               urlFilename === filename ||
               decodeURIComponent(urlFilename || '') === filename;
      } catch (e) {
        // If URL parsing fails, do a simple string check
        return url.includes(filename);
      }
    });
    
    if (fullUrl) {
      console.log(`Replaced ${path} with ${fullUrl}`);
      return `![${alt}](${fullUrl})`;
    }
    
    // If we can't find a direct match, try to construct a proper URL from baseUrl
    if (baseUrl) {
      const cleanPath = path.replace(/^\.\.?\//g, '');
      let constructedUrl = '';
      
      if (baseUrl.includes('github.com') && baseUrl.includes('/blob/')) {
        // Handle GitHub URLs - transform blob URLs to raw content URLs
        const rawBaseUrl = baseUrl
          .replace('github.com', 'raw.githubusercontent.com')
          .replace('/blob/', '/');
          
        // Get the directory part of the base URL
        const dirPath = rawBaseUrl.substring(0, rawBaseUrl.lastIndexOf('/') + 1);
        constructedUrl = `${dirPath}${cleanPath}`;
      } else {
        // For other URLs, just append the path
        const baseWithSlash = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
        constructedUrl = `${baseWithSlash}${cleanPath}`;
      }
      
      return `![${alt}](${constructedUrl})`;
    }
    
    // If all else fails, return original
    return match;
  });
  
  // Only log when we actually made changes
  if (hasReplacements) {
    console.log('Processed markdown content with image replacements');
  }
  
  return replacedText;
}

/**
 * Find a recipe by name in the dataset
 */
export async function findRecipeByName(name: string) {
  let page = 1;
  const limit = 20;
  let found = null;
  let hasMore = true;

  console.log(`Searching for recipe: "${name}"`);

  while (hasMore && !found) {
    console.log(`Checking page ${page}...`);
    const result = await fetchRecipes(page, limit);

    if (!result.data || result.data.length === 0) {
      hasMore = false;
      continue;
    }

    found = result.data.find(r => r.name.includes(name));

    if (!found && page < result.totalPages) {
      page++;
    } else {
      hasMore = false;
    }
  }

  return found;
}
