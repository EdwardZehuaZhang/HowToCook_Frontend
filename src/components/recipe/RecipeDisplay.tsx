import React from 'react';
import { RecipeData } from '@/types/recipeTypes';
import { AsteriskIcon } from '@/components/Icons';
import { Section, recipeHeadingFontSize, recipeDescriptionFontSize } from './Section';
import SafeImage from '@/components/SafeImage';
import MarkdownContent from '@/components/MarkdownContent';
import { parseMarkdownLinks } from '@/utils/recipeUtils';

interface RecipeDisplayProps {
  recipeData: RecipeData;
  isLoading?: boolean;
}

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipeData, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full py-20">
        <div className="w-8 h-8 border-1 border-t-transparent border-foreground rounded-full animate-spin"></div>
      </div>
    );
  }

  // For debugging - check if sections have content
  const hasMaterials = recipeData.materials && recipeData.materials.length > 0;
  const hasCalculations = recipeData.calculations && recipeData.calculations.length > 0;
  const hasProcedure = recipeData.procedure && recipeData.procedure.length > 0;
  const hasExtraInfo = recipeData.extraInfo && recipeData.extraInfo.length > 0;
  
  console.log('Recipe sections:', { 
    name: recipeData.recipeName,
    hasMaterials, 
    hasCalculations, 
    hasProcedure, 
    hasExtraInfo 
  });

  return (
    <div className="flex flex-col items-start gap-0 self-stretch w-full">
      {recipeData.imageUrl && (
        <div className="relative self-stretch w-full overflow-hidden mt-1">
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

        {hasMaterials && (
          <Section title={recipeData.materialsTitle} titleContainerClassName="w-auto">
            <MarkdownContent 
              content={recipeData.materials.join('\n')}
              imageUrls={recipeData.allImageUrls || []}
              baseUrl={recipeData.recipeLink}
            />
          </Section>
        )}

        {hasCalculations && (
          <Section title={recipeData.calculationsTitle} titleContainerClassName="w-auto">
            <MarkdownContent 
              content={recipeData.calculations.join('\n')}
              imageUrls={recipeData.allImageUrls || []}
              baseUrl={recipeData.recipeLink}
            />
          </Section>
        )}

        {hasProcedure && (
          <Section title={recipeData.procedureTitle} titleContainerClassName="w-auto">
            <MarkdownContent 
              content={recipeData.procedure.join('\n')}
              imageUrls={recipeData.allImageUrls || []}
              baseUrl={recipeData.recipeLink}
            />
          </Section>
        )}

        {hasExtraInfo && (
          <Section title={recipeData.extraInfoTitle} titleContainerClassName="w-auto">
            <MarkdownContent 
              content={recipeData.extraInfo.join('\n')}
              imageUrls={recipeData.allImageUrls || []}
              baseUrl={recipeData.recipeLink}
            />
          </Section>
        )}
      </div>
    </div>
  );
};
