
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductOverlay } from './ProductOverlay';
import { ProductActions } from './ProductActions';

interface ProductImageSectionProps {
  image: string;
  name: string;
  discountPercentage?: number;
  isHovered: boolean;
  isFavorited: boolean;
  onFavorite: () => void;
}

export const ProductImageSection: React.FC<ProductImageSectionProps> = ({
  image,
  name,
  discountPercentage,
  isHovered,
  isFavorited,
  onFavorite
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}
      
      <motion.img 
        src={image || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&h=600&fit=crop&auto=format&q=80'} 
        alt={name}
        className={`w-full h-full object-cover transition-all duration-700 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        variants={imageVariants}
        onLoad={() => setImageLoaded(true)}
        loading="lazy"
      />
      
      <ProductOverlay 
        isHovered={isHovered}
        discountPercentage={discountPercentage}
      />
      
      <AnimatePresence>
        <ProductActions
          isHovered={isHovered}
          isFavorited={isFavorited}
          onFavorite={onFavorite}
        />
      </AnimatePresence>
    </div>
  );
};
