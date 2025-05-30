
import React, { useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AISearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredMessages: any[];
  isSearching: boolean;
}

const AISearchBar: React.FC<AISearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  filteredMessages,
  isSearching
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isSearching) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearching]);

  if (!isSearching) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden"
    >
      <div className="p-2 bg-gradient-to-r from-gray-50 to-blue-50/30 flex items-center gap-2 border-b border-gray-100/50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversation..."
            className="w-full h-8 text-sm pl-10 border-gray-200 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400"
            autoComplete="off"
          />
        </div>
        
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Button
              variant="ghost" 
              size="icon"
              onClick={() => setSearchQuery('')}
              className="h-6 w-6 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <X size={14} />
            </Button>
          </motion.div>
        )}
      </div>
      
      {searchQuery && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-3 py-1 bg-gray-50/80 border-b border-gray-100/50"
        >
          <p className="text-xs text-gray-500 flex items-center gap-2">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              🔍
            </motion.span>
            Found {filteredMessages.length} {filteredMessages.length === 1 ? 'result' : 'results'}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AISearchBar;
