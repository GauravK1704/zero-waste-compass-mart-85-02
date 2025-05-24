
import React, { createContext, useState, useEffect } from 'react';
import { authService } from '@/services/auth-service';
import { userService } from '@/services/user-service';
import { User } from '@/types';

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  googleLogin: (accountType?: 'buyer' | 'seller') => Promise<void>;
  phoneLogin: (phoneNumber: string, accountType?: 'buyer' | 'seller') => Promise<{ verificationId: string }>;
  verifyOtp: (verificationId: string, otp: string) => Promise<boolean>;
  setupTwoFactor: () => Promise<void>;
  verifyTwoFactor: (code: string) => Promise<boolean>;
  disableTwoFactor: () => Promise<void>;
  isTwoFactorEnabled: boolean;
  user?: User | null; // Additional alias for compatibility
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await userService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const user = await authService.login(email, password);
      localStorage.setItem("zwm_user", JSON.stringify(user));
      setCurrentUser(user);
      console.log("User signed in successfully:", user);
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signIn = login; // Alias for compatibility

  const signUp = async (data: any): Promise<void> => {
    try {
      const user = await authService.signUp(data);
      localStorage.setItem("zwm_user", JSON.stringify(user));
      setCurrentUser(user);
      console.log("User signed up successfully:", user);
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const register = signUp; // Alias for compatibility

  const signOut = async (): Promise<void> => {
    try {
      await authService.logout();
      localStorage.removeItem("zwm_user");
      setCurrentUser(null);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const logout = signOut; // Alias for compatibility

  const updateUser = async (data: Partial<User>): Promise<void> => {
    try {
      const updatedUser = await userService.updateProfile(data);
      if (updatedUser) {
        setCurrentUser(updatedUser);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const updateProfile = updateUser; // Alias for compatibility

  const googleLogin = async (accountType: 'buyer' | 'seller' = 'buyer'): Promise<void> => {
    try {
      const user = await authService.googleLogin(accountType);
      localStorage.setItem("zwm_user", JSON.stringify(user));
      setCurrentUser(user);
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const phoneLogin = async (phoneNumber: string, accountType: 'buyer' | 'seller' = 'buyer'): Promise<{ verificationId: string }> => {
    try {
      return await authService.phoneLogin(phoneNumber, accountType);
    } catch (error) {
      console.error("Phone login error:", error);
      throw error;
    }
  };

  const verifyOtp = async (verificationId: string, otp: string): Promise<boolean> => {
    try {
      return await authService.verifyOtp(verificationId, otp);
    } catch (error) {
      console.error("OTP verification error:", error);
      throw error;
    }
  };

  // Mock two-factor authentication methods
  const setupTwoFactor = async (): Promise<void> => {
    // Mock implementation
    setIsTwoFactorEnabled(true);
  };

  const verifyTwoFactor = async (code: string): Promise<boolean> => {
    // Mock implementation
    return code.length === 6;
  };

  const disableTwoFactor = async (): Promise<void> => {
    // Mock implementation
    setIsTwoFactorEnabled(false);
  };

  const value: AuthContextProps = {
    currentUser,
    loading,
    isLoading: loading,
    login,
    signIn,
    signUp,
    register,
    signOut,
    logout,
    updateUser,
    updateProfile,
    googleLogin,
    phoneLogin,
    verifyOtp,
    setupTwoFactor,
    verifyTwoFactor,
    disableTwoFactor,
    isTwoFactorEnabled,
    user: currentUser, // Additional alias for compatibility
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
