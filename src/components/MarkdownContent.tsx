import React from 'react';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import Link from 'next/link';
import { replaceImagePaths } from '@/utils/recipeUtils';

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
            
            // Use a regular img tag for problematic URLs
            if (src.startsWith('./') || src.startsWith('../')) {
              console.warn('Using fallback for image path:', src);
              return <img src="/recipe-placeholder.jpg" alt={alt || 'Image'} className="max-w-full h-auto my-2" />;
            }
            
            try {
              // Use Next.js Image for valid URLs
              return (
                <div className="my-4 relative">
                  <img 
                    src={src}
                    alt={alt || 'Recipe image'}
                    className="w-full object-cover rounded-sm"
                    style={{ maxHeight: '300px' }}
                    {...props}
                  />
                </div>
              );
            } catch (error) {
              console.error('Error rendering image:', error);
              return <img src="/recipe-placeholder.jpg" alt={alt || 'Image'} className="max-w-full h-auto my-2" />;
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
          p: ({ children }) => <p className="mb-3">{children}</p>
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;
