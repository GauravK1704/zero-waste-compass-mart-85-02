
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuantityControls } from './QuantityControls';

interface Product {
  inStock?: boolean;
}

interface AddToCartSectionProps {
  product: Product;
  quantity: number;
  showQuantityControls: boolean;
  onAddToCart: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const AddToCartSection: React.FC<AddToCartSectionProps> = ({
  product,
  quantity,
  showQuantityControls,
  onAddToCart,
  onIncrement,
  onDecrement
}) => {
  const buttonBaseClasses = "flex items-center justify-center transition-all duration-300 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 hover:from-purple-700 hover:via-blue-700 hover:to-purple-800 text-white font-semibold shadow-lg hover:shadow-xl relative overflow-hidden group";
  
  const shimmerEffect = (
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
  );

  return (
    <motion.div
      className="mt-6"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {!showQuantityControls ? (
        <Button 
          className={`w-full h-12 rounded-xl ${buttonBaseClasses}`}
          variant="default"
          onClick={onAddToCart}
          disabled={product.inStock === false}
        >
          {shimmerEffect}
          <ShoppingCart className="h-5 w-5 mr-2" />
          {product.inStock === false ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <QuantityControls
            quantity={quantity}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
          <Button 
            className={`flex-1 h-10 rounded-lg ${buttonBaseClasses}`}
            variant="default"
            onClick={onAddToCart}
            disabled={product.inStock === false}
          >
            {shimmerEffect}
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      )}
    </motion.div>
  );
};
