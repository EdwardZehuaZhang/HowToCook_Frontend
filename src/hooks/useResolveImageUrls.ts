import { useCallback } from 'react';

/**
 * Hook to resolve image URLs in markdown content
 */
export function useResolveImageUrls(imageUrls: string[] = [], baseUrl: string = '') {
  return useCallback((content: string): string => {
    if (!content) return '';
    
    // Replace image markdown with actual URLs
    let processedContent = content;
    
    // Match image markdown patterns: ![alt text](image-path)
    const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
    
    processedContent = processedContent.replace(imgRegex, (match, altText, imagePath) => {
      // If it's already a full URL, leave it as is
      if (imagePath.startsWith('http')) {
        return match;
      }
      
      // Try to find a matching image URL in our collection
      const matchingImage = imageUrls.find(url => url.includes(imagePath));
      if (matchingImage) {
        return `![${altText}](${matchingImage})`;
      }
      
      // If no match is found, try to use the baseUrl to form a path
      if (baseUrl) {
        const basePath = baseUrl.substring(0, baseUrl.lastIndexOf('/'));
        return `![${altText}](${basePath}/${imagePath})`;
      }
      
      // If all else fails, return the original match
      return match;
    });
    
    return processedContent;
  }, [imageUrls, baseUrl]);
}
