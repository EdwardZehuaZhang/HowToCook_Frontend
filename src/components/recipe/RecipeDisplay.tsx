import React from 'react';
import { RecipeData } from '@/types/recipeTypes';
import { AsteriskIcon } from '@/components/Icons';
import { Section, recipeHeadingFontSize, recipeDescriptionFontSize } from './Section';
import SafeImage from '@/components/SafeImage';
import { cn } from '@/lib/utils';
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

  return (
    <div className="flex flex-col items-start gap-3.5 self-stretch w-full">
      {recipeData.imageUrl && (
        <div className="relative self-stretch w-full h-[131px]">
          <SafeImage
            src={recipeData.imageUrl}
            alt={recipeData.recipeName}
            fill
            sizes="(max-width: 768px) 100vw, 332px"
            style={{ objectFit: 'cover' }}
            priority
            fallbackSrc="/recipe-placeholder.jpg"
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
    </div>
  );
};
