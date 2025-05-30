
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  type: 'product' | 'order' | 'user' | 'category' | 'page' | 'setting';
  description?: string;
  url: string;
  price?: number;
}

interface SearchResultsProps {
  isOpen: boolean;
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  onResultClick: (result: SearchResult) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  isOpen,
  query,
  results,
  isLoading,
  onResultClick
}) => {
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
                  onClick={() => onResultClick(result)}
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
  );
};

export default SearchResults;
