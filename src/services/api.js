const API_URL = 'http://localhost:5000/api';

/**
 * Fetch paginated recipes
 */
export async function fetchRecipes(page = 1, limit = 10) {
  try {
    const response = await fetch(`${API_URL}/recipes?page=${page}&limit=${limit}`);
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
export async function searchRecipes(query = '', category = '', page = 1, limit = 10) {
  try {
    let url = `${API_URL}/search?page=${page}&limit=${limit}`;
    
    if (query) url += `&query=${encodeURIComponent(query)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    
    console.log('Searching with URL:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok. Status: ${response.status}, Details: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Search error details:', error);
    return { data: [], total: 0, page: 1, totalPages: 0 };
  }
}

/**
 * Get a single recipe by ID
 */
export async function getRecipeById(id) {
  try {
    const response = await fetch(`${API_URL}/recipes/${id}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
}

/**
 * Get all recipe categories
 */
export async function getCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}