
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/hooks/cart';

interface NavButtonsProps {
  isSellerPortal: boolean;
}

const NavButtons: React.FC<NavButtonsProps> = ({ isSellerPortal }) => {
  const navigate = useNavigate();
  const { getCartCount } = useCart();

  const goToHome = () => {
    navigate('/');
  };

  const goToCart = () => {
    navigate('/cart');
  };

  return (
    <div className="flex gap-3">
      <motion.div
        whileHover={{
          scale: 1.05,
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        }}
        whileTap={{ scale: 0.95 }}
        className="h-full"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={goToHome}
          className="hidden md:flex items-center gap-2 transition-all duration-300 bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 hover:border-gray-300 hover:bg-white hover:text-gray-700 text-gray-600 font-medium shadow-md hover:shadow-lg group"
        >
          <Home className="h-4 w-4 group-hover:animate-pulse" />
          <span className="relative">Home</span>
        </Button>
      </motion.div>

      {!isSellerPortal && (
        <motion.div
          whileHover={{
            scale: 1.05,
            boxShadow: "0 8px 25px rgba(139, 92, 246, 0.3)",
          }}
          whileTap={{ scale: 0.95 }}
          className="h-full relative"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={goToCart}
            className="hidden md:flex items-center gap-2 transition-all duration-300 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 hover:border-purple-400 hover:bg-white hover:text-purple-700 text-purple-600 font-medium shadow-md hover:shadow-lg group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-blue-400/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <ShoppingCart className="h-4 w-4 group-hover:animate-bounce relative z-10" />
            <span className="relative z-10">Cart</span>
            {getCartCount() > 0 && (
              <motion.span 
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold z-20"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
              >
                {getCartCount()}
              </motion.span>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default NavButtons;
