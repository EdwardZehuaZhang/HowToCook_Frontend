import React from 'react';
import { cn } from '@/lib/utils';

interface BubbleProps {
  children: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Bubble: React.FC<BubbleProps> = ({ 
  children, 
  isSelected = false, 
  onClick,
  className 
}) => {
  return (
    <div
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2.5 p-2 rounded-[75px] border border-solid border-foreground transition-colors cursor-pointer",
        isSelected 
          ? "bg-foreground text-background" 
          : "bg-card text-foreground hover:bg-muted",
        className
      )}
      onClick={onClick}
    >
      <div className="relative w-fit font-sans font-normal text-center tracking-[0] leading-[normal] text-[14.8px]">
        {children}
      </div>
    </div>
  );
};
