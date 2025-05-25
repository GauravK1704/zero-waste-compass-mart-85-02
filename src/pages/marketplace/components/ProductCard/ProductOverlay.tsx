
import React from 'react';
import { motion } from 'framer-motion';

interface ProductOverlayProps {
  isHovered: boolean;
  discountPercentage?: number;
}

export const ProductOverlay: React.FC<ProductOverlayProps> = ({
  isHovered,
  discountPercentage
}) => {
  return (
    <>
      {/* Premium gradient overlay */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Premium discount badge */}
      {discountPercentage && discountPercentage > 0 && (
        <motion.div 
          className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: "spring", damping: 15 }}
          whileHover={{ scale: 1.05 }}
        >
          -{discountPercentage}% OFF
        </motion.div>
      )}
    </>
  );
};
