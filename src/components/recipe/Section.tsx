import React from 'react';
import { cn } from '@/lib/utils';
import { SectionProps } from '@/types/recipeTypes';

// These can be passed as props if you need to change them elsewhere
export const recipeHeadingFontSize = '16px';
export const recipeDescriptionFontSize = '12px';

export const Section: React.FC<SectionProps> = ({ 
  title, 
  children, 
  titleContainerClassName, 
  contentContainerClassName 
}) => {
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
