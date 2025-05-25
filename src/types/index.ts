
export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role?: 'buyer' | 'seller' | 'admin';
  language?: string;
  gstin?: string;
  businessAddress?: string;
}

export interface AINotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export interface Task {
  id: string;
  name: string;
  task_type: string;
  schedule: string;
  enabled: boolean;
  parameters: Record<string, any>;
  created_at: string;
  updated_at: string;
  last_run: string;
  next_run: string;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export type ItemCategory = 
  | 'food' 
  | 'electronics' 
  | 'clothing' 
  | 'books' 
  | 'furniture' 
  | 'sports' 
  | 'beauty' 
  | 'toys' 
  | 'automotive' 
  | 'home' 
  | 'garden' 
  | 'health' 
  | 'pets' 
  | 'office' 
  | 'craft' 
  | 'music' 
  | 'fitness' 
  | 'stationery';

export interface VerifiedDocument {
  type: string;
  status: 'verified' | 'pending' | 'rejected';
  uploadedAt: Date;
}

export type MessageCategory = 'general' | 'product' | 'order' | 'account' | 'support';
