import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import Link from 'next/link';
import { HierarchicalItem } from '@/types/recipeTypes';
import { useResolveImageUrls } from '@/hooks/useResolveImageUrls';
import { cn } from '@/lib/utils';
import { replaceImagePaths } from '@/utils/recipeUtils';

interface MarkdownContentProps {
  content: string | HierarchicalItem[] | any[];
  imageUrls?: string[];
  baseUrl?: string;
  className?: string;
  imageHeight?: number;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({
  content,
  imageUrls = [],
  baseUrl = '',
  className = '',
  imageHeight = 150,
}) => {
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

  // Process images in the markdown content
  const processedContent = baseUrl && imageUrls?.length > 0 
    ? replaceImagePaths(markdownString, baseUrl, imageUrls)
    : markdownString;

  /* ---------- render ---------- */
  return (
    <div className={cn('markdown-content', className)}>
      <ReactMarkdown
        components={{
          // Modified paragraph component to handle images better
          p: ({ children, ...props }) => {
            return (
              <p
                className="my-2 leading-relaxed"
                {...props}
              >
                {children}
              </p>
            )
          },
          a: ({ href, children, ...props }) => (
            <Link
              href={href || '#'}
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </Link>
          ),
          // Modified image component to use span (inline element) instead of div
          img: ({ src, alt, ...props }) =>
            src ? (
              <span className="block w-full my-1">
                <Image
                  src={src}
                  alt={alt || 'Recipe image'}
                  width={500}
                  height={imageHeight}
                  className="w-full object-contain"
                  style={{ maxHeight: `${imageHeight}px` }}
                  {...props}
                />
              </span>
            ) : null,
          li: ({ children, ...props }) => (
            <li
              className="my-1"
              {...props}
            >
              {children}
            </li>
          ),
          ul: ({ children, ...props }) => (
            <ul className="list-disc ml-5" {...props}>
              {children}
            </ul>
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;
