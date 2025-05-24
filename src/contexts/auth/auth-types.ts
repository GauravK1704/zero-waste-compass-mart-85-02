
import { User } from '@/types';

export interface AuthContextType {
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
