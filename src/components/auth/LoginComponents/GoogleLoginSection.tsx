
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'sonner';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleLoginSectionProps {
  handleGoogleLogin: () => Promise<void>;
  isLoading: boolean;
  accountType: 'buyer' | 'seller';
  setCaptchaValue?: (value: string | null) => void;
  captchaValue?: string | null;
  showCaptcha?: boolean;
}

const GoogleLoginSection: React.FC<GoogleLoginSectionProps> = ({
  handleGoogleLogin,
  isLoading,
  accountType,
  setCaptchaValue,
  captchaValue,
  showCaptcha = false
}) => {
  const [error, setError] = useState<string | null>(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(() => {
    // Load Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGoogleLoaded(true);
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '970728985649-demo12345678901234567890.apps.googleusercontent.com', // Demo client ID for development
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          ux_mode: 'popup',
          context: 'signin',
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      setError(null);
      console.log('Google credential response:', response);
      
      // For demo purposes, we'll simulate a successful login
      const mockPayload = {
        name: "Demo User",
        email: "demo@example.com",
        picture: "https://randomuser.me/api/portraits/lego/1.jpg"
      };
      
      console.log('User info:', mockPayload);
      toast.success(`Welcome ${mockPayload.name}!`);
      
      // Call the parent's Google login handler
      await handleGoogleLogin();
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError('Failed to sign in with Google');
      toast.error('Failed to sign in with Google');
    }
  };

  const handleClick = async () => {
    try {
      setError(null);
      
      if (!googleLoaded || !window.google) {
        toast.error('Google Sign-In is still loading. Please try again.');
        return;
      }

      // For demo purposes, simulate Google login without actual OAuth
      console.log('Simulating Google login for demo...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPayload = {
        name: "Demo User",
        email: "demo@example.com",
        picture: "https://randomuser.me/api/portraits/lego/1.jpg"
      };
      
      toast.success(`Welcome ${mockPayload.name}!`);
      await handleGoogleLogin();
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err?.message || "Failed to sign in with Google");
      toast.error(err?.message || "Failed to sign in with Google");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-medium mb-2">Sign in with Google</h3>
        <p className="text-sm text-gray-600">
          {accountType === 'buyer' 
            ? 'Use your Google account to sign in quickly and securely.' 
            : 'Use your Google Business account to sign in as a seller.'}
        </p>
      </div>
      
      {/* Captcha verification for registration */}
      {showCaptcha && setCaptchaValue && (
        <div className="mb-4 w-full">
          <div className="flex justify-center mb-2">
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Google's test key
              onChange={(value) => setCaptchaValue(value)}
            />
          </div>
          
          {captchaValue === null && (
            <div className="text-center text-sm text-orange-600">
              Please verify that you're not a robot
            </div>
          )}
        </div>
      )}
      
      {error && (
        <div className="mb-4 text-sm text-red-600 text-center">
          {error}
        </div>
      )}
      
      {/* Single Google Sign-In Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        disabled={isLoading || (showCaptcha && !captchaValue) || !googleLoaded}
        className="flex items-center justify-center gap-3 w-full bg-white border border-gray-300 rounded-lg py-3 px-4 font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={`Sign in with Google as ${accountType}`}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        {isLoading ? 'Signing in...' : googleLoaded ? 'Continue with Google' : 'Loading Google...'}
      </motion.button>
      
      <div className="mt-2 text-xs text-center text-gray-500">
        {!googleLoaded && 'Loading Google Sign-In...'}
        {googleLoaded && 'Demo mode - Click to simulate Google login'}
      </div>
    </div>
  );
};

export default GoogleLoginSection;
