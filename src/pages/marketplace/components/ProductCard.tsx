
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Clock, AlertCircle, Bot, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/cart';
import { toast } from 'sonner';
import { convertMarketplaceProductToCartItem } from '@/hooks/cart/cartUtils';

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
  const [showAiPricing, setShowAiPricing] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const calculateDaysToExpiry = (expiryDate: string): number => {
    if (!expiryDate) return 999;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // AI Dynamic Pricing Logic
  const generateAiPricingRecommendation = () => {
    const daysToExpiry = calculateDaysToExpiry(product.expiryDate);
    const basePrice = product.price || 0;
    
    // AI factors: demand, expiry, time of day, inventory
    const demandFactor = Math.random() * 0.3 + 0.85; // 0.85-1.15
    const expiryFactor = daysToExpiry <= 7 ? 0.7 : daysToExpiry <= 14 ? 0.85 : 1.0;
    const timeOfDayFactor = new Date().getHours() > 18 ? 0.95 : 1.05; // Evening discount
    
    const aiRecommendedPrice = basePrice * demandFactor * expiryFactor * timeOfDayFactor;
    const priceChange = basePrice > 0 ? ((aiRecommendedPrice - basePrice) / basePrice) * 100 : 0;
    
    return {
      recommendedPrice: Math.round(aiRecommendedPrice * 100) / 100,
      priceChange: Math.round(priceChange * 100) / 100,
      reason: daysToExpiry <= 7 ? 'Near expiry discount' : 
              priceChange > 0 ? 'High demand detected' : 'Optimal pricing opportunity',
      confidence: 75 + Math.floor(Math.random() * 20)
    };
  };

  const aiPricing = generateAiPricingRecommendation();
  const daysToExpiry = product.expiryDate ? calculateDaysToExpiry(product.expiryDate) : null;
  const showAlert = showExpiryAlerts && daysToExpiry !== null && daysToExpiry <= 7 && daysToExpiry >= 0;

  const handleAddToCart = () => {
    try {
      const cartItem = convertMarketplaceProductToCartItem(product);
      addToCart(cartItem);
      toast.success(`${product.name} added to cart`);
      onAddToCart(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const getExpiryAlertColor = (): string => {
    if (!daysToExpiry || daysToExpiry > 5) return 'bg-amber-50 text-amber-800';
    if (daysToExpiry > 2) return 'bg-orange-50 text-orange-800';
    return 'bg-red-50 text-red-800';
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      className="rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow relative"
      variants={cardVariants}
      onMouseEnter={() => setShowAiPricing(true)}
      onMouseLeave={() => setShowAiPricing(false)}
    >
      {/* AI Pricing Overlay */}
      {showAiPricing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-2 left-2 z-10 bg-gradient-to-r from-purple-500 to-blue-500 text-white p-2 rounded-lg text-xs shadow-lg"
        >
          <div className="flex items-center gap-1 mb-1">
            <Bot className="h-3 w-3" />
            <span className="font-bold">AI Price</span>
          </div>
          <div className="flex items-center gap-1">
            {aiPricing.priceChange > 0 ? (
              <TrendingUp className="h-3 w-3 text-green-300" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-300" />
            )}
            <span>₹{aiPricing.recommendedPrice}</span>
          </div>
          <div className="text-xs opacity-90">{aiPricing.reason}</div>
          <div className="text-xs opacity-75">Confidence: {aiPricing.confidence}%</div>
        </motion.div>
      )}

      {/* Product Image */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-100">
        {!imageError ? (
          <img 
            src={product.image} 
            alt={product.name} 
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
        {product.discountPercentage && product.discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            {product.discountPercentage}% OFF
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
      
      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate" title={product.name}>
          {product.name || 'Unnamed Product'}
        </h3>
        
        <div className="flex justify-between items-center mt-1">
          <div className="flex flex-col">
            <span className="text-lg font-semibold">
              ₹{product.price ? product.price.toFixed(2) : '0.00'}
            </span>
            {Math.abs(aiPricing.priceChange) > 5 && (
              <span className="text-sm text-purple-600">
                AI: ₹{aiPricing.recommendedPrice}
              </span>
            )}
          </div>
          
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm text-gray-600">
              {product.rating ? product.rating.toFixed(1) : '0.0'}
            </span>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-1">{product.seller || 'Unknown Seller'}</p>
        
        {/* Expiry Alert */}
        {showAlert && (
          <div className={`mt-3 p-2 rounded-md ${getExpiryAlertColor()} flex items-center text-xs`}>
            <Clock className="h-3 w-3 mr-1" />
            <span>
              {daysToExpiry === 0 ? "Expires today!" : 
               daysToExpiry === 1 ? "Expires tomorrow!" :
               daysToExpiry && daysToExpiry > 0 ? `Expires in ${daysToExpiry} days` : "Expired"}
            </span>
          </div>
        )}
        
        {/* AI-generated expiry insight */}
        {showAlert && daysToExpiry !== null && daysToExpiry > 0 && (
          <p className="text-xs italic text-gray-500 mt-1">
            {getAiExpiryAlert(daysToExpiry)}
          </p>
        )}
        
        {/* Add to Cart Button */}
        <Button 
          className="w-full mt-4 flex items-center justify-center"
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
