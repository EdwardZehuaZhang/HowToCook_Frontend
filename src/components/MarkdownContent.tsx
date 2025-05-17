import React from 'react';
import ReactMarkdown from 'react-markdown';
import { HierarchicalItem } from '@/types/recipeTypes';
import { useResolveImageUrls } from '@/hooks/useResolveImageUrls';
import { cn } from '@/lib/utils';

interface MarkdownContentProps {
  content: string | HierarchicalItem[] | any[];
  imageUrls?: string[];
  baseUrl?: string;
  className?: string;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({
  content,
  imageUrls = [],
  baseUrl = '',
  className = '',
}) => {
  const resolveImageUrl = useResolveImageUrls(imageUrls, baseUrl);

  /* ---------- build a single markdown string ---------- */
  let markdownString = '';

  if (typeof content === 'string') {
    markdownString = content;
  } else if (Array.isArray(content)) {
    markdownString = content
      .map((item) => {
        if (typeof item === 'object' && item !== null && 'text' in item) {
          const indentation = '  '.repeat(item.level || 0);
          return `${indentation}${item.text}`;
        }
        return String(item ?? '');
      })
      .join('\n\n');
  }

  const processedContent = resolveImageUrl(markdownString);

  /* ---------- render ---------- */
  return (
    <div className={cn('markdown-content', className)}>
      <ReactMarkdown>{processedContent}</ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;
