
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import LoginForm from './LoginForm';
import Logo from '@/components/ui/logo';

const floatingElements = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const LoginCard: React.FC = () => {
  const [accountType, setAccountType] = useState<'buyer' | 'seller'>('buyer');
  
  // Listen for account type changes from the LoginForm
  const handleAccountTypeChange = (type: 'buyer' | 'seller') => {
    setAccountType(type);
  };
  
  // Dynamic styling based on account type
  const accentColor = accountType === 'buyer'
    ? 'from-zwm-primary to-zwm-secondary'
    : 'from-amber-500 to-orange-500';

  return (
    <motion.div 
      className="mx-auto w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo Section */}
      <motion.div 
        className="flex justify-center mb-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Link to="/">
          <Logo size="lg" animated={true} />
        </Link>
      </motion.div>
      
      {/* Decorative elements */}
      <motion.div 
        variants={floatingElements}
        initial="hidden"
        animate="show"
        className="absolute -z-10 inset-0 overflow-hidden pointer-events-none"
      >
        <motion.div 
          variants={item}
          className="absolute top-0 left-0 w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 blur-xl opacity-20"
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div 
          variants={item}
          className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 blur-xl opacity-20"
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
        />
        <motion.div 
          variants={item}
          className="absolute top-1/2 -right-16 w-24 h-24 rounded-full bg-gradient-to-r from-amber-300 to-orange-400 blur-xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </motion.div>
      
      {/* Card Container - matching signup design */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        whileHover={{ boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
        className="auth-card-float"
      >
        <div className="border-0 shadow-xl overflow-hidden bg-white rounded-xl">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 z-0"
            animate={{ 
              background: [
                "linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(99, 102, 241, 0.05))",
                "linear-gradient(to right, rgba(99, 102, 241, 0.05), rgba(59, 130, 246, 0.05))",
                "linear-gradient(to right, rgba(59, 130, 246, 0.05), rgba(99, 102, 241, 0.05))"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative z-10 px-6 py-8 md:p-10"
          >
            <CardHeader className="relative z-10 p-0 mb-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-center mb-2"
              >
                <CardTitle className="text-2xl font-bold mb-2 auth-gradient-text">
                  {accountType === 'buyer' ? 'Buyer Login' : 'Seller Login'}
                </CardTitle>
                <motion.div 
                  className={`h-1 w-12 bg-gradient-to-r ${accentColor} mx-auto rounded-full`}
                  animate={{
                    width: ["48px", "100px", "60px"],
                    opacity: [0.7, 1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                />
              </motion.div>
            </CardHeader>
            
            <CardContent className="relative z-10 auth-form-enter p-0">
              <LoginForm onAccountTypeChange={handleAccountTypeChange} />
            </CardContent>
            
            <CardFooter className="flex justify-center relative z-10 p-0 pt-6">
              <motion.p 
                className="text-sm text-gray-600"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className={`font-medium ${accountType === 'buyer' ? 'text-zwm-primary hover:text-zwm-secondary' : 'text-amber-600 hover:text-orange-500'} transition-colors duration-200 hover:underline`}
                >
                  Sign up
                </Link>
              </motion.p>
            </CardFooter>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        className="mt-4 text-center text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        By signing in, you agree to our{' '}
        <Link to="#" className="text-zwm-primary hover:text-zwm-secondary transition-colors duration-200">Terms of Service</Link>{' '}
        and{' '}
        <Link to="#" className="text-zwm-primary hover:text-zwm-secondary transition-colors duration-200">Privacy Policy</Link>
      </motion.div>
    </motion.div>
  );
};

export default LoginCard;
