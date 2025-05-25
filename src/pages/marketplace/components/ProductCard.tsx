
import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/hooks/cart';
import { toast } from 'sonner';
import { convertMarketplaceProductToCartItem } from '@/hooks/cart/cartUtils';
import { ProductInfo } from './ProductCard/ProductInfo';
import { ExpiryAlert } from './ProductCard/ExpiryAlert';
import { ProductImageSection } from './ProductCard/ProductImageSection';
import { AddToCartSection } from './ProductCard/AddToCartSection';

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
      const cartItem = convertMarketplaceProductToCartItem(product);
      cartItem.quantity = quantity;
      addToCart(cartItem);
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
      <ProductImageSection
        image={product.image}
        name={product.name}
        discountPercentage={product.discountPercentage}
        isHovered={isHovered}
        isFavorited={isFavorited}
        onFavorite={handleFavorite}
      />
      
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
        
        <AddToCartSection
          product={product}
          quantity={quantity}
          showQuantityControls={showQuantityControls}
          onAddToCart={handleAddToCart}
          onIncrement={incrementQuantity}
          onDecrement={decrementQuantity}
        />
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
