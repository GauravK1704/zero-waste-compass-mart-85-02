
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchInputProps {
  query: string;
  setQuery: (query: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onClear: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  query,
  setQuery,
  isOpen,
  setIsOpen,
  onClear
}) => {
  return (
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
            onClick={onClear}
            className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchInput;
