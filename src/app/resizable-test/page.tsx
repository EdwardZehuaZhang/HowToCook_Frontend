'use client';

import { ResizableFrame } from '@/components/ui/ResizableFrame';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Import your actual app pages
import HomePage from '@/app/page';
import MenuPage from '@/app/menu/page';

function ResizableTestContent() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || 'home';

  const renderPage = () => {
    switch (page) {
      case 'menu':
        return <MenuPage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <ResizableFrame
        initialWidth={375}
        initialHeight={667}
        minWidth={280}
        minHeight={500}
        maxWidth={600}
        maxHeight={1200}
      >
        {renderPage()}
      </ResizableFrame>
      
      {/* Floating Page Selector */}
      <div className="fixed top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-50">
        <h3 className="text-sm font-medium mb-2">Page:</h3>
        <div className="flex flex-col space-y-2">
          <button
            className={`px-3 py-1 text-xs rounded ${
              page === 'home' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.set('page', 'home');
              window.location.href = url.toString();
            }}
          >
            Database Mode
          </button>
          <button
            className={`px-3 py-1 text-xs rounded ${
              page === 'menu' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.set('page', 'menu');
              window.location.href = url.toString();
            }}
          >
            AI Mode
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResizableTest() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResizableTestContent />
    </Suspense>
  );
}
