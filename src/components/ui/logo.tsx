
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  animated?: boolean;
  onClick?: () => void;
  certified?: boolean;
  sellerName?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  className, 
  showText = true,
  animated = true,
  onClick,
  certified = false,
  sellerName
}) => {
  const sizeClasses = {
    sm: certified ? 'h-16 w-16' : 'h-8 w-8',
    md: certified ? 'h-20 w-20' : 'h-10 w-10',
    lg: certified ? 'h-24 w-24' : 'h-12 w-12',
    xl: certified ? 'h-32 w-32' : 'h-16 w-16',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  if (certified) {
    return (
      <motion.div 
        className={cn("flex flex-col items-center", className)}
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div 
          className={cn(
            "rounded-full relative flex items-center justify-center overflow-hidden border-4 border-red-500",
            sizeClasses[size]
          )}
          initial={{ rotate: 0 }}
          animate={animated ? { 
            rotate: [0, 360],
          } : {}}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear"
          }}
        >
          {/* White background */}
          <div className="absolute inset-2 rounded-full bg-white"></div>
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs font-bold text-red-500 leading-tight">
                ZERO WASTE MART
              </div>
              <div className="text-lg font-bold text-red-500 mt-1">
                CERTIFIED
              </div>
              {sellerName && (
                <div className="text-xs text-gray-600 mt-1 border-t border-gray-300 pt-1">
                  {sellerName}
                </div>
              )}
              {/* Stars decoration */}
              <div className="text-red-500 text-sm mt-1">★★★</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className={cn("flex items-center gap-2", className)}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div 
        className={cn(
          "rounded-full flex items-center justify-center text-white font-bold relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600",
          sizeClasses[size],
          animated && "hover-scale"
        )}
        initial={{ rotate: 0 }}
        animate={animated ? { 
          rotate: [0, 5, 0, -5, 0],
          scale: [1, 1.05, 1, 1.05, 1]
        } : {}}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          repeatType: "loop",
          ease: "easeInOut"
        }}
      >
        <span className="text-white font-bold text-xl">🍃</span>
        {animated && (
          <>
            <div className="absolute inset-0 bg-white/20 shimmer"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-pulse-slow"></div>
          </>
        )}
      </motion.div>
      {showText && (
        <motion.span 
          className={cn(
            "font-bold font-heading",
            textSizeClasses[size],
            animated ? "text-black" : "text-black"
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Zero Waste Mart
        </motion.span>
      )}
    </motion.div>
  );
};

export default Logo;
