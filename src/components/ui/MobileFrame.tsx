import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
  deviceType?: 'iphone14' | 'iphone14pro' | 'galaxyS23' | 'pixel7';
}

const deviceSpecs = {
  iphone14: {
    name: 'iPhone 14',
    width: 390,
    height: 844,
    notchHeight: 47,
    homeIndicatorHeight: 34,
  },
  iphone14pro: {
    name: 'iPhone 14 Pro',
    width: 393,
    height: 852,
    notchHeight: 59,
    homeIndicatorHeight: 34,
  },
  galaxyS23: {
    name: 'Galaxy S23',
    width: 360,
    height: 780,
    notchHeight: 0,
    homeIndicatorHeight: 0,
  },
  pixel7: {
    name: 'Pixel 7',
    width: 412,
    height: 915,
    notchHeight: 0,
    homeIndicatorHeight: 0,
  }
};

export const MobileFrame: React.FC<MobileFrameProps> = ({ 
  children, 
  deviceType = 'iphone14' 
}) => {
  const device = deviceSpecs[deviceType];
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      {/* Device Info */}
      <div className="mb-4 text-sm text-gray-600 font-medium">
        {device.name} ({device.width} × {device.height})
      </div>
      
      {/* Device Frame */}
      <div 
        className="relative bg-black rounded-[2.5rem] p-2 shadow-2xl"
        style={{
          width: device.width + 24, // Add padding for frame
          height: device.height + 24, // Add padding for frame
        }}
      >
        {/* Screen */}
        <div 
          className="relative bg-white rounded-[2rem] overflow-hidden"
          style={{
            width: device.width,
            height: device.height,
          }}
        >
          {/* Notch (for iPhones) */}
          {device.notchHeight > 0 && (
            <div 
              className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-black rounded-b-2xl z-50"
              style={{
                width: device.width * 0.35,
                height: device.notchHeight,
              }}
            >
              {/* Front camera and speaker */}
              <div className="flex items-center justify-center h-full space-x-2">
                <div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
                <div className="w-12 h-1.5 bg-gray-800 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
              </div>
            </div>
          )}
          
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-11 flex items-center justify-between px-6 text-black text-sm font-medium z-40 bg-white">
            <div>9:41</div>
            <div className="flex space-x-1">
              <div className="flex space-x-1">
                <div className="w-4 h-2 border border-black rounded-sm">
                  <div className="w-3 h-1 bg-black rounded-sm"></div>
                </div>
                <div className="w-4 h-2 border border-black rounded-sm">
                  <div className="w-2 h-1 bg-black rounded-sm"></div>
                </div>
                <div className="w-6 h-3 border border-black rounded-sm relative">
                  <div className="w-1 h-1 bg-black rounded-sm absolute -right-0.5 top-0.5"></div>
                  <div className="w-4 h-1.5 bg-green-500 rounded-sm absolute left-0.5 top-0.5"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* App Content */}
          <div 
            className="absolute top-11 left-0 right-0 overflow-y-auto"
            style={{
              height: device.height - 44 - device.homeIndicatorHeight, // Subtract status bar and home indicator
            }}
          >
            {children}
          </div>
          
          {/* Home Indicator (for iPhones) */}
          {device.homeIndicatorHeight > 0 && (
            <div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black rounded-full"
              style={{
                width: device.width * 0.35,
                height: 5,
                marginBottom: 8,
              }}
            ></div>
          )}
        </div>
        
        {/* Side Buttons */}
        <div className="absolute left-0 top-20 w-1 h-12 bg-gray-800 rounded-r-md -ml-1"></div>
        <div className="absolute left-0 top-36 w-1 h-6 bg-gray-800 rounded-r-md -ml-1"></div>
        <div className="absolute left-0 top-44 w-1 h-6 bg-gray-800 rounded-r-md -ml-1"></div>
        <div className="absolute right-0 top-20 w-1 h-20 bg-gray-800 rounded-l-md -mr-1"></div>
      </div>
    </div>
  );
};
