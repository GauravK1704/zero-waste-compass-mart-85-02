
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/hooks/cart';
import { motion } from 'framer-motion';

import { mockProducts } from './data/mockProducts';
import { calculateDiscount, getAiExpiryAlert } from './utils/productUtils';
import MarketplaceHeader from './components/MarketplaceHeader';
import CategoryTabs from './components/CategoryTabs';
import ProductGrid from './components/ProductGrid';
import LoadingState from './components/LoadingState';
import { Product } from './data/mockProducts';

const Marketplace: React.FC = () => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [showExpiryAlerts, setShowExpiryAlerts] = useState(true);

  // Get all unique categories from products
  const categories = ['all', ...Array.from(new Set(mockProducts.map(p => p.category.toLowerCase())))];

  // Fetch products with better error handling
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // This would be a real Supabase query in production
        // const { data, error } = await supabase
        //   .from('products')
        //   .select('*')
        
        // For now, we'll use our mock data with validation
        const data = mockProducts.filter(product => {
          // Validate required fields
          return product.id && product.name && product.price >= 0;
        });
        
        // Apply dynamic pricing algorithm
        const updatedProducts = data.map(product => {
          const discountPercentage = calculateDiscount(product.expiryDate);
          return {
            ...product,
            discountPercentage,
            inStock: product.inStock !== false // Default to true if not specified
          };
        });
        
        setProducts(updatedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
        toast({ 
          title: "Error", 
          description: "Failed to load products. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [toast]);

  const handleAddToCart = async (product: Product) => {
    try {
      const discountedPrice = product.discountPercentage 
        ? product.price - (product.price * product.discountPercentage / 100)
        : product.price;
        
      const cartItem = {
        id: `cart-${product.id}-${Date.now()}`,
        product_id: product.id,
        name: product.name,
        price: discountedPrice,
        image: product.image,
        expiryDate: product.expiryDate,
        sellerId: product.sellerId,
        quantity: 1
      };
      
      console.log("Adding item to cart:", cartItem);
      await addToCart(cartItem);
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleExpiryAlerts = () => {
    setShowExpiryAlerts(!showExpiryAlerts);
    toast({
      title: showExpiryAlerts ? "Expiry alerts disabled" : "Expiry alerts enabled",
      description: showExpiryAlerts 
        ? "You won't see AI-generated expiry recommendations" 
        : "You'll now see AI-generated expiry recommendations"
    });
  };

  const retryFetch = () => {
    setError(null);
    setLoading(true);
    // Trigger refetch
    window.location.reload();
  };

  // Show loading state
  if (loading) {
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="max-w-md mx-auto">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={retryFetch}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show empty state
  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <MarketplaceHeader 
          showExpiryAlerts={showExpiryAlerts} 
          toggleExpiryAlerts={toggleExpiryAlerts} 
        />
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No products available</h2>
            <p className="text-gray-600">Check back later for new products!</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <MarketplaceHeader 
        showExpiryAlerts={showExpiryAlerts} 
        toggleExpiryAlerts={toggleExpiryAlerts} 
      />
      
      <CategoryTabs 
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      >
        {categories.map((category) => (
          <ProductGrid
            key={category}
            category={category}
            products={products}
            onAddToCart={handleAddToCart}
            showExpiryAlerts={showExpiryAlerts}
            getAiExpiryAlert={getAiExpiryAlert}
          />
        ))}
      </CategoryTabs>
    </div>
  );
};

export default Marketplace;
