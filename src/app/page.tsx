'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { searchRecipes, getRecipeById } from '@/services/api';
import { DotsThreeIcon } from '@/components/Icons';
import { NavigationDropdown } from '@/components/ui/NavigationDropdown';
import { RecipeData, DEFAULT_RECIPE_DATA } from '@/types/recipeTypes';
import { SearchBar } from '@/components/recipe/SearchBar';
import { RecipeDisplay } from '@/components/recipe/RecipeDisplay';
import { parseMarkdownLinks, normalizeRecipeData } from '@/utils/recipeUtils';
import { getInitialRecipeInfo, saveLastViewedRecipe } from '@/utils/recipeStorage';

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
        
        const allImages = [
          ...(fullRecipe.imageUrl ? [fullRecipe.imageUrl] : []),
          ...(fullRecipe.images || [])
        ];
        setRecipeImages(allImages);
        
        console.debug('Recipe content debug:', {
          materialsCount: fullRecipe.materials?.length || 0,
          calculationsCount: fullRecipe.calculations?.length || 0,
          procedureCount: fullRecipe.procedure?.length || 0,
          extraInfoCount: fullRecipe.extraInfo?.length || 0,
          materialsSample: fullRecipe.materials?.length > 0 ? 
            JSON.stringify(fullRecipe.materials[0]).substring(0, 200) : 'none'
        });
        
        setRecipeData({
          ...DEFAULT_RECIPE_DATA,
          _id: fullRecipe._id || "",
          name: fullRecipe.name || "",
          recipeName: fullRecipe.name || searchTerm,
          category: fullRecipe.category || "",
          recipeLink: fullRecipe.sourceUrl || "#",
          imageUrl: fullRecipe.imageUrl || null,
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
        
        setHasSelectedRecipe(true);
        
        // Save this recipe as the last viewed for future visits
        if (fullRecipe._id && fullRecipe.name) {
          saveLastViewedRecipe(
            fullRecipe._id, 
            fullRecipe.name, 
            fullRecipe.name || searchTerm
          );
        }
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
    // Get the initial recipe info (either last viewed or default)
    const initialInfo = getInitialRecipeInfo();
    setSearchTerm(initialInfo.searchTerm);
  }, []); 

  useEffect(() => {
    async function loadInitialRecipe() {
      if (initialLoading) {
        try {
          console.log("Loading initial recipe...");
          setContentLoading(true);
          
          // Get the initial recipe info (either last viewed or default)
          const initialInfo = getInitialRecipeInfo();
          
          let fullRecipe = null;
          
          // If we have a stored recipe ID, try to load it directly
          if (initialInfo.recipeId) {
            console.log("Loading last viewed recipe with ID:", initialInfo.recipeId);
            try {
              fullRecipe = await getRecipeById(initialInfo.recipeId);
              if (fullRecipe) {
                console.log("Successfully loaded last viewed recipe:", fullRecipe.name);
              }
            } catch (error) {
              console.log("Failed to load last viewed recipe, falling back to search:", error);
            }
          }
          
          // If no stored recipe or failed to load, search by term
          if (!fullRecipe) {
            console.log("Searching for recipe:", initialInfo.searchTerm);
            const searchResult = await searchRecipes(initialInfo.searchTerm);
            
            if (searchResult.data && searchResult.data.length > 0) {
              const targetRecipe = searchResult.data[0];
              console.log("Search found recipe with ID:", targetRecipe._id);
              fullRecipe = await getRecipeById(targetRecipe._id);
            }
          }
          
          if (fullRecipe) {
            // Debug full recipe data
            console.log("Full recipe received:", {
              id: fullRecipe._id,
              name: fullRecipe.name,
              hasAllArrays: Boolean(fullRecipe.materials && fullRecipe.procedure && 
                                    fullRecipe.calculations && fullRecipe.extraInfo),
                materialsLength: fullRecipe.materials?.length,
                procedureLength: fullRecipe.procedure?.length,
                calculationsLength: fullRecipe.calculations?.length,
                extraInfoLength: fullRecipe.extraInfo?.length,
                materialsType: fullRecipe.materials ? typeof fullRecipe.materials : 'undefined',
                isArrayMaterials: Array.isArray(fullRecipe.materials)
              });
              
              // Force arrays for all content sections if they're undefined
              const normalizedRecipe = {
                ...fullRecipe,
                materials: Array.isArray(fullRecipe.materials) ? fullRecipe.materials : [],
                procedure: Array.isArray(fullRecipe.procedure) ? fullRecipe.procedure : [],
                calculations: Array.isArray(fullRecipe.calculations) ? fullRecipe.calculations : [],
                extraInfo: Array.isArray(fullRecipe.extraInfo) ? fullRecipe.extraInfo : []
              };
              
              const allImages = [
                ...(normalizedRecipe.imageUrl ? [normalizedRecipe.imageUrl] : []),
                ...(normalizedRecipe.images || [])
              ];
              setRecipeImages(allImages);
              
              setHasSelectedRecipe(true);
              setRecipeData({
                ...DEFAULT_RECIPE_DATA,
                _id: normalizedRecipe._id || "",
                name: normalizedRecipe.name || initialInfo.searchTerm,
                recipeName: normalizedRecipe.name || initialInfo.searchTerm,
                category: normalizedRecipe.category || "",
                recipeLink: normalizedRecipe.sourceUrl || "#",
                imageUrl: normalizedRecipe.imageUrl || null,
                description: normalizedRecipe.description || "No description available",
                difficultyLabel: "预估烹饪难度：",
                difficulty: normalizedRecipe.difficulty,
                materialsTitle: "必备原料和工具",
                materials: normalizedRecipe.materials || [],
                calculationsTitle: "计算",
                calculations: normalizedRecipe.calculations || [],
                procedureTitle: "操作",
                procedure: normalizedRecipe.procedure || [],
                extraInfoTitle: "附加内容",
                extraInfo: normalizedRecipe.extraInfo || [],
                allImageUrls: allImages,
                sourceUrl: normalizedRecipe.sourceUrl
              });
              
              // Save this recipe as the last viewed for future visits
              if (normalizedRecipe._id && normalizedRecipe.name) {
                saveLastViewedRecipe(
                  normalizedRecipe._id, 
                  normalizedRecipe.name, 
                  initialInfo.searchTerm
                );
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
    <div className="bg-card min-h-screen font-sans">
      <div className="flex flex-col items-stretch gap-[7px] relative pt-[27px] px-[27px] pb-[100px]">
        <div className="self-end">
          <NavigationDropdown />
        </div>

        <div className="flex flex-col items-start gap-3 self-stretch w-full">
          <h2
            className="font-sans font-normal text-foreground"
            style={{ fontSize: '21px' }}
          >
            How to cook:
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

          <div className="mt-0">
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