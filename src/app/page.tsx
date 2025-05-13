'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { fetchRecipes, searchRecipes, getRecipeById } from '@/services/api';
import SafeImage from '@/components/SafeImage';

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
  const [searchResultsVisible, setSearchResultsVisible] = useState(false);
  const [isRecipeJustSelected, setIsRecipeJustSelected] = useState<boolean>(false);
  const preventSearchRef = useRef(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
  }

  const handleRecipeSelect = async (recipeId: string) => {
    preventSearchRef.current = true;

    setSelectedRecipeId(recipeId);
    setShowSearchResults(false);
    setSearchResultsVisible(false);
    setContentLoading(true);
    
    try {
      const fullRecipe = await getRecipeById(recipeId);
      if (fullRecipe) {
        setSearchTerm(fullRecipe.name || "");
        
        setRecipeData({
          pageTitle: "How to Cook:",
          recipeName: fullRecipe.name || searchTerm,
          recipeLink: fullRecipe.sourceUrl || "#",
          imageUrl: fullRecipe.imageUrl || null,
          imageAiHint: fullRecipe.name || searchTerm, // Also update this for consistency
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
      setTimeout(() => {
        preventSearchRef.current = false;
      }, 500);
    }
  };

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    setSearchTerm("酸梅汤");
  }, []); 

  useEffect(() => {
    if (preventSearchRef.current) {
      return;
    }

    const timer = setTimeout(async () => {
      if (searchTerm.trim().length > 0) {
        try {
          setSearchLoading(true);
          setShowSearchResults(true);
          setSearchResultsVisible(true);
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
        setSearchResultsVisible(false);
        setTimeout(() => {
          setShowSearchResults(false);
          setSearchResults([]);
        }, 300);
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

    // First handle links with the original regex
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const boldRegex = /\*\*([^*]+)\*\*/g;  // New regex for bold text
    const parts: React.ReactNode[] = [];

    // Create a combined regex to find all formatting tokens in order
    const combinedRegex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*)/g;
    let lastIndex = 0;
    let match;

    while ((match = combinedRegex.exec(text)) !== null) {
      // Add text before the formatted section
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      if (match[0].startsWith('[')) {
        // This is a link - use previous link handling logic
        const linkText = match[2];
        const url = match[3];
        
        parts.push(
          <Link
            key={match.index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {linkText}
          </Link>
        );
      } else {
        // This is bold text
        const boldText = match[4];
        parts.push(
          <strong key={match.index} className="font-bold">
            {boldText}
          </strong>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add any remaining text after the last formatting
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
            <div className="flex items-center justify-between self-stretch w-full max-w-full relative">
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
                <XIcon 
                  width={25} 
                  height={25} 
                  className="text-foreground cursor-pointer ml-2" 
                  onClick={() => setSearchTerm('')} 
                />
              </div>
            </div>
            <div className="self-stretch w-full h-[0.5px] bg-foreground"></div>
            {error && (
              <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
                {error}
              </div>
            )}
            
            <div className="relative w-full">
              {showSearchResults && (
                <div 
                  className={`absolute z-10 left-0 right-0 bg-card transition-opacity duration-300 ${
                    searchResultsVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ 
                    top: "5px", // Changed from "0" to "10px" to move it down
                    maxHeight: "300px",
                    overflowY: "auto",
                    borderWidth: "0.5px",
                    borderStyle: "solid",
                    borderColor: "currentColor" // Uses text color, same as bg-foreground
                  }}
                >
                  <div className="p-2">
                    {searchLoading ? (
                      <div className="p-4 text-center">
                        <div className="inline-block w-4 h-4 border border-t-transparent border-foreground rounded-full animate-spin mr-2"></div>
                        搜索中...
                      </div>
                    ) : (
                      <>
                        {searchResults.length > 0 ? (
                          searchResults.map((result) => (
                            <div
                              key={result._id}
                              className="relative cursor-pointer hover:bg-accent/10 transition-colors p-3 rounded-sm"
                              style={{ fontSize: recipeHeadingFontSize }}
                              onClick={() => handleRecipeSelect(result._id)}
                            >
                              {result.name}
                            </div>
                          ))
                        ) : searchTerm.trim().length > 0 ? (
                          <div className="relative p-4 text-center" style={{ fontSize: recipeHeadingFontSize }}>
                            未找到相关食谱
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start gap-3.5 self-stretch w-full">
            {contentLoading ? (
              <div className="flex items-center justify-center w-full py-20">
                <div className="w-8 h-8 border-1 border-t-transparent border-foreground rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="flex flex-col items-start gap-3.5 self-stretch w-full">
                {searchTerm.trim() && (
                  <>
                    {recipeData.imageUrl && (
                      <div className="relative self-stretch w-full h-[131px]">
                        <SafeImage
                          src={recipeData.imageUrl}
                          alt={recipeData.recipeName}
                          fill
                          sizes="(max-width: 768px) 100vw, 332px"
                          style={{ objectFit: 'cover' }}
                          priority
                          fallbackSrc="/recipe-placeholder.jpg" // Add a placeholder image to your public folder
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

                      <div className="inline-flex items-center">
                        <div
                          className="font-medium text-foreground"
                          style={{ fontSize: recipeHeadingFontSize }}
                        >
                          {recipeData.difficultyLabel}
                        </div>
                        {recipeData.difficulty ? (
                          <div className="flex">
                            {[...Array(recipeData.difficulty)].map((_, i) => (
                              <AsteriskIcon
                                key={i}
                                width={21}
                                height={21}
                                className="text-foreground ml-1"
                                aria-label={`Difficulty level ${i + 1}`}
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="text-foreground ml-1 text-sm"></span>
                        )}
                      </div>

                      <Section title={recipeData.materialsTitle} titleContainerClassName="w-auto">
                        <div>
                          {recipeData.materials.map((item, index) => (
                            <React.Fragment key={index}>
                              {parseMarkdownLinks(item)}
                              {index < recipeData.materials.length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </div>
                      </Section>

                      <Section title={recipeData.calculationsTitle} titleContainerClassName="w-auto">
                        <div>
                          {recipeData.calculations.map((line, index) => (
                            <React.Fragment key={index}>
                              {parseMarkdownLinks(line)}
                              {(index < recipeData.calculations.length - 1 || line === "") && <br />}
                            </React.Fragment>
                          ))}
                        </div>
                      </Section>

                      <Section title={recipeData.procedureTitle} titleContainerClassName="w-auto">
                        <div>
                          {recipeData.procedure.map((line, index) => {
                            const isBulletPoint = line.trim().startsWith('-') || line.trim().startsWith('•');
                            const bulletText = line.trim().charAt(0);
                            const contentText = isBulletPoint ? line.trim().substring(1).trim() : line;
                            
                            return (
                              <div 
                                key={index} 
                                className={cn(
                                  "whitespace-pre-wrap",
                                  isBulletPoint && "bullet-point"
                                )}
                              >
                                {isBulletPoint ? (
                                  <>
                                    <span>{bulletText}</span>
                                    <span>{parseMarkdownLinks(contentText.replace(/&nbsp;/g, '\u00A0'))}</span>
                                  </>
                                ) : (
                                  parseMarkdownLinks(line.replace(/&nbsp;/g, '\u00A0'))
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </Section>

                      <Section title={recipeData.extraInfoTitle} titleContainerClassName="w-auto">
                        <div>
                          {recipeData.extraInfo.map((line, index) => (
                            <React.Fragment key={index}>
                              {parseMarkdownLinks(line)}
                              {index < recipeData.extraInfo.length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </div>
                      </Section>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}