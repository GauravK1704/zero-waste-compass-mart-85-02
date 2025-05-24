
import { CartItem } from './types';

const CART_STORAGE_KEY = 'zwm_cart_items';

export const loadCartFromLocalStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

export const saveCartToLocalStorage = (items: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Helper function to add user ID to cart items
export const addUserIdToCartItem = (item: Omit<CartItem, 'userId'>, userId: string): CartItem => {
  return {
    ...item,
    userId
  };
};

// Helper function to clear cart for a specific user
export const clearUserCartFromLocalStorage = (userId: string): void => {
  try {
    const allItems = loadCartFromLocalStorage();
    const otherUsersItems = allItems.filter(item => item.userId !== userId);
    saveCartToLocalStorage(otherUsersItems);
  } catch (error) {
    console.error('Error clearing user cart:', error);
  }
};

// Convert marketplace product to cart item format
export const convertMarketplaceProductToCartItem = (product: any): Omit<CartItem, 'userId'> => {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1,
    image: product.image,
    description: product.description || '',
    category: product.category,
    sellerId: product.sellerId,
    sellerName: product.seller,
    expiryDate: product.expiryDate
  };
};

// Mock cart items are no longer needed since we only show user-added items
export const generateMockCartItems = (userId: string): CartItem[] => {
  // Return empty array - no mock items, only user-added items
  return [];
};
