
import React from 'react';
import { Search, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '@/hooks/cart';
import NotificationCenter from '@/components/NotificationCenter';
import AINotificationCenter from '@/components/notifications/AINotificationCenter';
import UserMenu from './UserMenu';

const TopNavbar = () => {
  const { user } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

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

        <div className="flex-1 max-w-lg mx-8">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10 bg-white border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-300 shadow-sm"
            />
          </motion.div>
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
          
          {/* Regular Notifications */}
          <NotificationCenter />
          
          {/* AI-Powered Notifications for Sellers */}
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
