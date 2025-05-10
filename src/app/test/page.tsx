'use client';

import { useEffect, useState } from 'react';
import { fetchRecipes } from '@/services/api';

export default function TestPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      const data = await fetchRecipes(1, 10);
      console.log('API response:', data);
      setRecipes(data.data || []);
      setLoading(false);
    }
    fetchData();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">API Test Results</h1>
      {recipes.length === 0 ? (
        <p>No recipes found</p>
      ) : (
        <ul className="list-disc pl-5">
          {recipes.map(recipe => (
            <li key={recipe._id} className="mb-2">
              <strong>{recipe.name}</strong> - {recipe.category}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}