import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
}

const SafeImage: React.FC<SafeImageProps> = ({ src, alt, fallbackSrc, ...props }) => {
  const [imgSrc, setImgSrc] = useState<string>(src as string);
  const [useRegularImg, setUseRegularImg] = useState(false);

  const handleError = () => {
    if (fallbackSrc) {
      setImgSrc(fallbackSrc);
    } else {
      // If Next/Image still fails with fallback, use regular img
      setUseRegularImg(true);
    }
  };

  if (useRegularImg) {
    // Fall back to regular img tag when Next/Image fails
    const { fill, layout, objectFit, sizes, quality, priority, loading, ...imgProps } = props;
    
    return (
      <img 
        src={imgSrc} 
        alt={alt}
        {...imgProps}
        style={{
          ...(fill ? { position: 'absolute', width: '100%', height: '100%' } : {}),
          ...(props.style || {})
        }}
      />
    );
  }

  // Create a style object that guarantees proper aspect ratio handling
  const combinedStyle = {
    ...(props.style || {}),
    // When using maxHeight, always ensure width is 'auto' as well
    ...(props.style?.maxHeight ? { width: 'auto' } : {}),
    // When using maxWidth, always ensure height is 'auto' as well
    ...(props.style?.maxWidth ? { height: 'auto' } : {})
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      {...props}
      style={combinedStyle}
      onError={handleError}
    />
  );
};

export default SafeImage;
