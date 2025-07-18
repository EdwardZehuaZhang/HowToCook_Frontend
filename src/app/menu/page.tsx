'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DotsThreeIcon } from '@/components/Icons';
import { NavigationDropdown } from '@/components/ui/NavigationDropdown';
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

  // State for "其他" input fields
  const [customInputs, setCustomInputs] = useState<{[key: string]: string}>({
    vegetables: '',
    meats: '',
    staples: '',
    equipment: '',
    modes: ''
  });

  const [showingInputs, setShowingInputs] = useState<{[key: string]: boolean}>({
    vegetables: false,
    meats: false,
    staples: false,
    equipment: false,
    modes: false
  });

  // Helper function to calculate text width for dynamic input sizing
  const getTextWidth = (text: string, category: string) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      context.font = '14.8px sans-serif';
      const width = context.measureText(text || '请输入').width;
      return Math.max(width + 20, 50); // Add padding and minimum width
    }
    return 50; // Fallback width
  };

  // Helper function to toggle selection
  const toggleSelection = (item: string, selectedItems: string[], setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Helper function to toggle selection for modes (only one selection allowed)
  const toggleModeSelection = (item: string, selectedItems: string[], setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (selectedItems.includes(item)) {
      // If clicking the already selected item, deselect it
      setSelectedItems([]);
    } else {
      // If clicking a different item, select only that item
      setSelectedItems([item]);
    }
  };

  // Handle "其他" button click
  const handleOtherClick = (category: string) => {
    setShowingInputs(prev => ({ ...prev, [category]: true }));
  };

  // Handle custom input submission
  const handleCustomInputSubmit = (category: string, value: string) => {
    if (value.trim()) {
      const setterMap = {
        vegetables: setSelectedVegetables,
        meats: setSelectedMeats,
        staples: setSelectedStaples,
        equipment: setSelectedEquipment,
        modes: setSelectedModes
      };
      
      const setter = setterMap[category as keyof typeof setterMap];
      if (setter) {
        setter(prev => [...prev, value.trim()]);
      }
    }
    
    // Reset input and hide it
    setCustomInputs(prev => ({ ...prev, [category]: '' }));
    setShowingInputs(prev => ({ ...prev, [category]: false }));
  };

  // Handle input key press
  const handleInputKeyPress = (e: React.KeyboardEvent, category: string) => {
    if (e.key === 'Enter') {
      handleCustomInputSubmit(category, customInputs[category]);
    } else if (e.key === 'Escape') {
      setCustomInputs(prev => ({ ...prev, [category]: '' }));
      setShowingInputs(prev => ({ ...prev, [category]: false }));
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
    
    // Helper function to add bullet points to array items
    const addBulletPoints = (items: any[]) => {
      return items.map(item => {
        if (typeof item === 'string') {
          return { text: item.startsWith('- ') ? item : `- ${item}`, level: 0 };
        } else if (item && typeof item === 'object' && 'text' in item) {
          return { ...item, text: item.text.startsWith('- ') ? item.text : `- ${item.text}` };
        }
        return { text: `- ${String(item)}`, level: 0 };
      });
    };

    // Helper function for extraInfo (no bullet points)
    const formatExtraInfo = (items: any[]) => {
      return items.map(item => {
        if (typeof item === 'string') {
          return { text: item, level: 0 };
        } else if (item && typeof item === 'object' && 'text' in item) {
          return { ...item };
        }
        return { text: String(item), level: 0 };
      });
    };
    
    return {
      _id: 'generated-' + Date.now(),
      name: recipe.name,
      recipeName: recipe.name,
      category: recipe.category || 'AI生成',
      difficulty: recipe.difficulty || 1,
      difficultyLabel: '预估烹饪难度：', // Keep the text but stars will be rendered separately
      description: recipe.description,
      materials: addBulletPoints(recipe.materials || []),
      calculations: addBulletPoints(recipe.calculations || []),
      procedure: addBulletPoints(recipe.procedure || []),
      extraInfo: formatExtraInfo(recipe.extraInfo || []),
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
  const modes = ['模糊匹配', '严格匹配'];

  // Component to render a bubble section with "其他" option
  const renderBubbleSection = (
    items: string[], 
    selectedItems: string[], 
    setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>,
    category: string
  ) => (
    <div className="flex flex-wrap w-full items-start gap-[6px] relative">
      {items.map((item) => (
        <Bubble
          key={item}
          isSelected={selectedItems.includes(item)}
          onClick={() => toggleSelection(item, selectedItems, setSelectedItems)}
        >
          {item}
        </Bubble>
      ))}
      
      {/* Custom items added by user */}
      {selectedItems
        .filter(item => !items.includes(item))
        .map((customItem) => (
          <Bubble
            key={customItem}
            isSelected={true}
            onClick={() => toggleSelection(customItem, selectedItems, setSelectedItems)}
          >
            {customItem}
          </Bubble>
        ))}
      
      {/* "其他" button or input field */}
      {showingInputs[category] ? (
        <div 
          className="bg-background inline-flex h-9 items-center justify-center rounded-[75px] border border-solid border-foreground"
          style={{ 
            width: `${getTextWidth(customInputs[category], category)}px`
          }}
        >
          <input
            type="text"
            value={customInputs[category]}
            onChange={(e) => setCustomInputs(prev => ({ ...prev, [category]: e.target.value }))}
            onKeyDown={(e) => handleInputKeyPress(e, category)}
            onBlur={() => handleCustomInputSubmit(category, customInputs[category])}
            placeholder="请输入"
            className="bg-transparent text-foreground text-[14.8px] outline-none border-none text-center w-full px-2"
            autoFocus
          />
        </div>
      ) : (
        <Bubble
          isSelected={false}
          onClick={() => handleOtherClick(category)}
        >
          其他
        </Bubble>
      )}
    </div>
  );

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
            I have:
          </h2>
        </div>

        <div className="flex flex-col items-start gap-6 self-stretch w-full mt-4">
          <Section title="蔬菜">
            {renderBubbleSection(vegetables, selectedVegetables, setSelectedVegetables, 'vegetables')}
          </Section>

          <Section title="肉类">
            {renderBubbleSection(meats, selectedMeats, setSelectedMeats, 'meats')}
          </Section>

          <Section title="主食">
            {renderBubbleSection(staples, selectedStaples, setSelectedStaples, 'staples')}
          </Section>

          <Section title="厨具">
            {renderBubbleSection(equipment, selectedEquipment, setSelectedEquipment, 'equipment')}
          </Section>

          <Section title="模式">
            <div className="flex flex-wrap w-full items-start gap-[6px] relative">
              {modes.map((mode) => (
                <Bubble
                  key={mode}
                  isSelected={selectedModes.includes(mode)}
                  onClick={() => toggleModeSelection(mode, selectedModes, setSelectedModes)}
                >
                  {mode}
                </Bubble>
              ))}
            </div>
          </Section>

          {/* Generate Recipe Button */}
          <div className="flex flex-col items-end gap-[7px] self-stretch w-full relative mt-4">
            <div className="flex flex-col items-start gap-3 self-stretch w-full relative">
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
                <div className="flex items-center justify-center gap-2 text-foreground text-[21px] relative w-fit font-sans font-normal text-center tracking-[0] leading-[normal]">
                  {isGenerating && (
                    <div className="w-4 h-4 border border-t-transparent border-foreground rounded-full animate-spin"></div>
                  )}
                  {isGenerating ? '生成中...' : '生成菜谱'}
                </div>
              </button>
            </div>
          </div>

          {/* Generated Recipe Display */}
          {generatedRecipe && (
            <div className="flex flex-col items-start gap-4 self-stretch w-full mt-4">
              <RecipeDisplay 
                recipeData={convertToRecipeData(generatedRecipe)} 
                isLoading={false}
                showRecipeName={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
