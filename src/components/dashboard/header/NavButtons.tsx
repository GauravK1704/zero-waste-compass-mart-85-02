
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavButtonsProps {
  isSellerPortal: boolean;
}

const NavButtons: React.FC<NavButtonsProps> = ({ isSellerPortal }) => {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/');
  };

  const goToCart = () => {
    navigate('/cart');
  };

  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={goToHome}
        className={`hidden md:flex items-center gap-2 transition-colors home-button home-button-3d ${isSellerPortal ? 'seller-home-button seller-button-3d' : 'buyer-home-button buyer-button-3d'} button-bounce button-shimmer hover:bg-white hover:text-gray-800`}
      >
        <Home className="h-4 w-4 home-button-icon" />
        <span className="relative">Home</span>
      </Button>

      {!isSellerPortal && (
        <motion.div
          whileHover={{
            scale: 1.06,
            boxShadow: "0 0 18px 2px #8B5CF6aa",
          }}
          whileTap={{ scale: 0.96 }}
          className="h-full"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={goToCart}
            className="hidden md:flex items-center gap-2 transition-colors cart-button cart-button-3d cart-button-highlight buyer-button-3d button-bounce button-shimmer
              hover:bg-white hover:text-gray-800 group"
            style={{
              borderColor: '#8B5CF6',
              color: '#7C3AED'
            }}
          >
            <ShoppingCart className="h-4 w-4 group-hover:animate-bounce" />
            <motion.span 
              className="relative"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              transition={{ duration: 0.3 }}
            >
              Cart
            </motion.span>
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default NavButtons;
