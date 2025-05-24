
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import { CartItem, CartHookReturn } from './types';
import { loadCartFromLocalStorage, saveCartToLocalStorage } from './cartUtils';
import { useCartOperations } from './useCartOperations';

/**
 * Main hook for cart functionality
 * Handles state management and connects with cart operations
 * Only shows items for the current logged-in user
 */
export const useCart = (): CartHookReturn => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Connect to cart operations
  const cartOperations = useCartOperations(
    cartItems, 
    setCartItems, 
    currentUser?.id
  );

  // Load user-specific cart items
  const fetchCartItems = async () => {
    if (!currentUser) {
      // Clear cart if no user is logged in
      setCartItems([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Load cart items from localStorage for the specific user
      const localCartItems = loadCartFromLocalStorage();
      
      // Filter items to only show those belonging to the current user
      const userCartItems = localCartItems.filter(item => item.userId === currentUser.id);
      
      console.log(`Loading cart for user ${currentUser.id}:`, userCartItems);
      setCartItems(userCartItems);
      
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast.error("Failed to load your cart");
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart items on mount or user change
  useEffect(() => {
    fetchCartItems();
  }, [currentUser]);

  // Update localStorage whenever cart changes
  useEffect(() => {
    if (!loading && currentUser) {
      // Save all cart items (including other users') but ensure current user's items are included
      const allCartItems = loadCartFromLocalStorage();
      const otherUsersItems = allCartItems.filter(item => item.userId !== currentUser.id);
      const updatedCartItems = [...otherUsersItems, ...cartItems];
      saveCartToLocalStorage(updatedCartItems);
    }
  }, [cartItems, loading, currentUser]);

  return {
    cartItems,
    loading,
    isLoading: loading,
    ...cartOperations,
    refresh: fetchCartItems
  };
};

export default useCart;
