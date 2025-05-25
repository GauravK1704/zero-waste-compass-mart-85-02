
import React from 'react';
import { Star, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
      
      <div className="flex items-center justify-between mt-1">
        <p className="text-sm text-gray-500">{seller || 'Unknown Seller'}</p>
        {sellerVerified && (
          <Badge 
            variant="secondary" 
            className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1 px-2 py-1"
          >
            <Shield className="h-3 w-3" />
            <span className="text-xs">Verified</span>
          </Badge>
        )}
      </div>
    </>
  );
};
