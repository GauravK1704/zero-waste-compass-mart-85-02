
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
  const [imageLoaded, setImageLoaded] = useState(false);
  
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

  // Enhanced animation variants with smooth transitions
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className="rounded-xl overflow-hidden shadow-lg bg-white transition-all duration-300 relative group"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      layout={false}
    >
      {/* Enhanced image section with loading state */}
      <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"></div>
          </div>
        )}
        <motion.img 
          src={product.image || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&h=600&fit=crop'} 
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Discount Badge with enhanced styling */}
        {product.discountPercentage && product.discountPercentage > 0 && (
          <motion.div 
            className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            -{product.discountPercentage}%
          </motion.div>
        )}
      </div>
      
      <motion.div 
        className="p-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <ProductInfo 
          name={product.name}
          price={product.price}
          rating={product.rating}
          seller={product.seller}
        />
        
        <ExpiryAlert 
          daysToExpiry={daysToExpiry}
          showAlert={showAlert}
          getAiExpiryAlert={getAiExpiryAlert}
        />
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            className="w-full mt-4 flex items-center justify-center transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl"
            variant="default"
            onClick={handleAddToCart}
            disabled={product.inStock === false}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock === false ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
