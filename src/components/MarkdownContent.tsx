import React from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { replaceImagePaths } from '@/utils/recipeUtils';
import SafeImage from '@/components/SafeImage';

interface MarkdownContentProps {
  content: string | string[];
  imageUrls?: string[];
  baseUrl?: string;
  className?: string;
}

const MarkdownContent: React.FC<MarkdownContentProps> = ({ 
  content, 
  imageUrls = [], 
  baseUrl = '',
  className = '' 
}) => {
  // Handle empty content gracefully
  if (!content) return null;
  
  // Convert array to string if necessary
  const contentString = Array.isArray(content) ? content.join('\n\n') : content;
  
  // Pre-process the content to fix image paths
  const processedContent = React.useMemo(() => {
    return replaceImagePaths(contentString, baseUrl, imageUrls || []);
  }, [contentString, baseUrl, imageUrls]);

  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          img: ({ node, src, alt, ...props }) => {
            // Skip rendering if no src
            if (!src) return null;
            
            try {
              // For valid URLs, use SafeImage component which handles errors gracefully
              return (
                <div className="mt-2 mb-4 relative w-full">
                  <SafeImage 
                    src={src}
                    alt={alt || 'Recipe image'}
                    width={332}
                    height={150}
                    className="object-contain"
                    style={{ 
                      maxHeight: '150px',
                      maxWidth: '332px',
                      width: 'auto',
                      height: 'auto' 
                    }}
                    fallbackSrc="/recipe-placeholder.jpg"
                  />
                </div>
              );
            } catch (error) {
              console.error('Error rendering image:', error);
              return (
                <img 
                  src="/recipe-placeholder.jpg"
                  alt={alt || 'Image placeholder'}
                  style={{ 
                    maxHeight: '150px',
                    maxWidth: '332px',
                    width: 'auto',
                    height: 'auto' 
                  }}
                />
              );
            }
          },
          a: ({ node, href, children }) => (
            <Link 
              href={href || '#'} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 underline"
            >
              {children}
            </Link>
          ),
          p: ({ children }) => <p className="mb-2">{children}</p>,
          // Add components for list rendering
          ul: ({ node, children, ...props }) => (
            <ul className="list-disc pl-5 mb-2" {...props}>
              {children}
            </ul>
          ),
          ol: ({ node, children, ...props }) => (
            <ol className="list-decimal pl-5 mb-2" {...props}>
              {children}
            </ol>
          ),
          li: ({ node, children, ...props }) => (
            <li className="mb-1" {...props}>
              {children}
            </li>
          )
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;
