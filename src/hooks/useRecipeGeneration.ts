import { useState, useCallback } from 'react';
import { generateRecipeWithAI } from '@/services/api';

interface RecipeSelections {
  vegetables?: string[];
  meats?: string[];
  staples?: string[];
  equipment?: string[];
  mode?: string[];
}

interface GeneratedRecipeData {
  recipe: any; // You can define a more specific type based on your Recipe model
  rawMarkdown: string;
}

export function useRecipeGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipeData | null>(null);

  const generateRecipe = useCallback(async (selections: RecipeSelections) => {
    try {
      setIsGenerating(true);
      setError(null);
      setGeneratedRecipe(null);

      console.log('Starting recipe generation with selections:', selections);
      
      const result = await generateRecipeWithAI(selections);
      
      setGeneratedRecipe(result);
      return result;
      
    } catch (err) {
      console.error('Recipe generation failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate recipe';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearRecipe = useCallback(() => {
    setGeneratedRecipe(null);
    setError(null);
  }, []);

  return {
    generateRecipe,
    isGenerating,
    error,
    generatedRecipe,
    clearError,
    clearRecipe
  };
}
