'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { fetchRecipes, searchRecipes, getRecipeById } from '@/services/api';

import { DotsThreeIcon, XIcon, AsteriskIcon } from '@/components/Icons';

interface RecipeData {
  pageTitle: string;
  recipeName: string;
  recipeLink: string;
  imageUrl: string | null;
  imageAiHint: string;
  description: string;
  difficultyLabel: string;
  difficulty?: number;
  materialsTitle: string;
  materials: string[];
  calculationsTitle: string;
  calculations: string[];
  procedureTitle: string;
  procedure: string[];
  extraInfoTitle: string;
  extraInfo: string[];
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  titleContainerClassName?: string;
  contentContainerClassName?: string;
}

const recipeHeadingFontSize = '16px';
const recipeDescriptionFontSize = '12px';

export default function HomePage() {
  const [recipeData, setRecipeData] = useState<RecipeData>({
    pageTitle: "How to cook:",
    recipeName: "",
    recipeLink: "#",
    imageUrl: null,
    imageAiHint: "",
    description: "",
    difficultyLabel: "预估烹饪难度：",
    difficulty: undefined,
    materialsTitle: "必备原料和工具",
    materials: [],
    calculationsTitle: "计算",
    calculations: [],
    procedureTitle: "操作",
    procedure: [],
    extraInfoTitle: "附加内容",
    extraInfo: [],
  });
  const [initialLoading, setInitialLoading] = useState(true); // For first page load only
  const [contentLoading, setContentLoading] = useState(false); // For subsequent searches
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("酸梅汤");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Array<{_id: string, name: string}>>([]);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

  }

  const handleRecipeSelect = async (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    setShowSearchResults(false);
    setContentLoading(true);
    
    try {
      const fullRecipe = await getRecipeById(recipeId);
      if (fullRecipe) {
        setRecipeData({
          pageTitle: "How to Cook:",
          recipeName: fullRecipe.name || searchTerm,
          recipeLink: fullRecipe.sourceUrl || "#",
          imageUrl: fullRecipe.imageUrl || null,
          imageAiHint: searchTerm,
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
        });
      }
    } catch (err) {
      console.error('Error loading recipe details:', err);
      setError('加载食谱详情出错');
      setTimeout(() => setError(null), 3000);
    } finally {
      setContentLoading(false);
    }
  };

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
  // This ensures we only set the search term once during initial mount
    setSearchTerm("酸梅汤");
  }, []); // Empty dependency array = run once on mount

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.trim().length > 0) {
        try {
          setSearchLoading(true);
          setShowSearchResults(true);
          
          const results = await searchRecipes(searchTerm);
          if (results.data && results.data.length > 0) {
            setSearchResults(results.data.map(recipe => ({ 
              _id: recipe._id, 
              name: recipe.name 
            })));
          } else {
            setSearchResults([]);
          }
        } catch (err) {
          console.error('Error fetching search results:', err);
          setSearchResults([]);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setShowSearchResults(false);
        setSearchResults([]);
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    async function loadInitialRecipe() {
      if (initialLoading) {
        try {
          console.log("Loading initial recipe...");
          setContentLoading(true);
          
          // Try to find the initial recipe (酸梅汤)
          const searchResult = await searchRecipes("酸梅汤");
          
          if (searchResult.data && searchResult.data.length > 0) {
            const targetRecipe = searchResult.data[0];
            const fullRecipe = await getRecipeById(targetRecipe._id);
            
            if (fullRecipe) {
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

  function parseMarkdownLinks(text: string): React.ReactNode[] {
    if (!text) return [null];

    // Regular expression to match markdown links: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];

    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      // Add the link as a JSX element with no extra spaces
      parts.push(
        <Link
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {match[1]}
        </Link>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add any remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  }

  async function findRecipeByName(name) {
    let page = 1;
    const limit = 20;
    let found = null;
    let hasMore = true;

    console.log(`Searching for recipe: "${name}"`);

    while (hasMore && !found) {
      console.log(`Checking page ${page}...`);
      const result = await fetchRecipes(page, limit);

      if (!result.data || result.data.length === 0) {
        hasMore = false;
        continue;
      }

      found = result.data.find(r => r.name.includes(name));

      if (!found && page < result.totalPages) {
        page++;
      } else {
        hasMore = false;
      }
    }

    return found;
  }

  const Section: React.FC<SectionProps> = ({ title, children, titleContainerClassName, contentContainerClassName }) => {
    return (
      <div className="flex flex-col items-start gap-2 self-stretch w-full">
        <div
          className={cn("font-medium text-foreground", titleContainerClassName)}
          style={{ fontSize: recipeHeadingFontSize }}
        >
          {title}
        </div>
        <div className="self-stretch w-full h-[0.5px] bg-foreground"></div>
        <div
          className={cn("font-normal text-foreground leading-relaxed self-stretch", contentContainerClassName)}
          style={{ fontSize: recipeDescriptionFontSize }}
        >
          {children}
        </div>
      </div>
    );
  };

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

        <div className="flex flex-col items-start gap-5 self-stretch w-full">
          <h2
            className="font-sans font-normal text-foreground"
            style={{ fontSize: '21px' }}
          >
            {recipeData.pageTitle}
          </h2>

          <div className="flex flex-col items-start gap-1.5 self-stretch w-full max-w-full">
            <div className="flex items-center justify-between self-stretch w-full max-w-full">
              <form onSubmit={handleSearch} className="flex-1 overflow-hidden">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="搜索食谱..."
                  className="w-full font-normal text-foreground bg-transparent border-0 outline-none truncate"
                  style={{ fontSize: '27px' }}
                />
              </form>
              <div className="flex-shrink-0">
                <XIcon width={25} height={25} className="text-foreground cursor-pointer ml-2" onClick={() => setSearchTerm('')} />
              </div>
            </div>
            <div className="self-stretch w-full h-[0.5px] bg-foreground"></div>
            {error && (
              <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
                {error}
              </div>
            )}
            {/* Search results with loading state */}
            {showSearchResults && (
              <div className="flex-col items-start gap-4 bg-card flex relative self-stretch w-full mt-4">
                {searchLoading ? (
                  <div className="p-1 text-center">
                    <div className="inline-block w-4 h-4 border border-t-transparent border-foreground rounded-full animate-spin mr-2"></div>
                    搜索中...
                  </div>
                ) : (
                  <>
                    {searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <div
                          key={result._id}
                          className="relative self-stretch cursor-pointer hover:bg-accent/10 transition-colors p-1"
                          style={{ fontSize: recipeHeadingFontSize }}
                          onClick={() => handleRecipeSelect(result._id)}
                        >
                          {result.name}
                        </div>
                      ))
                    ) : searchTerm.trim().length > 0 ? (
                      <div className="relative self-stretch p-1" style={{ fontSize: recipeHeadingFontSize }}>
                        未找到相关食谱
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col items-start gap-3.5 self-stretch w-full">
            {contentLoading ? (
              <div className="flex items-center justify-center w-full py-20">
                <div className="w-8 h-8 border border-t-transparent border-foreground rounded-full animate-spin"></div>
              </div>
            ) : (
              // Updated condition: Don't show while search is in progress
              (!showSearchResults && !searchLoading && searchTerm.trim()) ? (
                <div className="flex flex-col items-start gap-3.5 self-stretch w-full">
                  {recipeData.imageUrl && (
                    <div className="relative self-stretch w-full h-[131px]">
                      <Image
                        src={recipeData.imageUrl}
                        alt={recipeData.recipeName}
                        fill
                        sizes="(max-width: 768px) 100vw, 332px"
                        style={{ objectFit: 'cover' }}
                        priority
                      />
                    </div>
                  )}

                  <div className="flex flex-col items-start gap-9 self-stretch w-full">
                    {recipeData.description && recipeData.description !== "No description available" && (
                      <p
                        className="font-normal text-foreground leading-relaxed self-stretch"
                        style={{ fontSize: recipeDescriptionFontSize }}
                      >
                        {parseMarkdownLinks(recipeData.description)}
                      </p>
                    )}
                    
                    {/* Rest of your recipe content */}
                    {/* Your existing sections */}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
}