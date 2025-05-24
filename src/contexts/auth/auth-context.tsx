import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '@/services/auth-service';
import { userService } from '@/services/user-service';
import { User } from '@/types';

interface AuthContextProps {
  currentUser: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await userService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const user = await authService.signIn(email, password);
      localStorage.setItem("zwm_user", JSON.stringify(user));
      setCurrentUser(user);
      console.log("User signed in successfully:", user);
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

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

  const signOut = async (): Promise<void> => {
    try {
      localStorage.removeItem("zwm_user");
      setCurrentUser(null);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

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

  const value: AuthContextProps = {
    currentUser,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
