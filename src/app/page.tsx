'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { fetchRecipes, searchRecipes, getRecipeById } from '@/services/api';

import DotsThreeIcon from '@/assets/icons/dots-three.svg';
import XIcon from '@/assets/icons/x.svg';
import AsteriskIcon from '@/assets/icons/asterisk.svg';

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

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    if (!searchTerm.trim()) {
      // Clear recipe data to show blank state
      setRecipeData({
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
      return;
    }

    setIsSearching(true);
    setContentLoading(true); // Use contentLoading instead of loading

    try {
      console.log(`Searching for: ${searchTerm}`);

      // Try to search for the recipe
      const searchResult = await searchRecipes(searchTerm);

      if (searchResult.data && searchResult.data.length > 0) {
        const targetRecipe = searchResult.data[0];
        console.log("Found recipe:", targetRecipe.name);

        const fullRecipe = await getRecipeById(targetRecipe._id);

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
      } else {
        setError(`未找到"${searchTerm}"的相关食谱`);
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error('Error searching recipes:', err);
      setError('搜索出错，请稍后再试');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsSearching(false);
      setContentLoading(false);
    }
  }

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Wait 500ms after typing stops

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    async function fetchRecipeData() {
      if (!searchTerm.trim()) {
        // Clear recipe data to show blank state
        setRecipeData({
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
        setInitialLoading(false);
        return;
      }
      try {
        setContentLoading(true);
        console.log("Fetching recipes...");

        // First try direct fetch of recipes
        const allRecipes = await fetchRecipes(1, 20);
        console.log("Fetched recipes:", allRecipes.data?.length || 0);

        // Look for recipe with 酸梅汤 in the name
        let targetRecipe = allRecipes.data?.find(r =>
          r.name && r.name.includes('酸梅汤')
        );

        // If not found, try the search endpoint
        if (!targetRecipe) {
          try {
            console.log("Trying search endpoint...");
            const searchResult = await searchRecipes(searchTerm);
            console.log("Search results:", searchResult.data?.length || 0);

            if (searchResult.data && searchResult.data.length > 0) {
              targetRecipe = searchResult.data[0];
            }
          } catch (searchErr) {
            console.error("Search failed:", searchErr);
            // Continue execution even if search fails
          }
        }

        // If we found a recipe, get its full details
        if (targetRecipe) {
          console.log("Found recipe:", targetRecipe.name, "with ID:", targetRecipe._id);
          try {
            const fullRecipe = await getRecipeById(targetRecipe._id);

            if (fullRecipe) {
              console.log("Got full recipe");
              // Update with actual data
              setRecipeData({
                pageTitle: "How to cook:",
                recipeName: fullRecipe.name || "酸梅汤",
                recipeLink: fullRecipe.sourceUrl || "#",
                // Don't use external image service
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
          } catch (detailErr) {
            console.error("Failed to get full recipe:", detailErr);
          }
        } else {
          console.log("Recipe not found, using default data");
        }
      } catch (err) {
        console.error('Error in recipe fetch process:', err);
      } finally {
        setInitialLoading(false); // Always turn off initial loading
        setContentLoading(false); // Turn off content loading
      }
    }

    fetchRecipeData();
  }, [searchTerm]);

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
          <Image src={DotsThreeIcon} alt="Menu" width={36} height={36} className="text-foreground" />
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
                <Image
                  src={XIcon}
                  alt="Clear search"
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
          </div>

          <div className="flex flex-col items-start gap-3.5 self-stretch w-full">
            {contentLoading ? (
              <div className="flex items-center justify-center w-full py-20">
                <div className="w-8 h-8 border-4 border-t-transparent border-foreground rounded-full animate-spin"></div>
              </div>
            ) : (
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

                  {/* Only show sections if searchTerm exists */}
                  {searchTerm.trim() && (
                    <>
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
                              <Image
                                key={i}
                                src={AsteriskIcon}
                                alt={`Difficulty level ${i + 1}`}
                                width={21}
                                height={21}
                                className="text-foreground ml-1"
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
                            // Check if the line starts with a bullet point
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
                                // Remove the style prop entirely
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
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}