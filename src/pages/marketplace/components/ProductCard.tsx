
import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/cart';
import { toast } from 'sonner';
import { convertMarketplaceProductToCartItem } from '@/hooks/cart/cartUtils';
import { ProductImage } from './ProductCard/ProductImage';
import { ProductInfo } from './ProductCard/ProductInfo';
import { ExpiryAlert } from './ProductCard/ExpiryAlert';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  seller: string;
  sellerId: string;
  rating: number;
  image: string;
  expiryDate: string;
  discountPercentage?: number;
  inStock?: boolean;
  sellerVerified?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  showExpiryAlerts: boolean;
  getAiExpiryAlert: (days: number) => string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  showExpiryAlerts,
  getAiExpiryAlert 
}) => {
  const { addToCart } = useCart();
  
  const calculateDaysToExpiry = useCallback((expiryDate: string): number => {
    if (!expiryDate) return 999;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, []);
  
  // Memoize expensive calculations to prevent unnecessary re-renders
  const daysToExpiry = useMemo(() => 
    product.expiryDate ? calculateDaysToExpiry(product.expiryDate) : null, 
    [product.expiryDate, calculateDaysToExpiry]
  );
  const showAlert = useMemo(() => 
    showExpiryAlerts && daysToExpiry !== null && daysToExpiry <= 7 && daysToExpiry >= 0,
    [showExpiryAlerts, daysToExpiry]
  );

  const handleAddToCart = useCallback(() => {
    try {
      const cartItem = convertMarketplaceProductToCartItem(product);
      addToCart(cartItem);
      toast.success(`${product.name} added to cart`);
      onAddToCart(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  }, [product, addToCart, onAddToCart]);

  // Simplified animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
  };

  return (
    <motion.div
      className="rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow duration-200 relative"
      variants={cardVariants}
      layout={false}
    >
      <ProductImage 
        image={product.image}
        name={product.name}
        discountPercentage={product.discountPercentage}
      />
      
      <div className="p-4">
        <ProductInfo 
          name={product.name}
          price={product.price}
          rating={product.rating}
          seller={product.seller}
          sellerVerified={product.sellerVerified}
        />
        
        <ExpiryAlert 
          daysToExpiry={daysToExpiry}
          showAlert={showAlert}
          getAiExpiryAlert={getAiExpiryAlert}
        />
        
        <Button 
          className="w-full mt-4 flex items-center justify-center transition-colors duration-200"
          variant="default"
          onClick={handleAddToCart}
          disabled={product.inStock === false}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock === false ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
