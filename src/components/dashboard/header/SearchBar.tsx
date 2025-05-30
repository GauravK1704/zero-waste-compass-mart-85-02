
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/use-auth';
import { mockProducts } from '@/pages/marketplace/data/mockProducts';

interface SearchResult {
  id: string;
  title: string;
  type: 'product' | 'order' | 'user' | 'category' | 'page' | 'setting';
  description?: string;
  url: string;
  price?: number;
}

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const searchRef = useRef<HTMLDivElement>(null);

  // Enhanced search function that includes marketplace products
  const searchItems = async (searchQuery: string): Promise<SearchResult[]> => {
    if (!searchQuery.trim()) return [];
    
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const results: SearchResult[] = [];
    const lowercaseQuery = searchQuery.toLowerCase();
    
    // Search marketplace products
    const productResults = mockProducts
      .filter(product => 
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery) ||
        product.description?.toLowerCase().includes(lowercaseQuery)
      )
      .slice(0, 4)
      .map(product => ({
        id: product.id,
        title: product.name,
        type: 'product' as const,
        description: `₹${product.price} - ${product.category}`,
        url: '/marketplace',
        price: product.price
      }));

    // Mock results based on user type
    const contextResults: SearchResult[] = currentUser?.isSeller ? [
      {
        id: '1',
        title: 'Seller Analytics',
        type: 'page',
        description: 'View sales analytics',
        url: '/seller/analytics'
      },
      {
        id: '2',
        title: 'Order Management',
        type: 'page',
        description: 'Manage your orders',
        url: '/seller/orders'
      },
      {
        id: '3',
        title: 'Product Management',
        type: 'page',
        description: 'Manage your products',
        url: '/seller/products'
      }
    ] : [
      {
        id: '1',
        title: 'My Orders',
        type: 'page',
        description: 'Track your orders',
        url: '/orders'
      },
      {
        id: '2',
        title: 'Profile Settings',
        type: 'setting',
        description: 'Update your profile',
        url: '/profile'
      },
      {
        id: '3',
        title: 'Account Settings',
        type: 'setting',
        description: 'Manage account settings',
        url: '/settings'
      }
    ];
    
    // Filter context results based on search query
    const filteredContextResults = contextResults.filter(item => 
      item.title.toLowerCase().includes(lowercaseQuery) ||
      item.description?.toLowerCase().includes(lowercaseQuery)
    );
    
    results.push(...productResults, ...filteredContextResults);
    
    setIsLoading(false);
    return results.slice(0, 6);
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.trim()) {
        searchItems(query).then(setResults);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'product': return '🛍️';
      case 'order': return '🛒';
      case 'user': return '👤';
      case 'category': return '📁';
      case 'page': return '📄';
      case 'setting': return '⚙️';
      default: return '🔍';
    }
  };

  return (
    <div className="flex-1 max-w-md ml-8 navbar-item relative" ref={searchRef}>
      <motion.div 
        className="relative w-full search-bar-focus rounded-lg overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0"
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground search-icon-animated z-10" />
        
        <Input 
          type="search" 
          placeholder="Search products, orders, pages..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10 w-full bg-gray-50/80 backdrop-blur-sm border-gray-200/60 transition-all duration-300 focus:ring-2 focus:ring-offset-0 focus:ring-blue-400/50 focus:border-blue-400/60 focus:bg-white/90 hover:bg-white/60" 
        />
        
        <AnimatePresence>
          {(query || isOpen) && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={clearSearch}
              className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <X size={16} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {isOpen && (query || results.length > 0) && (
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
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((result, index) => (
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
            ) : query ? (
              <div className="p-4 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No results found for "{query}"</p>
                <p className="text-xs text-gray-400 mt-1">Try searching for products, pages, or settings</p>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
