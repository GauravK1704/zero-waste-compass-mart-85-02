
import React from 'react';
import { Star } from 'lucide-react';

interface ProductInfoProps {
  name: string;
  price: number;
  rating: number;
  seller: string;
  sellerVerified?: boolean;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  price,
  rating,
  seller,
  sellerVerified
}) => {
  return (
    <>
      <h3 className="font-medium text-gray-900 truncate" title={name}>
        {name || 'Unnamed Product'}
      </h3>
      
      <div className="flex justify-between items-center mt-1">
        <span className="text-lg font-semibold">
          ₹{price ? price.toFixed(2) : '0.00'}
        </span>
        
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-500 mr-1" />
          <span className="text-sm text-gray-600">
            {rating ? rating.toFixed(1) : '0.0'}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mt-1">{seller || 'Unknown Seller'}</p>
    </>
  );
};
