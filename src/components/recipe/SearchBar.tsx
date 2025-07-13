import React, { useState, useEffect, useRef } from 'react';
import { searchRecipes } from '@/services/api';
import { XIcon } from '@/components/Icons';
import { recipeHeadingFontSize } from './Section';

interface SearchResult {
  _id: string;
  name: string;
}

interface SearchBarProps {
  defaultSearchTerm?: string;
  onRecipeSelect: (recipeId: string) => void;
  onSearchTermChange: (term: string) => void;
  searchTerm: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  defaultSearchTerm = "酸梅汤",
  onRecipeSelect,
  onSearchTermChange,
  searchTerm,
  className
}) => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResultsVisible, setSearchResultsVisible] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false); // Track user interaction
  const currentSearchRef = useRef<AbortController | null>(null);
  const preventAutoSearchRef = useRef<boolean>(false); // New ref to prevent auto-search

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleClearSearch = () => {
    // First, ensure panel stays visible but begins fading out
    setSearchResultsVisible(false);
    
    // Cancel any ongoing search
    if (currentSearchRef.current) {
      currentSearchRef.current.abort();
      currentSearchRef.current = null;
    }
    
    // Reset user interaction flag so dropdown won't show until user interacts again
    setHasUserInteracted(false);
    
    // After fade animation completes, hide the panel and clear results
    setTimeout(() => {
      onSearchTermChange(''); // This will trigger the reset in the parent
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResultsFound(false);
    }, 300);
  };

  // Function to handle recipe selection from search results
  const handleRecipeClick = (recipeId: string) => {
    // Hide the search results panel immediately
    setSearchResultsVisible(false);
    setShowSearchResults(false);
    setNoResultsFound(false); // Reset the no results state
    
    // Set flag to prevent auto-search when recipe name is updated
    preventAutoSearchRef.current = true;
    
    // Pass the selected recipe ID up to the parent
    onRecipeSelect(recipeId);
    
    // Reset the flag after a delay to allow for normal searching on next user input
    setTimeout(() => {
      preventAutoSearchRef.current = false;
    }, 500);
  };

  useEffect(() => {
    // Skip search effect if prevention flag is set
    if (preventAutoSearchRef.current) {
      return;
    }

    // Don't show dropdown on initial load - only after user interaction
    if (!hasUserInteracted) {
      return;
    }

    // Handle empty search term with proper animation
    if (searchTerm.trim().length === 0 && showSearchResults) {
      // Start fade-out animation
      setSearchResultsVisible(false);
      
      // Don't reset noResultsFound yet - keep it showing during animation
      // This ensures the panel isn't empty during fade-out
      
      // After animation completes, hide the panel completely
      setTimeout(() => {
        setShowSearchResults(false);
        setSearchResults([]);
        setNoResultsFound(false); // Only reset after animation completes
      }, 300);
      return; // Exit early to avoid the search logic below
    }

    // Cancel previous search if a new one starts
    if (currentSearchRef.current) {
      currentSearchRef.current.abort();
    }

    const timer = setTimeout(async () => {
      if (searchTerm.trim().length > 0) {
        try {
          // Create a new abort controller for this search request
          currentSearchRef.current = new AbortController();
          const signal = currentSearchRef.current.signal;

          // Set loading state and ensure results panel is visible
          setSearchLoading(true);
          setShowSearchResults(true);
          setSearchResultsVisible(true);
          
          // Only reset noResultsFound when we start a new search,
          // not during fade animations
          setNoResultsFound(false);
          
          // Use the signal for the fetch request
          const results = await searchRecipes(searchTerm, '', 1, 10, signal as any);
          
          // Only update results if the search hasn't been aborted
          if (!signal.aborted) {
            if (results.data && results.data.length > 0) {
              setSearchResults(results.data.map((recipe: any) => ({ 
                _id: recipe._id, 
                name: recipe.name 
              })));
              setNoResultsFound(false);
            } else {
              setSearchResults([]);
              setNoResultsFound(true); // Set no results found state
            }
          }
        } catch (err: any) {
          // Only log errors if the search wasn't aborted
          if (err.name !== 'AbortError') {
            console.error('Error fetching search results:', err);
            setSearchResults([]);
            setNoResultsFound(true);
          }
        } finally {
          if (currentSearchRef.current?.signal.aborted === false) {
            setSearchLoading(false);
            currentSearchRef.current = null;
          }
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);
  
  return (
    <div className={`flex flex-col items-start gap-1.5 self-stretch w-full max-w-full ${className || ''}`}>
      <div className="flex items-center justify-between self-stretch w-full max-w-full relative">
        <form onSubmit={handleSearch} className="flex-1 overflow-hidden">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setHasUserInteracted(true); // Mark that user has interacted
              onSearchTermChange(e.target.value);
            }}
            onFocus={() => setHasUserInteracted(true)} // Also track focus events
            placeholder="搜索食谱..."
            className="w-full font-normal text-foreground bg-transparent border-0 outline-none truncate"
            style={{ fontSize: '27px' }}
          />
        </form>
        <div className="flex-shrink-0">
          <XIcon 
            width={25} 
            height={25} 
            className="text-foreground cursor-pointer ml-2" 
            onClick={handleClearSearch} 
          />
        </div>
      </div>
      <div className="self-stretch w-full h-[0.5px] bg-foreground"></div>
      
      <div className="relative w-full">
        {showSearchResults && (
          <div 
            className={`absolute z-10 left-0 right-0 bg-card transition-opacity duration-300 ${
              searchResultsVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ 
              top: "5px",
              maxHeight: "300px",
              overflowY: "auto",
              borderWidth: "0.5px",
              borderStyle: "solid",
              borderColor: "currentColor"
            }}
          >
            <div className="p-2">
              {searchLoading ? (
                <div className="p-4 text-center">
                  <div className="inline-block w-4 h-4 border border-t-transparent border-foreground rounded-full animate-spin mr-2"></div>
                  搜索中...
                </div>
              ) : (
                <>
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <div
                        key={result._id}
                        className="relative cursor-pointer hover:bg-accent/10 transition-colors p-3 rounded-sm"
                        style={{ fontSize: recipeHeadingFontSize }}
                        onClick={() => handleRecipeClick(result._id)}
                      >
                        {result.name}
                      </div>
                    ))
                  ) : noResultsFound ? (
                    <div className="relative p-4 text-center" style={{ fontSize: recipeHeadingFontSize }}>
                      未找到相关食谱
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
