
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/cart';
import { toast } from 'sonner';
import { convertMarketplaceProductToCartItem } from '@/hooks/cart/cartUtils';
import { AiPricingOverlay } from './ProductCard/AiPricingOverlay';
import { ProductImage } from './ProductCard/ProductImage';
import { ProductInfo } from './ProductCard/ProductInfo';
import { ExpiryAlert } from './ProductCard/ExpiryAlert';
import { useAiPricing } from './ProductCard/useAiPricing';

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
  
  const { calculateDaysToExpiry, generateAiPricingRecommendation } = useAiPricing(product);
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

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      className="rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow relative"
      variants={cardVariants}
      onMouseEnter={() => setShowAiPricing(true)}
      onMouseLeave={() => setShowAiPricing(false)}
    >
      <AiPricingOverlay aiPricing={aiPricing} showAiPricing={showAiPricing} />
      
      <ProductImage 
        image={product.image}
        name={product.name}
        discountPercentage={product.discountPercentage}
        aiPricing={aiPricing}
      />
      
      <div className="p-4">
        <ProductInfo 
          name={product.name}
          price={product.price}
          rating={product.rating}
          seller={product.seller}
          aiPricing={aiPricing}
        />
        
        <ExpiryAlert 
          daysToExpiry={daysToExpiry}
          showAlert={showAlert}
          getAiExpiryAlert={getAiExpiryAlert}
        />
        
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
