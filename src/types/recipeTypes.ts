import { ReactNode } from 'react';

export interface HierarchicalItem {
  text: string;
  level: number;
}

export interface RecipeData {
  _id: string;
  name: string;
  recipeName: string;
  category: string;
  difficulty: number;
  difficultyLabel: string;
  description?: string;
  materials: string[] | HierarchicalItem[];
  calculations: string[] | HierarchicalItem[];
  procedure: string[] | HierarchicalItem[];
  extraInfo: string[] | HierarchicalItem[];
  imageUrl: string;
  images?: string[];
  allImageUrls?: string[];
  sourceUrl: string;
  recipeLink?: string;
  materialsTitle: string;
  calculationsTitle: string;
  procedureTitle: string;
  extraInfoTitle: string;
  lastUpdated?: Date;
}

export interface SectionProps {
  title: string;
  children: ReactNode;
  titleContainerClassName?: string;
  contentContainerClassName?: string;
}

export const DEFAULT_RECIPE_DATA: RecipeData = {
  _id: "",
  name: "",
  recipeName: "",
  category: "",
  difficulty: 0,
  difficultyLabel: "预估烹饪难度：",
  description: "",
  materials: [],
  calculations: [],
  procedure: [],
  extraInfo: [],
  imageUrl: "",
  images: [],
  allImageUrls: [],
  sourceUrl: "",
  recipeLink: "#",
  materialsTitle: "必备原料和工具",
  calculationsTitle: "计算",
  procedureTitle: "操作",
  extraInfoTitle: "附加内容",
  lastUpdated: undefined
};
