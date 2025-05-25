
import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/cart';
import { toast } from 'sonner';
import { convertMarketplaceProductToCartItem } from '@/hooks/cart/cartUtils';
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
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showQuantityControls, setShowQuantityControls] = useState(false);
  
  const calculateDaysToExpiry = useCallback((expiryDate: string): number => {
    if (!expiryDate) return 999;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, []);
  
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
      for (let i = 0; i < quantity; i++) {
        const cartItem = convertMarketplaceProductToCartItem(product);
        addToCart(cartItem);
      }
      toast.success(`${quantity} x ${product.name} added to cart`);
      onAddToCart(product);
      setShowQuantityControls(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  }, [product, addToCart, onAddToCart, quantity]);

  const handleFavorite = useCallback(() => {
    setIsFavorited(!isFavorited);
    toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
  }, [isFavorited]);

  const incrementQuantity = useCallback(() => {
    setQuantity(prev => prev + 1);
  }, []);

  const decrementQuantity = useCallback(() => {
    setQuantity(prev => Math.max(1, prev - 1));
  }, []);

  // Enhanced animation variants with premium quality
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95,
      rotateX: 15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.6
      }
    },
    hover: {
      y: -12,
      scale: 1.03,
      rotateY: 2,
      boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300
      }
    }
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      className="rounded-2xl overflow-hidden shadow-xl bg-white transition-all duration-300 relative group cursor-pointer border border-gray-100"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout={false}
    >
      {/* Premium image section with HD quality */}
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
          src={product.image || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&h=600&fit=crop&auto=format&q=80'} 
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          variants={imageVariants}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Premium gradient overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Action buttons overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute top-4 right-4 flex flex-col gap-2"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.button
                className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                onClick={handleFavorite}
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
          )}
        </AnimatePresence>
        
        {/* Premium discount badge */}
        {product.discountPercentage && product.discountPercentage > 0 && (
          <motion.div 
            className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", damping: 15 }}
            whileHover={{ scale: 1.05 }}
          >
            -{product.discountPercentage}% OFF
          </motion.div>
        )}
      </div>
      
      {/* Enhanced content section */}
      <motion.div 
        className="p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
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
        
        {/* Premium add to cart button with quantity controls */}
        <motion.div
          className="mt-6"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {!showQuantityControls ? (
            <Button 
              className="w-full h-12 flex items-center justify-center transition-all duration-300 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 hover:from-purple-700 hover:via-blue-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 relative overflow-hidden group"
              variant="default"
              onClick={handleAddToCart}
              disabled={product.inStock === false}
            >
              {/* Button shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.inStock === false ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-100 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={decrementQuantity}
                  className="h-10 w-10 p-0 hover:bg-gray-200"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={incrementQuantity}
                  className="h-10 w-10 p-0 hover:bg-gray-200"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                className="flex-1 h-10 flex items-center justify-center transition-all duration-300 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 hover:from-purple-700 hover:via-blue-700 hover:to-purple-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl relative overflow-hidden group"
                variant="default"
                onClick={handleAddToCart}
                disabled={product.inStock === false}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
