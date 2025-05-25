
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
  // Premium animation variants with staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9,
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
    }
  };

  const filteredProducts = products.filter(p => 
    category === 'all' || p.category.toLowerCase() === category
  );

  return (
    <TabsContent key={category} value={category} className="mt-8">
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        layout={false}
      >
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            variants={itemVariants}
            custom={index}
            whileInView={{ 
              opacity: 1, 
              y: 0,
              transition: { 
                delay: index * 0.05,
                duration: 0.5,
                ease: "easeOut"
              }
            }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <ProductCard 
              product={product} 
              onAddToCart={onAddToCart} 
              showExpiryAlerts={showExpiryAlerts}
              getAiExpiryAlert={getAiExpiryAlert}
            />
          </motion.div>
        ))}
      </motion.div>
    </TabsContent>
  );
};

export default ProductGrid;
