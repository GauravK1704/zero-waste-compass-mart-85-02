
import React from 'react';

interface ProductImageProps {
  image: string;
  name: string;
  discountPercentage?: number;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  image,
  name,
  discountPercentage
}) => {
  return (
    <div className="relative h-48 bg-gray-100">
      <img 
        src={image || '/placeholder.svg'} 
        alt={name}
        className="w-full h-full object-cover"
      />
      
      {/* Discount Badge */}
      {discountPercentage && discountPercentage > 0 && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
          -{discountPercentage}%
        </div>
      )}
    </div>
  );
};
