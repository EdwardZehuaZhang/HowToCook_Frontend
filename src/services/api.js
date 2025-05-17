// Configuration for API endpoints
const API_CONFIG = {
  // Remove the /api suffix from base URLs and add it in individual requests
  remote: 'https://howtocook-backend-b5cb.onrender.com',
  local: 'http://localhost:5000', 
};

// Force using local backend during development
let useLocalBackend = true; 

/**
 * Get the current API URL based on configuration
 */
export function getApiUrl() {
  return useLocalBackend ? API_CONFIG.local : API_CONFIG.remote;
}

/**
 * Switch between local and remote backend
 */
export function setUseLocalBackend(useLocal) {
  useLocalBackend = useLocal;
  console.log(`Using ${useLocalBackend ? 'local' : 'remote'} backend at: ${getApiUrl()}`);
}

/**
 * Fetch paginated recipes
 */
export async function fetchRecipes(page = 1, limit = 10) {
  try {
    const response = await fetch(`${getApiUrl()}/api/recipes?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return { data: [], total: 0, page: 1, totalPages: 0 };
  }
}

/**
 * Search recipes by query and category
 */
export async function searchRecipes(query = '', category = '', page = 1, limit = 10, signal = null) {
  try {
    let url = `${getApiUrl()}/api/search?page=${page}&limit=${limit}`;
    
    if (query) url += `&query=${encodeURIComponent(query)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    
    console.log('Searching with URL:', url);
    
    const response = await fetch(url, { signal }); // Pass the signal to the fetch request
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok. Status: ${response.status}, Details: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    // Rethrow AbortError to be handled by caller
    if (error.name === 'AbortError') {
      throw error;
    }
    
    console.error('Search error details:', error);
    return { data: [], total: 0, page: 1, totalPages: 0 };
  }
}

/**
 * Extract and normalize all image URLs from a recipe
 */
export function extractRecipeImages(recipe) {
  const images = [];
  
  // Add the main recipe image if available
  if (recipe.imageUrl) {
    images.push(recipe.imageUrl);
  }
  
  // If recipe already has allImageUrls property, include those
  if (recipe.allImageUrls && Array.isArray(recipe.allImageUrls)) {
    recipe.allImageUrls.forEach(url => {
      if (!images.includes(url)) {
        images.push(url);
      }
    });
  }
  
  // Look for image URLs in various content sections
  const sections = [
    recipe.description,
    ...(recipe.materials || []),
    ...(recipe.calculations || []),
    ...(recipe.procedure || []),
    ...(recipe.extraInfo || [])
  ];

  // Extract markdown image URLs using regex
  const imageRegex = /!\[.*?\]\((.*?)\)/g;
  for (const section of sections) {
    if (typeof section === 'string') {
      let match;
      while ((match = imageRegex.exec(section)) !== null) {
        const url = match[1];
        if (url && !images.includes(url)) {
          // Convert GitHub URLs to the media.githubusercontent.com format
          const processedUrl = url.includes('raw.githubusercontent.com') 
            ? url.replace('raw.githubusercontent.com', 'media.githubusercontent.com/media')
            : url;
          
          images.push(processedUrl);
        }
      }
    }
  }
  
  return images;
}

/**
 * Get a single recipe by ID
 */
export async function getRecipeById(id) {
  try {
    const url = `${getApiUrl()}/api/recipes/${id}`;
    console.log(`Fetching recipe with ID ${id} from: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch recipe ${id}. Status: ${response.status}, Details:`, errorText);
      throw new Error(`Network response was not ok. Status: ${response.status}`);
    }
    
    const recipe = await response.json();
    
    // Add an 'images' property containing all image URLs
    recipe.images = extractRecipeImages(recipe);
    
    console.log(`Successfully fetched recipe:`, recipe);
    return recipe;
  } catch (error) {
    console.error(`Error fetching recipe with ID ${id}:`, error);
    return null;
  }
}

/**
 * Get all recipe categories
 */
export async function getCategories() {
  try {
    const response = await fetch(`${getApiUrl()}/api/categories`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}