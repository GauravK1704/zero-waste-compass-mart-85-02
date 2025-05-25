
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye } from 'lucide-react';

interface ProductActionsProps {
  isHovered: boolean;
  isFavorited: boolean;
  onFavorite: () => void;
}

export const ProductActions: React.FC<ProductActionsProps> = ({
  isHovered,
  isFavorited,
  onFavorite
}) => {
  const overlayVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  if (!isHovered) return null;

  return (
    <motion.div
      className="absolute top-4 right-4 flex flex-col gap-2"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.button
        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        onClick={onFavorite}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Heart className={`h-5 w-5 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
      </motion.button>
      
      <motion.button
        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Eye className="h-5 w-5 text-gray-600" />
      </motion.button>
    </motion.div>
  );
};
