import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/hooks/cart';
import NotificationCenter from '@/components/NotificationCenter';
import AINotificationCenter from '@/components/notifications/AINotificationCenter';
import UserMenu from './UserMenu';
import { mockProducts } from '@/pages/marketplace/data/mockProducts';

interface SearchResult {
  id: string;
  title: string;
  type: 'product' | 'page' | 'setting';
  description?: string;
  url: string;
  price?: number;
  image?: string;
}

const TopNavbar = () => {
  const { user } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Navigation and settings search data
  const navigationItems = [
    { title: 'Dashboard', url: '/dashboard', type: 'page' as const },
    { title: 'Marketplace', url: '/marketplace', type: 'page' as const },
    { title: 'My Orders', url: '/orders', type: 'page' as const },
    { title: 'Cart', url: '/cart', type: 'page' as const },
    { title: 'Profile', url: '/profile', type: 'page' as const },
    { title: 'Settings', url: '/settings', type: 'page' as const },
  ];

  const settingsItems = [
    { title: 'Account Settings', url: '/settings', type: 'setting' as const },
    { title: 'Notification Preferences', url: '/settings', type: 'setting' as const },
    { title: 'Privacy Settings', url: '/settings', type: 'setting' as const },
    { title: 'Security Settings', url: '/settings', type: 'setting' as const },
  ];

  // Enhanced search function
  const performSearch = async (query: string): Promise<SearchResult[]> => {
    if (!query.trim()) return [];
    
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const results: SearchResult[] = [];
    const lowercaseQuery = query.toLowerCase();
    
    // Search products
    const productResults = mockProducts
      .filter(product => 
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery)
      )
      .slice(0, 5)
      .map(product => ({
        id: product.id,
        title: product.name,
        type: 'product' as const,
        description: `₹${product.price} - ${product.category}`,
        url: `/marketplace?product=${product.id}`,
        price: product.price,
        image: product.image
      }));
    
    // Search navigation items
    const navResults = navigationItems
      .filter(item => item.title.toLowerCase().includes(lowercaseQuery))
      .map(item => ({
        id: item.url,
        title: item.title,
        type: item.type,
        description: `Navigate to ${item.title}`,
        url: item.url
      }));
    
    // Search settings
    const settingResults = settingsItems
      .filter(item => item.title.toLowerCase().includes(lowercaseQuery))
      .map(item => ({
        id: item.title,
        title: item.title,
        type: item.type,
        description: 'Open settings',
        url: item.url
      }));
    
    results.push(...productResults, ...navResults, ...settingResults);
    
    setIsLoading(false);
    return results.slice(0, 8);
  };

  // Search effect
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery).then(setSearchResults);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'product': return '🛍️';
      case 'page': return '📄';
      case 'setting': return '⚙️';
      default: return '🔍';
    }
  };

  return (
    <motion.nav 
      className="bg-gradient-to-r from-white via-gray-50 to-white border-b-2 border-gray-100 px-4 py-3 shadow-lg backdrop-blur-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <motion.div 
            className="flex-shrink-0"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <h1 className="text-xl font-bold text-black tracking-tight">Zero Waste Mart</h1>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-6">
            <motion.div 
              whileHover={{ 
                scale: 1.08, 
                y: -4,
                boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.3)" 
              }} 
              whileTap={{ scale: 0.95 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 25 
              }}
            >
              <Button 
                variant="ghost" 
                onClick={() => navigate('/marketplace')}
                className="home-button home-button-pulse home-button-sparkle font-medium text-gray-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-white hover:to-blue-50 transition-all duration-400 relative overflow-hidden group"
              >
                <span className="relative z-10">Marketplace</span>
              </Button>
            </motion.div>
            <motion.div 
              whileHover={{ 
                scale: 1.08, 
                y: -4,
                boxShadow: "0 20px 25px -5px rgba(139, 92, 246, 0.3)" 
              }} 
              whileTap={{ scale: 0.95 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 25 
              }}
            >
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="home-button home-button-pulse home-button-sparkle font-medium text-gray-700 hover:text-purple-600 hover:bg-gradient-to-r hover:from-white hover:to-purple-50 transition-all duration-400 relative overflow-hidden group"
              >
                <span className="relative z-10">Dashboard</span>
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="flex-1 max-w-lg mx-16 relative" ref={searchRef}>
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10 search-icon-animated" />
            <Input
              type="text"
              placeholder="Search products, pages, settings..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="pl-10 pr-10 bg-white/80 backdrop-blur-sm border-2 border-gray-200/60 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-300 shadow-sm hover:bg-white/90 hover:shadow-md search-bar-focus"
            />
            
            <AnimatePresence>
              {(searchQuery || isSearchOpen) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                  <X size={16} />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {isSearchOpen && (searchQuery || searchResults.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-gray-200/60 rounded-xl shadow-lg z-50 max-h-80 overflow-hidden search-dropdown"
              >
                {isLoading ? (
                  <div className="p-4 text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block"
                    >
                      <Search className="h-5 w-5 text-blue-500" />
                    </motion.div>
                    <p className="text-sm text-gray-500 mt-2">Searching...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleResultClick(result)}
                        className="px-4 py-3 hover:bg-gray-50/80 cursor-pointer border-b border-gray-100/50 last:border-b-0 transition-colors group"
                      >
                        <div className="flex items-center space-x-3">
                          <motion.span 
                            className="text-lg"
                            whileHover={{ scale: 1.2 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            {getResultIcon(result.type)}
                          </motion.span>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {result.title}
                            </p>
                            {result.description && (
                              <p className="text-sm text-gray-500 truncate">
                                {result.description}
                              </p>
                            )}
                          </div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors"
                          >
                            {result.type}
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="p-4 text-center text-gray-500">
                    <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No results found for "{searchQuery}"</p>
                    <p className="text-xs text-gray-400 mt-1">Try searching for products, pages, or settings</p>
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center space-x-4">
          <motion.div 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
            className="relative"
          >
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/cart')}
              className="relative hover:bg-purple-50 hover:text-purple-600 transition-all duration-300"
            >
              <ShoppingCart className="h-5 w-5" />
              {getCartCount() > 0 && (
                <motion.span 
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                >
                  {getCartCount()}
                </motion.span>
              )}
            </Button>
          </motion.div>
          
          <NotificationCenter />
          
          {user && <AINotificationCenter />}
          
          {user ? (
            <UserMenu />
          ) : (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/auth/login')}
                className="hover:bg-purple-50 hover:text-purple-600 transition-all duration-300"
              >
                <User className="h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default TopNavbar;
