'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DotsThreeIcon } from '@/components/Icons';
import { Section } from '@/components/recipe/Section';
import { Bubble } from '@/components/ui/bubble';
import { useRecipeGeneration } from '@/hooks/useRecipeGeneration';
import { RecipeDisplay } from '@/components/recipe/RecipeDisplay';
import { RecipeData } from '@/types/recipeTypes';

export default function MenuPage() {
  const { generateRecipe, isGenerating, error, generatedRecipe } = useRecipeGeneration();
  
  // State to track selected ingredients/equipment - start with empty selections
  const [selectedVegetables, setSelectedVegetables] = useState<string[]>([]);
  const [selectedMeats, setSelectedMeats] = useState<string[]>([]);
  const [selectedStaples, setSelectedStaples] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);

  // Helper function to toggle selection
  const toggleSelection = (item: string, selectedItems: string[], setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Handle recipe generation
  const handleGenerateRecipe = async () => {
    try {
      const selections = {
        vegetables: selectedVegetables,
        meats: selectedMeats,
        staples: selectedStaples,
        equipment: selectedEquipment,
        mode: selectedModes
      };

      console.log('Generating recipe with selections:', selections);
      
      await generateRecipe(selections);
      
    } catch (err) {
      console.error('Failed to generate recipe:', err);
      // Error is already handled by the hook
    }
  };

  // Convert generated recipe to RecipeData format
  const convertToRecipeData = (generatedData: any): RecipeData => {
    const recipe = generatedData.recipe;
    return {
      _id: 'generated-' + Date.now(),
      name: recipe.name,
      recipeName: recipe.name,
      category: recipe.category || 'AI生成',
      difficulty: recipe.difficulty || 1,
      difficultyLabel: `预估烹饪难度：${'★'.repeat(recipe.difficulty || 1)}`,
      description: recipe.description,
      materials: recipe.materials || [],
      calculations: recipe.calculations || [],
      procedure: recipe.procedure || [],
      extraInfo: recipe.extraInfo || [],
      imageUrl: recipe.imageUrl || '',
      allImageUrls: recipe.allImageUrls || [],
      sourceUrl: recipe.sourceUrl || '#',
      materialsTitle: '必备原料和工具',
      calculationsTitle: '计算',
      procedureTitle: '操作',
      extraInfoTitle: '附加内容'
    };
  };

  const vegetables = ['土豆', '胡萝卜', '花菜', '白萝卜', '西葫芦', '番茄', '芹菜', '黄瓜', '洋葱', '莴笋', '菌菇', '茄子', '豆腐', '包菜', '白菜'];
  const meats = ['午餐肉', '香肠', '腊肠', '鸡肉', '猪肉', '鸡蛋', '虾', '牛肉', '骨头', '鱼'];
  const staples = ['面食', '面包', '米', '方便面'];
  const equipment = ['烤箱', '空气炸锅', '微波炉', '电饭煲', '一口能炒又能煮的大锅'];
  const modes = ['模糊匹配', '严格匹配', '生存模式'];

  return (
    <div className="bg-card border border-solid border-border w-[375px] h-auto mx-auto shadow-lg rounded-md font-sans">
      <div className="flex flex-col w-[332px] items-stretch gap-[7px] relative top-[27px] left-[23px] pb-[100px]">
        <div className="self-end">
          <Link href="/" aria-label="Go back to main page">
            <DotsThreeIcon width={36} height={36} className="text-foreground cursor-pointer hover:opacity-75 transition-opacity" />
          </Link>
        </div>

        <div className="flex flex-col items-start gap-3 self-stretch w-full">
          <h2
            className="font-sans font-normal text-foreground"
            style={{ fontSize: '21px' }}
          >
            I have:
          </h2>
        </div>

        <div className="flex flex-col items-start gap-6 self-stretch w-full mt-4">
          <Section title="蔬菜">
            <div className="flex flex-wrap w-full items-start gap-[6px] relative">
              {vegetables.map((vegetable) => (
                <Bubble
                  key={vegetable}
                  isSelected={selectedVegetables.includes(vegetable)}
                  onClick={() => toggleSelection(vegetable, selectedVegetables, setSelectedVegetables)}
                >
                  {vegetable}
                </Bubble>
              ))}
            </div>
          </Section>

          <Section title="肉类">
            <div className="flex flex-wrap w-full items-start gap-[6px] relative">
              {meats.map((meat) => (
                <Bubble
                  key={meat}
                  isSelected={selectedMeats.includes(meat)}
                  onClick={() => toggleSelection(meat, selectedMeats, setSelectedMeats)}
                >
                  {meat}
                </Bubble>
              ))}
            </div>
          </Section>

          <Section title="主食">
            <div className="flex flex-wrap w-full items-start gap-[6px] relative">
              {staples.map((staple) => (
                <Bubble
                  key={staple}
                  isSelected={selectedStaples.includes(staple)}
                  onClick={() => toggleSelection(staple, selectedStaples, setSelectedStaples)}
                >
                  {staple}
                </Bubble>
              ))}
            </div>
          </Section>

          <Section title="厨具">
            <div className="flex flex-wrap w-full items-start gap-[6px] relative">
              {equipment.map((item) => (
                <Bubble
                  key={item}
                  isSelected={selectedEquipment.includes(item)}
                  onClick={() => toggleSelection(item, selectedEquipment, setSelectedEquipment)}
                >
                  {item}
                </Bubble>
              ))}
            </div>
          </Section>

          <Section title="模式">
            <div className="flex flex-wrap w-full items-start gap-[6px] relative">
              {modes.map((mode) => (
                <Bubble
                  key={mode}
                  isSelected={selectedModes.includes(mode)}
                  onClick={() => toggleSelection(mode, selectedModes, setSelectedModes)}
                >
                  {mode}
                </Bubble>
              ))}
            </div>
          </Section>

          {/* Generate Recipe Button */}
          <div className="flex flex-col items-end gap-[7px] self-stretch w-full relative mt-6">
            <div className="flex flex-col items-start gap-5 self-stretch w-full relative">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md w-full">
                  <p className="text-sm">{error}</p>
                </div>
              )}
              <button 
                onClick={handleGenerateRecipe}
                disabled={isGenerating}
                className="flex items-center justify-center gap-2.5 p-2 self-stretch w-full bg-background rounded-[75px] border border-solid border-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-foreground text-[21px] relative w-fit font-sans font-normal text-center tracking-[0] leading-[normal]">
                  {isGenerating ? '生成中...' : '生成菜谱'}
                </div>
              </button>
            </div>
          </div>

          {/* Generated Recipe Display */}
          {generatedRecipe && (
            <div className="flex flex-col items-start gap-4 self-stretch w-full mt-8">
              <RecipeDisplay 
                recipeData={convertToRecipeData(generatedRecipe)} 
                isLoading={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
