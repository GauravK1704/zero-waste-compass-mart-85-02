
import { User } from "@/types";
import { toast } from "sonner";

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    try {
      // Get the stored user to preserve the account type that was set during login
      const storedUser = localStorage.getItem("zwm_user");
      let mockUser;
      
      if (storedUser) {
        // Use the stored user data which has the correct account type
        mockUser = JSON.parse(storedUser);
        console.log("Using stored user data for login:", mockUser);
      } else {
        // Fallback mock user - this shouldn't happen if LoginForm works correctly
        mockUser = {
          id: "user123",
          email,
          displayName: "Demo User",
          photoURL: null,
          isAdmin: email.includes("admin"),
          isSeller: email.includes("seller"),
          role: email.includes("seller") ? "seller" : "buyer",
          businessName: email.includes("seller") ? "Demo Business" : undefined,
          businessType: email.includes("seller") ? "retailer" as const : undefined,
          trustScore: email.includes("seller") ? 4.5 : undefined,
          verified: email.includes("seller") ? true : false,
        };
      }
      
      // Always store the user again to ensure consistency
      localStorage.setItem("zwm_user", JSON.stringify(mockUser));
      return mockUser;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  signIn: async (email: string, password: string): Promise<User> => {
    return await authService.login(email, password);
  },

  signUp: async (data: any): Promise<User> => {
    try {
      const mockUser = {
        id: "user" + Math.random().toString(36).substring(2, 9),
        email: data.email,
        displayName: data.firstName + " " + data.lastName,
        photoURL: null,
        isAdmin: false,
        isSeller: data.businessName ? true : false,
        role: data.businessName ? "seller" : "buyer",
        businessName: data.businessName || undefined,
        businessType: data.businessType || undefined,
        trustScore: data.businessName ? 4.0 : undefined,
        verified: false,
      };
      
      localStorage.setItem("zwm_user", JSON.stringify(mockUser));
      return mockUser;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },

  googleLogin: async (accountType: 'buyer' | 'seller' = 'buyer'): Promise<User> => {
    try {
      console.log("Initiating Google login as", accountType);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = {
        id: "google_" + Math.random().toString(36).substring(2, 9),
        email: "demo.user@gmail.com",
        displayName: "Demo Google User",
        photoURL: "https://randomuser.me/api/portraits/lego/1.jpg",
        isAdmin: false,
        isSeller: accountType === 'seller',
        role: accountType,
        businessName: accountType === 'seller' ? "Demo Google Business" : undefined,
        businessType: accountType === 'seller' ? "retailer" as const : undefined,
        trustScore: accountType === 'seller' ? 4.2 : undefined,
        verified: true,
      };
      
      console.log("Google login successful:", mockUser);
      localStorage.setItem("zwm_user", JSON.stringify(mockUser));
      return mockUser;
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    }
  },

  phoneLogin: async (phoneNumber: string, accountType: 'buyer' | 'seller' = 'buyer'): Promise<{ verificationId: string }> => {
    try {
      console.log(`Sending OTP to ${phoneNumber} for ${accountType} account`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { 
        verificationId: "mock_verification_" + Math.random().toString(36).substring(2, 10)
      };
    } catch (error) {
      console.error("Phone login error:", error);
      throw error;
    }
  },

  verifyOtp: async (verificationId: string, otp: string): Promise<boolean> => {
    try {
      console.log(`Verifying OTP for verification ID: ${verificationId}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const isValid = otp.length === 6 && /^\d+$/.test(otp);
      return isValid;
    } catch (error) {
      console.error("OTP verification error:", error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      localStorage.removeItem("zwm_user");
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  resetPassword: async (email: string): Promise<void> => {
    try {
      console.log(`Password reset email sent to ${email}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  }
};
