
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShoppingBag } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Skeleton */}
      <div className="space-y-6 mb-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="h-10 bg-gray-200 rounded-lg w-80 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto animate-pulse"></div>
        </motion.div>

        {/* AI Insights Card Skeleton */}
        <motion.div
          className="bg-gray-100 rounded-lg p-6 animate-pulse"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div>
                <div className="h-4 bg-gray-300 rounded w-40 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-64"></div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-8 bg-gray-300 rounded"></div>
              <div className="w-24 h-8 bg-gray-300 rounded"></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category Tabs Skeleton */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-lg w-20 animate-pulse flex-shrink-0"></div>
        ))}
      </div>

      {/* Loading Animation */}
      <motion.div 
        className="flex flex-col items-center justify-center py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="h-16 w-16 text-purple-600" />
          </motion.div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ShoppingBag className="h-8 w-8 text-purple-400" />
          </motion.div>
        </div>
        
        <motion.h3 
          className="text-xl font-semibold text-gray-700 mb-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading Marketplace
        </motion.h3>
        
        <p className="text-gray-500 text-center max-w-md">
          Fetching the best sustainable products for you...
        </p>
      </motion.div>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="rounded-lg overflow-hidden shadow-md bg-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
          >
            <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LoadingState;
