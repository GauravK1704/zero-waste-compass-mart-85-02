
import React, { useState } from 'react';
import { ShoppingCart, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductImageProps {
  image: string;
  name: string;
  discountPercentage?: number;
  aiPricing: {
    priceChange: number;
  };
}

export const ProductImage: React.FC<ProductImageProps> = ({
  image,
  name,
  discountPercentage,
  aiPricing
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="relative w-full h-48 overflow-hidden bg-gray-100">
      {!imageError ? (
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <div className="text-center">
            <ShoppingCart className="h-12 w-12 mx-auto mb-2" />
            <span className="text-sm">Image unavailable</span>
          </div>
        </div>
      )}
      
      {/* Discount Tag */}
      {discountPercentage && discountPercentage > 0 && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
          {discountPercentage}% OFF
        </div>
      )}

      {/* AI Recommendation Badge */}
      {Math.abs(aiPricing.priceChange) > 5 && (
        <Badge className="absolute bottom-2 right-2 bg-purple-500 text-white">
          <Bot className="h-3 w-3 mr-1" />
          AI Rec
        </Badge>
      )}
    </div>
  );
};
