'use client';

import React, { useState, useEffect, useRef } from 'react';
import { searchRecipes, getRecipeById } from '@/services/api';
import { DotsThreeIcon } from '@/components/Icons';
import { RecipeData, DEFAULT_RECIPE_DATA } from '@/types/recipeTypes';
import { SearchBar } from '@/components/recipe/SearchBar';
import { RecipeDisplay } from '@/components/recipe/RecipeDisplay';
// Keep only necessary imports
import { parseMarkdownLinks } from '@/utils/recipeUtils';

export default function HomePage() {
  const [recipeData, setRecipeData] = useState<RecipeData>(DEFAULT_RECIPE_DATA);
  const [initialLoading, setInitialLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("酸梅汤");
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [hasSelectedRecipe, setHasSelectedRecipe] = useState<boolean>(false);
  const [recipeImages, setRecipeImages] = useState<string[]>([]);
  const preventSearchRef = useRef(false);

  const handleSearchTermChange = (term: string) => {
    if (term !== searchTerm) {
      // Only set hasSelectedRecipe to false when completely clearing the search term
      // This prevents losing the display when just editing the search
      if (term.trim() === "") {
        setHasSelectedRecipe(false);
      }
    }
    setSearchTerm(term);
  };

  const handleRecipeSelect = async (recipeId: string) => {
    preventSearchRef.current = true;

    setSelectedRecipeId(recipeId);
    setContentLoading(true);
    
    try {
      const fullRecipe = await getRecipeById(recipeId);
      if (fullRecipe) {
        setSearchTerm(fullRecipe.name || "");
        
        // Store all available image URLs including the main image
        const allImages = [
          ...(fullRecipe.imageUrl ? [fullRecipe.imageUrl] : []),
          ...(fullRecipe.images || [])
        ];
        setRecipeImages(allImages);
        
        setRecipeData({
          pageTitle: "How to cook:",
          recipeName: fullRecipe.name || searchTerm,
          recipeLink: fullRecipe.sourceUrl || "#",
          imageUrl: fullRecipe.imageUrl || null,
          imageAiHint: fullRecipe.name || searchTerm,
          description: fullRecipe.description || "No description available",
          difficultyLabel: "预估烹饪难度：",
          difficulty: fullRecipe.difficulty,
          materialsTitle: "必备原料和工具",
          materials: fullRecipe.materials || [],
          calculationsTitle: "计算",
          calculations: fullRecipe.calculations || [],
          procedureTitle: "操作",
          procedure: fullRecipe.procedure || [],
          extraInfoTitle: "附加内容",
          extraInfo: fullRecipe.extraInfo || [],
          allImageUrls: allImages, // Add the images to the recipe data
          sourceUrl: fullRecipe.sourceUrl
        });
        
        // Set hasSelectedRecipe flag to true when a recipe is selected
        setHasSelectedRecipe(true);
      }
    } catch (err) {
      console.error('Error loading recipe details:', err);
      setError('加载食谱详情出错');
      setTimeout(() => setError(null), 3000);
    } finally {
      setContentLoading(false);
      setTimeout(() => {
        preventSearchRef.current = false;
      }, 500);
    }
  };

  useEffect(() => {
    setSearchTerm("酸梅汤");
  }, []); 

  useEffect(() => {
    async function loadInitialRecipe() {
      if (initialLoading) {
        try {
          console.log("Loading initial recipe...");
          setContentLoading(true);
          
          const searchResult = await searchRecipes("酸梅汤");
          
          if (searchResult.data && searchResult.data.length > 0) {
            const targetRecipe = searchResult.data[0];
            const fullRecipe = await getRecipeById(targetRecipe._id);
            
            if (fullRecipe) {
              // Store all available image URLs
              const allImages = [
                ...(fullRecipe.imageUrl ? [fullRecipe.imageUrl] : []),
                ...(fullRecipe.images || [])
              ];
              setRecipeImages(allImages);
              
              setHasSelectedRecipe(true);
              setRecipeData({
                pageTitle: "How to cook:",
                recipeName: fullRecipe.name || "酸梅汤",
                recipeLink: fullRecipe.sourceUrl || "#",
                imageUrl: fullRecipe.imageUrl || null,
                imageAiHint: "chinese plum soup",
                description: fullRecipe.description || "No description available",
                difficultyLabel: "预估烹饪难度：",
                difficulty: fullRecipe.difficulty,
                materialsTitle: "必备原料和工具",
                materials: fullRecipe.materials || [],
                calculationsTitle: "计算",
                calculations: fullRecipe.calculations || [],
                procedureTitle: "操作",
                procedure: fullRecipe.procedure || [],
                extraInfoTitle: "附加内容",
                extraInfo: fullRecipe.extraInfo || [],
                allImageUrls: allImages,
                sourceUrl: fullRecipe.sourceUrl
              });
            }
          }
        } catch (err) {
          console.error('Error in initial recipe load:', err);
        } finally {
          setInitialLoading(false);
          setContentLoading(false);
        }
      }
    }

    loadInitialRecipe();
  }, [initialLoading]);

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading recipe...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-solid border-border w-[375px] h-auto mx-auto shadow-lg rounded-md font-sans">
      <div className="flex flex-col w-[332px] items-stretch gap-[7px] relative top-[27px] left-[23px] pb-[100px]">
        <div className="self-end">
          <DotsThreeIcon width={36} height={36} className="text-foreground" />
        </div>

        <div className="flex flex-col items-start gap-3 self-stretch w-full">
          <h2
            className="font-sans font-normal text-foreground"
            style={{ fontSize: '21px' }}
          >
            {recipeData.pageTitle}
          </h2>

          <SearchBar 
            searchTerm={searchTerm} 
            onSearchTermChange={handleSearchTermChange}
            onRecipeSelect={handleRecipeSelect}
            defaultSearchTerm="酸梅汤"
          />

          {error && (
            <div className="mt-1 p-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          {/* Show recipe content with reduced gap */}
          <div className="mt-0"> {/* Reduced from mt-1 to mt-0 to decrease gap */}
            {searchTerm.trim() && (hasSelectedRecipe || contentLoading) && (
              <RecipeDisplay 
                recipeData={{
                  ...recipeData,
                  allImageUrls: recipeImages
                }} 
                isLoading={contentLoading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}