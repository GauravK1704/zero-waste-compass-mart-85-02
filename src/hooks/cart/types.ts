
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description?: string;
  category?: string;
  sellerId?: string;
  sellerName?: string;
  expiryDate?: string;
  userId: string; // Add userId to track which user added the item
}

export interface CartHookReturn {
  cartItems: CartItem[];
  loading: boolean;
  isLoading: boolean;
  addToCart: (item: Omit<CartItem, 'userId'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  refresh: () => void;
}
