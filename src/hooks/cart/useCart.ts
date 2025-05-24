import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import { CartItem, CartHookReturn } from './types';
import { loadCartFromLocalStorage, saveCartToLocalStorage, generateMockCartItems } from './cartUtils';
import { useCartOperations } from './useCartOperations';

/**
 * Main hook for cart functionality
 * Handles state management and connects with cart operations
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

  // Custom implementation of fetchCartItems
  const fetchCartItems = async () => {
    if (!currentUser) {
      // Load from localStorage if not logged in
      setCartItems(loadCartFromLocalStorage());
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // For authenticated users, try to load from localStorage first
      const localCartItems = loadCartFromLocalStorage();
      if (localCartItems.length > 0) {
        setCartItems(localCartItems);
      } else {
        // Mock cart items for demo
        const mockCartItems = generateMockCartItems(currentUser.id);
        setCartItems(mockCartItems);
      }
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
    if (!loading) {
      saveCartToLocalStorage(cartItems);
    }
  }, [cartItems, loading]);

  return {
    cartItems,
    loading,
    isLoading: loading,
    ...cartOperations,
    refresh: fetchCartItems
  };
};

export default useCart;
