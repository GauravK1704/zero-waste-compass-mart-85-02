import React, { useState } from 'react';
import { Item, ItemCategory } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { useLocalStorage } from '@/pages/items/hooks/useLocalStorage';
import { motion, AnimatePresence } from 'framer-motion';
import { ActionMenuProps } from './menu/types';
import BasicActions from './menu/BasicActions';
import CategoryMenu from './menu/CategoryMenu';
import EnhancedActions from './menu/EnhancedActions';
import DeleteMenuItem from './menu/DeleteMenuItem';
import EnhancedDynamicPricingDialog from './menu/EnhancedDynamicPricingDialog';

const ProductActionMenu: React.FC<ActionMenuProps> = ({ product }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(product.category);
  const [savedProducts, setSavedProducts] = useLocalStorage<Item[]>('seller-products', []);
  const [showDynamicPricing, setShowDynamicPricing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleEditProduct = (productId: string) => {
    toast.info("Editing product", {
      description: `You're now editing product ${productId.substring(0, 8)}...`,
      duration: 3000,
    });
    // navigate(`/items/edit/${productId}`);
  };

  const handleViewDetails = (productId: string) => {
    toast.info("Viewing product details", {
      description: `Viewing details for product ${productId.substring(0, 8)}...`,
      duration: 3000,
    });
    // navigate(`/items/${productId}`);
  };

  const handleDuplicateProduct = (product: Item) => {
    // Create a duplicate with new ID
    const duplicatedProduct = {
      ...product,
      id: `duplicate-${Date.now()}`,
      name: `${product.name} (Copy)`,
      createdAt: new Date().toISOString()
    };
    
    // Add to saved products
    const updatedProducts = [...savedProducts, duplicatedProduct];
    setSavedProducts(updatedProducts);
    
    toast.success("Product duplicated", {
      description: `"${product.name}" has been duplicated`,
      duration: 3000,
    });
  };

  const handleChangeCategory = (newCategory: string) => {
    setSelectedCategory(newCategory);
    
    // Update the product in the local storage
    const updatedProducts = savedProducts.map(p => {
      if (p.id === product.id) {
        return { ...p, category: newCategory as ItemCategory };
      }
      return p;
    });
    
    setSavedProducts(updatedProducts);
    
    toast.success("Category updated", {
      description: `Product category changed to "${newCategory}"`,
      duration: 3000,
    });
  };

  const handleToggleVisibility = (product: Item, currentStatus: string) => {
    const newStatus = currentStatus === 'available' ? 'flagged' : 'available';
    
    // Update the product status in local storage
    const updatedProducts = savedProducts.map(p => {
      if (p.id === product.id) {
        return { ...p, status: newStatus as any };
      }
      return p;
    });
    
    setSavedProducts(updatedProducts);
    
    toast.success("Status updated", {
      description: `Product "${product.name}" is now ${newStatus}`,
      duration: 3000,
    });
  };

  const handleDownloadProductData = (product: Item) => {
    // Create a JSON blob
    const blob = new Blob([JSON.stringify(product, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create download link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `product-${product.id.substring(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Product data downloaded", {
      description: `Data for "${product.name}" has been downloaded as JSON`,
      duration: 3000,
    });
  };

  const handleAnalyticsView = (productId: string) => {
    toast.info("Analytics View", {
      description: `Viewing analytics for product ${productId.substring(0, 8)}...`,
      duration: 3000,
    });
  };

  const handleShareProduct = (product: Item) => {
    // Create a shareable link (in a real app, this would be a proper URL)
    const shareableLink = `${window.location.origin}/products/${product.id}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareableLink).then(() => {
      toast.success("Link copied to clipboard", {
        description: `Share link for "${product.name}" copied`,
        duration: 3000,
      });
    });
  };

  const handleDeleteProduct = (productId: string) => {
    // Remove the product from local storage
    const updatedProducts = savedProducts.filter(p => p.id !== productId);
    setSavedProducts(updatedProducts);
    
    toast.error("Product deleted", {
      description: `Product has been removed`,
      duration: 3000,
    });
  };

  const handlePromoteProduct = (product: Item) => {
    toast.success("Product promoted", {
      description: `"${product.name}" will be featured in promotions`,
      duration: 3000,
    });
  };

  const handleToggleDynamicPricing = (product: Item) => {
    setShowDynamicPricing(true);
  };

  const handleUpdateDynamicPricing = (settings: {
    enabled: boolean;
    minPrice?: number;
    maxPrice?: number;
    strategy?: string;
    automaticAdjustment?: boolean;
    aiInsights?: any;
  }) => {
    // Update the product dynamic pricing status in local storage
    const updatedProducts = savedProducts.map(p => {
      if (p.id === product.id) {
        return { 
          ...p, 
          dynamicPricingEnabled: settings.enabled,
          dynamicPricingSettings: {
            minPrice: settings.minPrice || p.currentPrice * 0.7,
            maxPrice: settings.maxPrice || p.currentPrice * 1.3,
            strategy: settings.strategy || 'ai-optimized',
            automaticAdjustment: settings.automaticAdjustment || false,
            aiInsights: settings.aiInsights
          }
        };
      }
      return p;
    });
    
    setSavedProducts(updatedProducts);
    setShowDynamicPricing(false);
    
    toast.success("AI Dynamic Pricing Updated", {
      description: `Enhanced dynamic pricing ${settings.enabled ? 'enabled' : 'disabled'} for "${product.name}"`,
      duration: 3000,
    });
  };

  const handlePrintLabel = (product: Item) => {
    toast.info("Printing label", {
      description: `Preparing label for "${product.name}"`,
      duration: 3000,
    });
  };

  const handleSetAlert = (product: Item) => {
    toast.success("Alert set", {
      description: `You'll be notified when "${product.name}" is low in stock`,
      duration: 3000,
    });
  };

  return (
    <>
      <DropdownMenu onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <motion.div 
            whileHover={{ rotate: 90, scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
            initial={false}
            animate={isMenuOpen ? { rotate: 90 } : { rotate: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button variant="ghost" className="h-8 w-8 p-0 menu-icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="table-dropdown-content w-56">
          <BasicActions 
            product={product}
            onViewDetails={handleViewDetails}
            onEditProduct={handleEditProduct}
            onDuplicateProduct={handleDuplicateProduct}
          />
          
          {/* Category Change Option */}
          <CategoryMenu 
            selectedCategory={selectedCategory}
            onCategoryChange={handleChangeCategory}
          />
          
          <DropdownMenuSeparator />
          
          <EnhancedActions 
            product={product}
            onToggleDynamicPricing={handleToggleDynamicPricing}
            onPromoteProduct={handlePromoteProduct}
            onPrintLabel={handlePrintLabel}
            onSetAlert={handleSetAlert}
            onDownloadProductData={handleDownloadProductData}
            onAnalyticsView={handleAnalyticsView}
            onShareProduct={handleShareProduct}
            onToggleVisibility={handleToggleVisibility}
          />
          
          <DropdownMenuSeparator />
          
          <DeleteMenuItem onClick={() => handleDeleteProduct(product.id)} />
        </DropdownMenuContent>
      </DropdownMenu>
      
      <EnhancedDynamicPricingDialog 
        isOpen={showDynamicPricing} 
        onClose={() => setShowDynamicPricing(false)}
        onSave={handleUpdateDynamicPricing}
        product={product}
      />
    </>
  );
};

export default ProductActionMenu;
