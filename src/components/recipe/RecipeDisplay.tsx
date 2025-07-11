import React, { useEffect } from 'react';
import { RecipeData } from '@/types/recipeTypes';
import { AsteriskIcon } from '@/components/Icons';
import { Section, recipeHeadingFontSize, recipeDescriptionFontSize } from './Section';
import SafeImage from '@/components/SafeImage';
import MarkdownContent from '@/components/MarkdownContent';
import { parseMarkdownLinks } from '@/utils/recipeUtils';
import { traceRecipeData } from '@/utils/debugUtils';

interface RecipeDisplayProps {
  recipeData: RecipeData;
  isLoading?: boolean;
  showRecipeName?: boolean; // New prop to control recipe name heading display
}

// Helper function to check if an array has content
const hasContent = (arr: any[] | undefined): boolean => {
  return arr && Array.isArray(arr) && arr.length > 0;
};

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipeData, isLoading = false, showRecipeName = false }) => {
  // We'll keep the trace function for development debugging but remove the excessive console logs
  useEffect(() => {
    traceRecipeData(recipeData, 'RecipeDisplay Component');
  }, [recipeData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full py-20">
        <div className="w-8 h-8 border-1 border-t-transparent border-foreground rounded-full animate-spin"></div>
      </div>
    );
  }
  // Determine if the recipe sections have content
  const hasMaterials = hasContent(recipeData.materials);
  const hasCalculations = hasContent(recipeData.calculations);
  const hasProcedure = hasContent(recipeData.procedure);
  const hasExtraInfo = hasContent(recipeData.extraInfo);

  return (
    <div className="flex flex-col items-start gap-0 self-stretch w-full">
      {/* Recipe Name Heading - only show when showRecipeName is true */}
      {showRecipeName && recipeData.recipeName && (
        <h2
          className="font-sans font-normal text-foreground mb-3"
          style={{ fontSize: '27px' }}
        >
          {recipeData.recipeName}
        </h2>
      )}

      {recipeData.imageUrl && (
        <div className="relative self-stretch w-full overflow-hidden mt-1 flex justify-center items-center">
          <SafeImage
            src={recipeData.imageUrl}
            alt={recipeData.recipeName}
            width={332}
            height={150}
            className="object-contain"
            style={{ 
              maxHeight: '150px',
              maxWidth: '332px',
              width: 'auto',
              height: 'auto' 
            }}
            priority
            fallbackSrc="/recipe-placeholder.jpg"
          />
        </div>
      )}

      <div className="flex flex-col items-start gap-5 self-stretch w-full mt-2">
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
            <div className="flex items-center justify-center">
              {[...Array(recipeData.difficulty)].map((_, i) => (                <AsteriskIcon
                  key={i}
                  width="21"
                  height="21"
                  aria-label={`Difficulty level ${i + 1}`}
                />
              ))}
            </div>
          ) : (
            <span className="text-foreground ml-1 text-sm"></span>
          )}
        </div>

        {hasMaterials && (
          <Section title={recipeData.materialsTitle} titleContainerClassName="w-auto">
            <MarkdownContent 
              content={recipeData.materials}
              imageUrls={recipeData.allImageUrls || []}
              baseUrl={recipeData.sourceUrl}
              className="font-normal text-foreground leading-relaxed"
            />
          </Section>
        )}

        {hasCalculations && (
          <Section title={recipeData.calculationsTitle} titleContainerClassName="w-auto">
            <MarkdownContent 
              content={recipeData.calculations}
              imageUrls={recipeData.allImageUrls || []}
              baseUrl={recipeData.sourceUrl}
              className="font-normal text-foreground leading-relaxed"
            />
          </Section>
        )}

        {hasProcedure && (
          <Section title={recipeData.procedureTitle} titleContainerClassName="w-auto">
            <MarkdownContent 
              content={recipeData.procedure}
              imageUrls={recipeData.allImageUrls || []}
              baseUrl={recipeData.sourceUrl}
              className="font-normal text-foreground leading-relaxed"
            />
          </Section>
        )}

        {hasExtraInfo && (
          <Section title={recipeData.extraInfoTitle} titleContainerClassName="w-auto">
            <MarkdownContent 
              content={recipeData.extraInfo}
              imageUrls={recipeData.allImageUrls || []}
              baseUrl={recipeData.sourceUrl}
              className="font-normal text-foreground leading-relaxed"
            />
          </Section>
        )}
      </div>
    </div>
  );
};
