
import { User } from "@/types";

export const userService = {
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const storedUser = localStorage.getItem("zwm_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },

  updateProfile: async (data: Partial<User>): Promise<User | null> => {
    try {
      const currentUser = await userService.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...data };
        localStorage.setItem("zwm_user", JSON.stringify(updatedUser));
        return updatedUser;
      }
      return null;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }
};
