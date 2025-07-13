/**
 * Utility functions for managing recipe storage in localStorage
 */

interface LastViewedRecipe {
  id: string;
  name: string;
  searchTerm: string;
  timestamp: number;
}

const STORAGE_KEY = 'howtocook_last_viewed_recipe';
const DEFAULT_RECIPE = {
  searchTerm: '酸梅汤',
  name: '酸梅汤'
};

/**
 * Save the last viewed recipe to localStorage
 */
export function saveLastViewedRecipe(id: string, name: string, searchTerm: string): void {
  try {
    const data: LastViewedRecipe = {
      id,
      name,
      searchTerm,
      timestamp: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log('Saved last viewed recipe:', data);
  } catch (error) {
    console.warn('Failed to save last viewed recipe:', error);
  }
}

/**
 * Get the last viewed recipe from localStorage
 * Returns null if no recipe is stored or if it's expired (older than 30 days)
 */
export function getLastViewedRecipe(): LastViewedRecipe | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data: LastViewedRecipe = JSON.parse(stored);
    
    // Check if the stored recipe is older than 30 days
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    if (data.timestamp < thirtyDaysAgo) {
      // Clean up expired data
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return data;
  } catch (error) {
    console.warn('Failed to get last viewed recipe:', error);
    return null;
  }
}

/**
 * Get the initial search term to use (either last viewed or default)
 */
export function getInitialSearchTerm(): string {
  const lastViewed = getLastViewedRecipe();
  return lastViewed ? lastViewed.searchTerm : DEFAULT_RECIPE.searchTerm;
}

/**
 * Get the initial recipe info to load (either last viewed or default)
 */
export function getInitialRecipeInfo(): { searchTerm: string; recipeId?: string } {
  const lastViewed = getLastViewedRecipe();
  
  if (lastViewed) {
    return {
      searchTerm: lastViewed.searchTerm,
      recipeId: lastViewed.id
    };
  }
  
  return {
    searchTerm: DEFAULT_RECIPE.searchTerm
  };
}

/**
 * Clear the stored last viewed recipe
 */
export function clearLastViewedRecipe(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Cleared last viewed recipe');
  } catch (error) {
    console.warn('Failed to clear last viewed recipe:', error);
  }
}
