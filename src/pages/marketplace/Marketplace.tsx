import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from '@/hooks/cart';
import { supabase } from '@/integrations/supabase/client';

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
  const { addToCart } = useCart();
  const [showExpiryAlerts, setShowExpiryAlerts] = useState(true);

  // Get all unique categories from products
  const categories = ['all', ...Array.from(new Set(mockProducts.map(p => p.category.toLowerCase())))];

  // Fetch products from Supabase (simulated for now)
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // This would be a real Supabase query in production
        // const { data, error } = await supabase
        //   .from('products')
        //   .select('*')
        
        // For now, we'll use our mock data
        const data = mockProducts;
        
        // Apply dynamic pricing algorithm
        const updatedProducts = data.map(product => {
          const discountPercentage = calculateDiscount(product.expiryDate);
          return {
            ...product,
            discountPercentage
          };
        });
        
        setProducts(updatedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({ 
          title: "Error", 
          description: "Failed to load products. Please try again later." 
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

  // Show loading state
  if (loading) {
    return <LoadingState />;
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
