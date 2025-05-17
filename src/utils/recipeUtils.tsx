import React from 'react';
import Link from 'next/link';
import { fetchRecipes } from '@/services/api';

export function parseMarkdownLinks(text: string): React.ReactNode[] {
  if (!text) return [null];

  const combinedRegex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = combinedRegex.exec(text)) !== null) {
    // Add text before the formatted section
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    if (match[0].startsWith('[')) {
      // This is a link - use previous link handling logic
      const linkText = match[2];
      const url = match[3];
      
      parts.push(
        <Link
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {linkText}
        </Link>
      );
    } else {
      // This is bold text
      const boldText = match[4];
      parts.push(
        <strong key={match.index} className="font-bold">
          {boldText}
        </strong>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add any remaining text after the last formatting
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

export async function findRecipeByName(name: string) {
  let page = 1;
  const limit = 20;
  let found = null;
  let hasMore = true;

  console.log(`Searching for recipe: "${name}"`);

  while (hasMore && !found) {
    console.log(`Checking page ${page}...`);
    const result = await fetchRecipes(page, limit);

    if (!result.data || result.data.length === 0) {
      hasMore = false;
      continue;
    }

    found = result.data.find(r => r.name.includes(name));

    if (!found && page < result.totalPages) {
      page++;
    } else {
      hasMore = false;
    }
  }

  return found;
}
