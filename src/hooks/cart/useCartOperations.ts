import { useState } from 'react';
import { toast } from 'sonner';
import { CartItem, CartOperations } from './types';
import { 
  findCartItemByProductId,
  createMockCartProduct,
  convertMarketplaceProductToCartItem
} from './cartUtils';

/**
 * Custom hook that provides cart operations without state management
 * This allows for separation between state and operations
 */
export const useCartOperations = (
  cartItems: CartItem[],
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>,
  currentUserId?: string
): CartOperations => {
  
  // Add item to cart (either by item object or by product ID)
  const addToCart = async (item: CartItem | string, quantity: number = 1) => {
    try {
      console.log("addToCart called with:", item, "quantity:", quantity);
      
      if (typeof item === 'string') {
        // Handle as product ID
        const productId = item;
        
        // Check if item is already in cart
        const existingItem = findCartItemByProductId(cartItems, productId);
        
        if (existingItem) {
          // Update quantity
          const newQuantity = existingItem.quantity + quantity;
          
          // Update cart items
          const updatedItems = cartItems.map(cartItem => 
            cartItem.product_id === productId ? { ...cartItem, quantity: newQuantity } : cartItem
          );
          setCartItems(updatedItems);
          
          toast.success("Cart updated successfully");
        } else {
          // Add new item with mock data
          const mockProduct = createMockCartProduct(productId, currentUserId);
          mockProduct.quantity = quantity;
          
          setCartItems(prev => [...prev, mockProduct]);
          toast.success("Item added to cart");
        }
      } else {
        // Handle as CartItem object
        const cartItem = { ...item };
        
        console.log("Processing cart item:", cartItem);
        
        // Check if item already in cart by product_id
        const existingItemIndex = cartItems.findIndex(i => 
          i.product_id === cartItem.product_id || i.id === cartItem.id
        );
        
        if (existingItemIndex >= 0) {
          // Update existing item
          const updatedItems = [...cartItems];
          updatedItems[existingItemIndex].quantity += cartItem.quantity;
          setCartItems(updatedItems);
          toast.success("Item quantity updated in cart");
        } else {
          // Add new item with a unique ID if not present
          const newItem = {
            ...cartItem,
            id: cartItem.id || `cart-item-${Date.now()}`,
            user_id: currentUserId
          };
          
          console.log("Adding new item to cart:", newItem);
          setCartItems(prev => {
            const newCart = [...prev, newItem];
            console.log("New cart state:", newCart);
            return newCart;
          });
          toast.success("Item added to cart");
        }
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: string) => {
    try {
      // Remove item
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedItems);
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item from cart");
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      return removeFromCart(itemId);
    }
    
    try {
      // Update quantity
      const updatedItems = cartItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      );
      setCartItems(updatedItems);
      toast.success("Cart updated");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update cart");
    }
  };

  // Clear all items from cart
  const clearCart = async () => {
    try {
      // Clear cart
      setCartItems([]);
      toast.success("Cart cleared");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  };
  
  // Calculate total items in cart
  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };
  
  // Calculate total price of items in cart
  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  // Placeholder for the refresh function
  // This would normally be implemented for fetching cart items from a database
  const refresh = async () => {
    // In real implementation, this would fetch cart items from a database
    console.log("Cart refresh called");
  };

  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal,
    refresh
  };
};
