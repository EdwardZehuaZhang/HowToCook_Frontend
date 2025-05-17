import { HierarchicalItem } from '@/types/recipeTypes';

/**
 * Safely extract text from a recipe content item which could be:
 * - A string
 * - A HierarchicalItem object with text + level
 * - A MongoDB-style object with text, level, _id
 */
export function getTextFromContentItem(item: any): string {
  if (typeof item === 'string') {
    return item;
  }
  
  if (item && typeof item === 'object') {
    // Handle MongoDB object format
    if ('text' in item) {
      return item.text;
    }
  }
  
  console.warn('Unable to extract text from content item:', item);
  return '';
}

/**
 * Get hierarchical level from a content item
 * Returns 0 if level can't be determined (base level)
 */
export function getLevelFromContentItem(item: any): number {
  if (typeof item === 'string') {
    return 0;
  }
  
  if (item && typeof item === 'object') {
    // Handle MongoDB object format with $numberInt
    if ('level' in item) {
      if (typeof item.level === 'number') {
        return item.level;
      }
      
      // Handle MongoDB $numberInt format
      if (typeof item.level === 'object' && '$numberInt' in item.level) {
        return parseInt(item.level.$numberInt);
      }
    }
  }
  
  return 0;
}

/**
 * Convert any recipe content array to an array of normalized HierarchicalItems
 */
export function normalizeContentArray(contentArray: any[]): HierarchicalItem[] {
  if (!Array.isArray(contentArray)) {
    console.warn('normalizeContentArray received non-array input:', contentArray);
    return [];
  }
  
  return contentArray.map(item => ({
    text: getTextFromContentItem(item),
    level: getLevelFromContentItem(item)
  }));
}

/**
 * Converts hierarchical content to markdown text
 * Useful for rendering with markdown components
 */
export function hierarchicalContentToMarkdown(contentArray: any[]): string {
  if (!Array.isArray(contentArray) || contentArray.length === 0) {
    return '';
  }
  
  return contentArray
    .map(item => {
      const text = getTextFromContentItem(item);
      const level = getLevelFromContentItem(item);
      
      // Add indentation based on level
      if (level > 0) {
        return '  '.repeat(level - 1) + text;
      }
      return text;
    })
    .join('\n\n');
}
