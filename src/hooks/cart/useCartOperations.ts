
import { useCallback } from 'react';
import { CartItem } from './types';
import { toast } from 'sonner';
import { addUserIdToCartItem } from './cartUtils';

export const useCartOperations = (
  cartItems: CartItem[],
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>,
  userId?: string
) => {
  const addToCart = useCallback((item: Omit<CartItem, 'userId'>) => {
    if (!userId) {
      toast.error("Please log in to add items to cart");
      return;
    }

    const cartItemWithUserId = addUserIdToCartItem(item, userId);
    
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        existingItem => existingItem.id === item.id && existingItem.userId === userId
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        toast.success(`Increased quantity of ${item.name}`);
        return updatedItems;
      } else {
        toast.success(`${item.name} added to cart`);
        return [...prevItems, cartItemWithUserId];
      }
    });
  }, [setCartItems, userId]);

  const removeFromCart = useCallback((id: string) => {
    setCartItems(prevItems => prevItems.filter(item => !(item.id === id && item.userId === userId)));
    toast.success("Item removed from cart");
  }, [setCartItems, userId]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.userId === userId
          ? { ...item, quantity }
          : item
      )
    );
  }, [setCartItems, removeFromCart, userId]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    toast.success("Cart cleared");
  }, [setCartItems]);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };
};
