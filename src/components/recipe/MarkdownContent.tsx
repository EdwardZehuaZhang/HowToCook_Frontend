import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import Link from 'next/link';

// Import styles 
import { cn } from '@/lib/utils';
import { recipeDescriptionFontSize } from './Section';

interface MarkdownContentProps {
  content: string;
  className?: string;
  imageHeight?: number;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({
  content,
  className,
  imageHeight = 150 // Default height for images
}) => {
  if (!content) return null;

  // Wrapper div with className, ReactMarkdown without className
  return (
    <div className={cn("markdown-content", className)}>
      <ReactMarkdown
        components={{
          p: ({ node, children, ...props }) => (
            <p className="my-2 leading-relaxed" style={{ fontSize: recipeDescriptionFontSize }} {...props}>
              {children}
            </p>
          ),
          a: ({ node, href, children, ...props }) => (
            <Link href={href || '#'} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer" {...props}>
              {children}
            </Link>
          ),
          img: ({ node, src, alt, ...props }) => {
            if (!src) return null;
            
            return (
              <div className="w-full my-1 relative">
                <Image
                  src={src}
                  alt={alt || "Recipe image"}
                  width={500}
                  height={imageHeight}
                  className="w-full object-contain"
                  style={{ maxHeight: '150px' }}
                />
              </div>
            );
          },
          li: ({ node, children, ...props }) => (
            <li className="my-1" style={{ fontSize: recipeDescriptionFontSize }} {...props}>
              {children}
            </li>
          ),
          ul: ({ node, children, ...props }) => (
            <ul className="list-disc ml-5" {...props}>
              {children}
            </ul>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
