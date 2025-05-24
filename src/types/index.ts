
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  isAdmin?: boolean;
  isSeller?: boolean;
  businessName?: string;
  businessType?: 'retailer' | 'wholesaler' | 'distributor';
  trustScore?: number;
  verified?: boolean;
  gstin?: string;
  businessAddress?: string;
  role?: 'admin' | 'seller' | 'buyer';
  language?: 'english' | 'hindi' | 'tamil' | 'telugu' | 'kannada';
  notificationPreferences?: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketingEmails?: boolean;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

export interface AINotification extends Notification {
  aiGenerated: boolean;
  category: 'expiry' | 'inventory' | 'pricing' | 'general';
}

export interface Task {
  id: string;
  name: string;
  schedule: string;
  task_type: string;
  enabled: boolean;
  parameters: Record<string, any>;
  created_at: string;
  updated_at: string;
  last_run: string;
  next_run: string;
}

export interface VerifiedDocument {
  id: string;
  type: string;
  status: 'verified' | 'pending' | 'rejected';
  uploadDate: string;
}

export interface CountryCodeOption {
  value: string;
  label: string;
  name: string;
  code: string;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type ItemCategory = 'electronics' | 'clothing' | 'books' | 'home' | 'sports' | 'food' | 'health' | 'fitness' | 'stationery';
