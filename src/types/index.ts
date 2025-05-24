
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  address?: string;
  city?: string;
  country?: string;
  phoneNumber?: string;
  profilePicture?: string;
  gstin?: string;
  businessAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  shippingAddress: string;
  orderDate: Date;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled';

export type ItemCategory = 'electronics' | 'clothing' | 'books' | 'home' | 'food' | 'health' | 'sports' | 'toys' | 'automotive' | 'garden' | 'beauty' | 'music' | 'office' | 'pet' | 'baby' | 'jewelry';

export interface CountryCodeOption {
  name: string;
  code: string;
  dialCode: string;
}

export interface Task {
  id: string;
  name: string;
  task_type: string;
  schedule: string;
  enabled: boolean;
  last_run: string;
  next_run: string;
  parameters: Record<string, any>;
  created_at: string;
  updated_at: string;
}
