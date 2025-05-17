import { ReactNode } from 'react';

export interface RecipeData {
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
  allImageUrls?: string[]; // Add this to store all available images for the recipe
  sourceUrl?: string;
}

export interface SectionProps {
  title: string;
  children: ReactNode;
  titleContainerClassName?: string;
  contentContainerClassName?: string;
}

export const DEFAULT_RECIPE_DATA: RecipeData = {
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
  allImageUrls: []
};
