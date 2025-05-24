
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, Store } from 'lucide-react';
import { EmailFormValues } from '@/components/auth/schemas/emailLoginSchema';
import BuyerLoginSection from './BuyerLoginSection';
import SellerLoginSection from './SellerLoginSection';
import ReturnToHomeButton from './ReturnToHomeButton';

interface LoginFormProps {
  onAccountTypeChange?: (type: 'buyer' | 'seller') => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onAccountTypeChange }) => {
  const { login, googleLogin, phoneLogin, currentUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<'buyer' | 'seller'>('buyer');

  // Handle redirect when user logs in
  useEffect(() => {
    if (currentUser) {
      console.log("User detected in LoginForm:", currentUser);
      console.log("Selected account type during login:", accountType);
      
      // Use the account type that was selected during login to determine redirect
      if (accountType === 'seller') {
        console.log("Redirecting to seller dashboard");
        navigate('/seller/dashboard');
      } else {
        console.log("Redirecting to marketplace for buyer");
        navigate('/marketplace');
      }
    }
  }, [currentUser, accountType, navigate]);

  // Notify parent component when account type changes
  useEffect(() => {
    if (onAccountTypeChange) {
      onAccountTypeChange(accountType);
    }
  }, [accountType, onAccountTypeChange]);

  const onCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  const onSubmit = async (values: EmailFormValues) => {
    if (!captchaValue) {
      toast.error('Please verify that you are not a robot');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create user object based on the selected account type
      const mockUser = {
        id: "user123",
        email: values.email,
        displayName: "Demo User",
        photoURL: null,
        isAdmin: values.email.includes("admin"),
        isSeller: accountType === 'seller',
        role: accountType === 'seller' ? 'seller' as const : 'buyer' as const,
        businessName: accountType === 'seller' ? "Demo Business" : undefined,
        businessType: accountType === 'seller' ? "retailer" as const : undefined,
        trustScore: accountType === 'seller' ? 4.5 : undefined,
        verified: accountType === 'seller' ? true : false,
      };
      
      console.log("Creating user with account type:", accountType);
      console.log("Mock user created:", mockUser);
      
      // Store the user in localStorage with the correct account type
      localStorage.setItem("zwm_user", JSON.stringify(mockUser));
      
      await login(values.email, values.password);
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await googleLogin(accountType);
    } catch (error) {
      console.error('Google login error in UI:', error);
      toast.error('Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async (phoneNumber: string) => {
    try {
      setIsLoading(true);
      await phoneLogin(phoneNumber, accountType);
    } catch (error) {
      console.error('Phone login error:', error);
      toast.error('Phone login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Tabs 
        value={accountType} 
        onValueChange={(value) => {
          console.log("Switching account type to:", value);
          setAccountType(value as 'buyer' | 'seller');
          setCaptchaValue(null);
        }} 
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger 
            value="buyer" 
            className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
          >
            <ShoppingBag size={16} /> 
            <span className="text-base">
              Buyer
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="seller" 
            className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
          >
            <Store size={16} />
            <span className="text-base">
              Seller
            </span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="buyer" className="mt-4">
          <BuyerLoginSection 
            onSubmit={onSubmit}
            onGoogleLogin={handleGoogleLogin}
            handlePhoneLogin={handlePhoneLogin}
            isLoading={isLoading}
            captchaValue={captchaValue}
            onCaptchaChange={onCaptchaChange}
          />
        </TabsContent>
        
        <TabsContent value="seller" className="mt-4">
          <SellerLoginSection 
            onSubmit={onSubmit}
            onGoogleLogin={handleGoogleLogin}
            handlePhoneLogin={handlePhoneLogin}
            isLoading={isLoading}
            captchaValue={captchaValue}
            onCaptchaChange={onCaptchaChange}
          />
        </TabsContent>
      </Tabs>

      <ReturnToHomeButton />
    </>
  );
};

export default LoginForm;
