
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isMobile = useIsMobile();

  const navigationItems = currentUser 
    ? [{ label: 'Dashboard', onClick: () => navigate('/dashboard'), highlight: true }]
    : [
        { label: 'Login', onClick: () => navigate('/login'), highlight: false },
        { label: 'Sign Up', onClick: () => navigate('/register'), highlight: true }
      ];

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Logo size="md" showText={true} animated={true} onClick={() => navigate('/')} />
          </div>
          
          {isMobile ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <Button 
                        onClick={item.onClick}
                        className={`w-full ${item.highlight ? "zwm-gradient-hover button-pulse-glow" : item.label === 'Login' ? "login-button login-button-pulse" : "button-bounce"}`}
                        variant={item.highlight ? "default" : "ghost"}
                      >
                        {item.label}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <div className="flex items-center space-x-4">
              {navigationItems.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.3 }}
                >
                  <Button 
                    onClick={item.onClick} 
                    className={
                      item.highlight 
                        ? "zwm-gradient-hover button-pulse-glow button-shimmer" 
                        : item.label === 'Login'
                        ? "login-button login-button-pulse enhanced-hover"
                        : "enhanced-hover"
                    }
                    variant={item.highlight ? "default" : "ghost"}
                  >
                    {item.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
