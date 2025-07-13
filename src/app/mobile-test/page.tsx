'use client';

import { MobileFrame } from '@/components/ui/MobileFrame';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Import your actual app pages
import HomePage from '@/app/page';
import MenuPage from '@/app/menu/page';

type DeviceType = 'iphone14' | 'iphone14pro' | 'galaxyS23' | 'pixel7';

function MobileTestContent() {
  const searchParams = useSearchParams();
  const device = (searchParams.get('device') as DeviceType) || 'iphone14';
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

  const deviceSpecs = {
    iphone14: { name: 'iPhone 14' },
    iphone14pro: { name: 'iPhone 14 Pro' },
    galaxyS23: { name: 'Galaxy S23' },
    pixel7: { name: 'Pixel 7' }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileFrame deviceType={device}>
        {renderPage()}
      </MobileFrame>
      
      {/* Controls Panel */}
      <div className="fixed top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-50">
        <h3 className="text-sm font-medium mb-3">Test Pages:</h3>
        <div className="flex flex-col space-y-2 mb-4">
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
            Database Mode (Home)
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
            AI Mode (Menu)
          </button>
        </div>

        <h3 className="text-sm font-medium mb-3">Device:</h3>
        <div className="flex flex-col space-y-2">
          {Object.entries(deviceSpecs).map(([key, spec]) => (
            <button
              key={key}
              className={`px-3 py-1 text-xs rounded ${
                device === key 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.set('device', key);
                window.location.href = url.toString();
              }}
            >
              {spec.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MobileTest() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MobileTestContent />
    </Suspense>
  );
}
