import { HierarchicalItem, RecipeData } from '@/types/recipeTypes';

/**
 * Parse markdown links and convert them to <a> tags
 */
export function parseMarkdownLinks(text: string): React.ReactNode {
  if (!text) return '';
  
  // Regular expression to match markdown links: [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  
  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    // Add the link
    const [, linkText, linkUrl] = match;
    parts.push(
      <a 
        key={match.index} 
        href={linkUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        {linkText}
      </a>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length === 0 ? text : parts;
}

/**
 * Ensures that recipe content arrays have the proper hierarchical structure
 */
export function normalizeRecipeContent(recipeData: RecipeData): RecipeData {
  // Helper function to convert array items to HierarchicalItems
  const normalizeArrayItems = (items: any[]): HierarchicalItem[] => {
    if (!items || !Array.isArray(items)) return [];
    
    return items.map(item => {
      if (typeof item === 'object' && item !== null && 'text' in item) {
        // Already has the correct structure
        return {
          text: item.text,
          level: item.level || 0
        };
      }
      // Convert strings or other types to HierarchicalItem
      return {
        text: String(item || ''),
        level: 0
      };
    });
  };
  
  return {
    ...recipeData,
    materials: normalizeArrayItems(recipeData.materials),
    procedure: normalizeArrayItems(recipeData.procedure),
    calculations: normalizeArrayItems(recipeData.calculations),
    extraInfo: normalizeArrayItems(recipeData.extraInfo)
  };
}
