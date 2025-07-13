'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ResizableFrameProps {
  children: React.ReactNode;
  initialWidth?: number;
  initialHeight?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export const ResizableFrame: React.FC<ResizableFrameProps> = ({
  children,
  initialWidth = 375,
  initialHeight = 667,
  minWidth = 280,
  minHeight = 500,
  maxWidth = 500,
  maxHeight = 1000,
}) => {
  const [dimensions, setDimensions] = useState({
    width: initialWidth,
    height: initialHeight,
  });
  
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((direction: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(direction);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = dimensions.width;
    const startHeight = dimensions.height;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;

      // Handle horizontal resizing
      if (direction.includes('right')) {
        newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + deltaX));
      } else if (direction.includes('left')) {
        newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth - deltaX));
      }

      // Handle vertical resizing
      if (direction.includes('bottom')) {
        newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY));
      } else if (direction.includes('top')) {
        newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight - deltaY));
      }

      // For edge-only handles
      if (direction === 'right' || direction === 'left') {
        newHeight = startHeight; // Keep height unchanged
      }
      if (direction === 'top' || direction === 'bottom') {
        newWidth = startWidth; // Keep width unchanged
      }

      setDimensions({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = getCursor(direction);
    document.body.style.userSelect = 'none';
  }, [dimensions, minWidth, maxWidth, minHeight, maxHeight]);

  const getCursor = (direction: string) => {
    switch (direction) {
      case 'top': return 'n-resize';
      case 'bottom': return 's-resize';
      case 'left': return 'w-resize';
      case 'right': return 'e-resize';
      case 'top-left': return 'nw-resize';
      case 'top-right': return 'ne-resize';
      case 'bottom-left': return 'sw-resize';
      case 'bottom-right': return 'se-resize';
      default: return 'default';
    }
  };

  const commonDeviceSizes = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12/13/14', width: 390, height: 844 },
    { name: 'iPhone 14 Pro', width: 393, height: 852 },
    { name: 'Galaxy S23', width: 360, height: 780 },
    { name: 'Pixel 7', width: 412, height: 915 },
    { name: 'iPad Mini', width: 744, height: 1133 },
  ];

  const setPresetSize = (width: number, height: number) => {
    setDimensions({ width, height });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Panel with Controls */}
      <div className="w-64 bg-white shadow-lg p-4 flex flex-col">
        {/* Dimensions Display */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Current Size:</h3>
          <div className="text-2xl font-mono text-blue-600 bg-blue-50 px-3 py-2 rounded">
            {dimensions.width} × {dimensions.height}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Ratio: {(dimensions.width / dimensions.height).toFixed(2)}:1
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Device Presets:</h3>
          <div className="flex flex-col gap-2">
            {commonDeviceSizes.map((device) => (
              <button
                key={device.name}
                onClick={() => setPresetSize(device.width, device.height)}
                className="px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-left"
              >
                {device.name}
                <div className="text-xs opacity-75">{device.width}×{device.height}</div>
              </button>
            ))}
            <button
              onClick={() => setPresetSize(initialWidth, initialHeight)}
              className="px-3 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Reset Default
            </button>
          </div>
        </div>

        {/* Size Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <div><strong>Min:</strong> {minWidth}×{minHeight}</div>
          <div><strong>Max:</strong> {maxWidth}×{maxHeight}</div>
        </div>

        {/* Instructions */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <h4 className="text-xs font-medium text-gray-600 mb-2">How to Resize:</h4>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• Drag corners for both dimensions</li>
            <li>• Drag edges for single dimension</li>
            <li>• Click presets for quick sizing</li>
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        {/* Resizable Frame Container */}
        <div className="relative">
          {/* Main Frame */}
          <div
            ref={frameRef}
            className="relative bg-white rounded-lg shadow-2xl overflow-hidden"
            style={{
              width: dimensions.width,
              height: dimensions.height,
              border: isResizing ? '3px solid #3b82f6' : '3px solid #374151',
              boxSizing: 'border-box',
            }}
          >
            {/* Screen Content */}
            <div
              className="w-full h-full bg-white overflow-auto"
            >
              {children}
            </div>
          </div>

          {/* Resize Handles */}
          {/* Corner Handles */}
          <div
            className="absolute w-4 h-4 bg-blue-500 cursor-nw-resize hover:bg-blue-600 rounded-full border-2 border-white shadow-lg"
            style={{ top: -8, left: -8 }}
            onMouseDown={handleMouseDown('top-left')}
          />
          <div
            className="absolute w-4 h-4 bg-blue-500 cursor-ne-resize hover:bg-blue-600 rounded-full border-2 border-white shadow-lg"
            style={{ top: -8, right: -8 }}
            onMouseDown={handleMouseDown('top-right')}
          />
          <div
            className="absolute w-4 h-4 bg-blue-500 cursor-sw-resize hover:bg-blue-600 rounded-full border-2 border-white shadow-lg"
            style={{ bottom: -8, left: -8 }}
            onMouseDown={handleMouseDown('bottom-left')}
          />
          <div
            className="absolute w-4 h-4 bg-blue-500 cursor-se-resize hover:bg-blue-600 rounded-full border-2 border-white shadow-lg"
            style={{ bottom: -8, right: -8 }}
            onMouseDown={handleMouseDown('bottom-right')}
          />

          {/* Edge Handles */}
          <div
            className="absolute w-8 h-4 bg-blue-500 cursor-n-resize hover:bg-blue-600 rounded-full border-2 border-white shadow-lg"
            style={{ top: -8, left: '50%', transform: 'translateX(-50%)' }}
            onMouseDown={handleMouseDown('top')}
          />
          <div
            className="absolute w-8 h-4 bg-blue-500 cursor-s-resize hover:bg-blue-600 rounded-full border-2 border-white shadow-lg"
            style={{ bottom: -8, left: '50%', transform: 'translateX(-50%)' }}
            onMouseDown={handleMouseDown('bottom')}
          />
          <div
            className="absolute w-4 h-8 bg-blue-500 cursor-w-resize hover:bg-blue-600 rounded-full border-2 border-white shadow-lg"
            style={{ top: '50%', left: -8, transform: 'translateY(-50%)' }}
            onMouseDown={handleMouseDown('left')}
          />
          <div
            className="absolute w-4 h-8 bg-blue-500 cursor-e-resize hover:bg-blue-600 rounded-full border-2 border-white shadow-lg"
            style={{ top: '50%', right: -8, transform: 'translateY(-50%)' }}
            onMouseDown={handleMouseDown('right')}
          />
        </div>
      </div>
    </div>
  );
};
