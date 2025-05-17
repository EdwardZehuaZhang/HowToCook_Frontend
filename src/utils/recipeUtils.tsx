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
 */
export function replaceImagePaths(markdownText: string, baseUrl: string, allImageUrls: string[]): string {
  if (!markdownText) return '';
  
  // Regular expression to match markdown image syntax
  const imageRegex = /!\[(.*?)\]\(([^)]+)\)/g;
  
  // GitHub URLs transformation helper - ensure we use the media.githubusercontent.com format
  const transformGithubUrl = (url: string): string => {
    // Convert raw.githubusercontent.com URLs to media.githubusercontent.com/media/ format
    if (url.includes('raw.githubusercontent.com')) {
      return url.replace('raw.githubusercontent.com', 'media.githubusercontent.com/media');
    }
    
    // Convert github.com blob URLs to media.githubusercontent.com/media format
    if (url.includes('github.com/') && url.includes('/blob/')) {
      return url.replace('github.com/', 'media.githubusercontent.com/media/').replace('/blob/', '/');
    }
    
    return url;
  };
  
  // Get the recipe directory from baseUrl if it's a GitHub URL
  let recipeDir = '';
  if (baseUrl.includes('github.com') && baseUrl.includes('/blob/master/dishes/')) {
    recipeDir = baseUrl.substring(0, baseUrl.lastIndexOf('/'));
    recipeDir = transformGithubUrl(recipeDir);
  }
  
  const replacedText = markdownText.replace(imageRegex, (match, alt, path) => {
    // If it's already an absolute URL, transform it to ensure correct format
    if (path.startsWith('http')) {
      const transformedUrl = transformGithubUrl(path);
      return `![${alt}](${transformedUrl})`;
    }
    
    // For relative paths, try different strategies
    
    // 1. Try to find a matching URL in allImageUrls
    const filename = path.split('/').pop();
    if (filename) {
      const fullUrl = allImageUrls.find(url => {
        if (!url) return false;
        return url.includes(encodeURIComponent(filename)) || 
              url.includes(filename) || 
              decodeURIComponent(url).includes(filename);
      });
      
      if (fullUrl) {
        return `![${alt}](${fullUrl})`;
      }
    }
    
    // 2. If we have a recipe directory, construct a full URL
    if (recipeDir && path) {
      let cleanPath = path;
      // Remove ./ prefix if present
      if (cleanPath.startsWith('./')) {
        cleanPath = cleanPath.substring(2);
      }
      const fullPath = `${recipeDir}/${cleanPath}`;
      return `![${alt}](${fullPath})`;
    }
    
    // 3. If we can't construct a path, return the original match
    return match;
  });
  
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
