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
    recipeName: "Loading...",
    recipeLink: "#",
    imageUrl: "null",
    imageAiHint: "chinese plum soup",
    description: "砂糖椰子冰沙是一种制作极其快速方便的饮料，若原料选择得当则口感丰富。然而制作时动静较大，适合白天在家制作以作为下午茶。",
    difficultyLabel: "预估烹饪难度：",
    difficulty: 1,
    materialsTitle: "必备原料和工具",
    materials: [
      "酸梅晶固体饮料",
      "方糖（可选）",
      "北京二锅头酒（可选）",
    ],
    calculationsTitle: "计算",
    calculations: [
      "一杯分量，约 350 毫升（含冰）",
      "",
      "金酒 30~40 毫升",
      "汤力水气泡水 1 罐",
      "柠檬 1 个",
      "冰块 100 克",
    ],
    procedureTitle: "操作",
    procedure: [
      "<strong>柠檬的处理</strong>",
      "",
      "1 将柠檬对半切（刀方向垂直于柠檬的头尾连线），并从其中的",
      "&nbsp;&nbsp;一半中切取一片柠檬备用",
      "2 再次将柠檬对半切，将得到的 4 角柠檬用压汁器压出柠檬汁置",
      "&nbsp;&nbsp;于容器中备用",
      "",
      "<strong>正式调配</strong>",
      "",
      "1 选择一个杯子，建议使用容量在 350~400 毫升的透明玻璃杯",
      "2 将 100 克冰块放置在杯底",
      "3 倒入 30~40 毫升金酒",
      "4 倒入 15 毫升柠檬汁（如果喜酸可以加多点或全加）",
      "5 用勺子搅拌均匀",
      "6 将之前准备的一片柠檬放置好",
      "7 缓慢沿杯壁注入汤力水直至满杯（不要倒在冰上，避免起泡流失）",
      "8 用勺子轻轻上下提拉将液体搅拌均匀（不要旋转搅拌，避免起泡流失）",
      "9 在液面放置好装饰用的绿叶（可选）",
    ],
    extraInfoTitle: "附加内容",
    extraInfo: [
      "如果没有准备方糖或北京二锅头，可以省略操作中的第 4 步或第 5 步。",
      "放入冰箱冷藏后再饮用效果更佳。",
      "饮酒请勿驾车。",
      "如果您遵循本指南的制作流程而发现有问题或可以改进的流程，请提出 Issue 或 Pull request 。",
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  async function fetchRecipeData() {
  try {
    setLoading(true);
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
        const searchResult = await searchRecipes('酸梅');
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
    setLoading(false);
  }
}

  fetchRecipeData();
}, []);


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

// Then call it in your effect

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

  if (loading) {
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

          <div className="flex flex-col items-start gap-1.5 self-stretch w-full">
            <div className="flex items-center justify-between self-stretch w-full">
              <Link
                href={recipeData.recipeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-normal text-foreground hover:underline"
                style={{ fontSize: '27px' }}
              >
                {recipeData.recipeName}
              </Link>
              <Image src={XIcon} alt="Close" width={25} height={25} className="text-foreground cursor-pointer" />
            </div>
            <div className="self-stretch w-full h-[0.5px] bg-foreground"></div>
          </div>

          <div className="flex flex-col items-start gap-3.5 self-stretch w-full">
            <div className="relative self-stretch w-full h-[131px]">
              {recipeData.imageUrl ? (
                <Image
                  src={recipeData.imageUrl}
                  alt={recipeData.recipeName}
                  fill
                  sizes="(max-width: 768px) 100vw, 332px" // Added this line
                  style={{ objectFit: 'cover' }}
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted rounded">
                  <p className="text-muted-foreground text-sm">暂无图片 (No image available)</p>
                </div>
              )}
            </div>

            <div className="flex flex-col items-start gap-9 self-stretch w-full">
              <p
                className="font-normal text-foreground leading-relaxed self-stretch"
                style={{ fontSize: recipeDescriptionFontSize }}
              >
                {recipeData.description ? 
                    parseMarkdownLinks(recipeData.description) : 
                    "No description available"}
                </p>

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
                        alt={`Difficulty level ${i+1}`} 
                        width={21} 
                        height={21} 
                        className="text-foreground ml-1" 
                      />
                    ))}
                  </div>
                ) : (
                  <span className="text-foreground ml-1 text-sm">未指定</span>
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
                  {recipeData.procedure.map((line, index) => (
                    <div key={index} className="whitespace-pre-wrap">
                      {parseMarkdownLinks(line.replace(/&nbsp;/g, '\u00A0'))}
                    </div>
                  ))}
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
          </div>
        </div>
      </div>
    </div>
  );
}