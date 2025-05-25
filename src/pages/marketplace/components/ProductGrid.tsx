
import React from 'react';
import { motion } from 'framer-motion';
import { TabsContent } from '@/components/ui/tabs';
import ProductCard from './ProductCard';

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

interface ProductGridProps {
  category: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
  showExpiryAlerts: boolean;
  getAiExpiryAlert: (days: number) => string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  category, 
  products, 
  onAddToCart, 
  showExpiryAlerts, 
  getAiExpiryAlert 
}) => {
  // Simplified animation variants to reduce flickering
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        duration: 0.2
      }
    }
  };

  const filteredProducts = products.filter(p => 
    category === 'all' || p.category.toLowerCase() === category
  );

  return (
    <TabsContent key={category} value={category} className="mt-6">
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        layout={false}
      >
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={onAddToCart} 
            showExpiryAlerts={showExpiryAlerts}
            getAiExpiryAlert={getAiExpiryAlert}
          />
        ))}
      </motion.div>
    </TabsContent>
  );
};

export default ProductGrid;
