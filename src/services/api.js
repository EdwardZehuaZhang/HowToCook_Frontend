// Configuration for API endpoints from environment variables
const API_CONFIG = {
  remote: process.env.NEXT_PUBLIC_REMOTE_BACKEND_URL || 'https://howtocook-backend-b5cb.onrender.com',
  local: process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL || 'http://localhost:5001', 
};

// 🎯 EASY SWITCH: Change NEXT_PUBLIC_BACKEND_MODE in .env.local
// Values: "local" or "remote"
const BACKEND_MODE = process.env.NEXT_PUBLIC_BACKEND_MODE || "local";

/**
 * Get the current API URL based on environment configuration
 */
export function getApiUrl() {
  const url = API_CONFIG[BACKEND_MODE];
  console.log(`🔗 Using ${BACKEND_MODE} backend: ${url}`);
  return url;
}

/**
 * Get current backend mode
 */
export function getBackendMode() {
  return BACKEND_MODE;
}

/**
 * Legacy function for backward compatibility
 */
export function setUseLocalBackend(useLocal) {
  console.log(`Note: Use BACKEND_MODE variable in api.js to switch backends`);
  console.log(`Current mode: ${BACKEND_MODE}, URL: ${getApiUrl()}`);
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
  
  // Extract content from possibly nested objects with text fields
  const extractText = (item) => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object' && 'text' in item) return item.text;
    return '';
  };
  
  // Look for image URLs in various content sections
  const sections = [
    recipe.description,
    ...(Array.isArray(recipe.materials) ? recipe.materials.map(extractText) : []),
    ...(Array.isArray(recipe.calculations) ? recipe.calculations.map(extractText) : []),
    ...(Array.isArray(recipe.procedure) ? recipe.procedure.map(extractText) : []),
    ...(Array.isArray(recipe.extraInfo) ? recipe.extraInfo.map(extractText) : [])
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
    
    // Log the response headers to check for content-length
    console.log('Response headers:', {
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length')
    });
    
    // Get the complete response text
    const responseText = await response.text();
    console.log('Raw API response length:', responseText.length);
    console.log('Raw API response preview:', responseText.substring(0, 500) + '...');
    
    // Parse the JSON response
    let rawRecipe;
    try {
      rawRecipe = JSON.parse(responseText);
      console.log('Recipe parsing successful, checking fields:');
      console.log('Has materials:', Boolean(rawRecipe.materials));
      console.log('Has procedure:', Boolean(rawRecipe.procedure));
      console.log('Has calculations:', Boolean(rawRecipe.calculations));
      console.log('Has extraInfo:', Boolean(rawRecipe.extraInfo));
      
      // Log array lengths if present
      if (rawRecipe.materials) console.log('Materials length:', Array.isArray(rawRecipe.materials) ? rawRecipe.materials.length : 'not an array');
      if (rawRecipe.procedure) console.log('Procedure length:', Array.isArray(rawRecipe.procedure) ? rawRecipe.procedure.length : 'not an array');
    } catch (parseError) {
      console.error('Error parsing recipe JSON:', parseError);
      console.error('Response text causing error:', responseText);
      throw parseError;
    }
    
    // Import the trace utility dynamically to avoid SSR issues
    const { traceRecipeData } = await import('@/utils/debugUtils');
    traceRecipeData(rawRecipe, 'API Response Raw');
    
    // Create a normalized recipe with guaranteed arrays
    const recipe = {
      ...rawRecipe,
      materials: Array.isArray(rawRecipe.materials) ? rawRecipe.materials : [],
      procedure: Array.isArray(rawRecipe.procedure) ? rawRecipe.procedure : [],
      calculations: Array.isArray(rawRecipe.calculations) ? rawRecipe.calculations : [],
      extraInfo: Array.isArray(rawRecipe.extraInfo) ? rawRecipe.extraInfo : []
    };
    
    // Trace after initial normalization
    traceRecipeData(recipe, 'After Initial Array Normalization');
    
    // Check if arrays contain correctly structured objects, normalize if needed
    ['materials', 'procedure', 'calculations', 'extraInfo'].forEach(field => {
      if (recipe[field] && Array.isArray(recipe[field])) {
        recipe[field] = recipe[field].map(item => {
          // If the item is already an object with text property, return as is
          if (typeof item === 'object' && item !== null && 'text' in item) {
            return item;
          }
          // If the item is a string, convert to object with text property
          if (typeof item === 'string') {
            return { text: item, level: 0 };
          }
          // Default fallback
          return { text: String(item || ''), level: 0 };
        });
      }
    });
    
    // Trace after content normalization
    traceRecipeData(recipe, 'After Content Structure Normalization');
    
    // Process MongoDB's number format if present
    if (recipe.difficulty && typeof recipe.difficulty === 'object' && '$numberInt' in recipe.difficulty) {
      recipe.difficulty = parseInt(recipe.difficulty.$numberInt);
    }
    
    // Add an 'images' property containing all image URLs
    recipe.images = extractRecipeImages(recipe);
    
    console.log(`Successfully fetched and normalized recipe with ID: ${id}`);
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

/**
 * Generate a recipe using AI based on user selections
 */
export async function generateRecipeWithAI(selections) {
  try {
    console.log('Sending recipe generation request:', selections);
    
    const response = await fetch(`${getApiUrl()}/api/recipes/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ selections }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    if (!data.success) {
      throw new Error(data.message || 'Recipe generation failed');
    }

    console.log('Recipe generated successfully:', data.data.recipe.name);
    return data.data;
    
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw error;
  }
}