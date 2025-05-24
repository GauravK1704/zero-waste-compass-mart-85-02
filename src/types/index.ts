export interface User {
  id: string;
  firstName: string;
  lastName: string;
  name?: string; // Added for compatibility
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  address?: string;
  city?: string;
  country?: string;
  phoneNumber?: string;
  profilePicture?: string;
  gstin?: string;
  businessAddress?: string;
  businessName?: string;
  businessType?: string;
  createdAt: Date;
  updatedAt: Date;
  // AI Trust Score fields
  trustScore?: number;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  documentsVerified?: string[];
  aiVerificationHistory?: {
    documentType: string;
    verifiedAt: Date;
    confidence: number;
    status: 'verified' | 'rejected';
    documentNumber?: string;
    securityFeatures?: string[];
  }[];
  verified?: boolean;
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

export type ItemCategory = 'electronics' | 'clothing' | 'books' | 'home' | 'food' | 'health' | 'sports' | 'toys' | 'automotive' | 'garden' | 'beauty' | 'music' | 'office' | 'pet' | 'baby' | 'jewelry' | 'fitness' | 'stationery';

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

// AI-Powered Notification Types
export interface AINotification {
  id: string;
  type: 'expiry_alert' | 'stock_low' | 'price_change' | 'quality_issue' | 'compliance_alert' | 'document_verification' | 'trust_score_update';
  title: string;
  message: string;
  aiConfidence: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  suggestedActions?: string[];
  relatedProductId?: string;
  relatedDocumentId?: string;
  expiryDate?: string;
  daysUntilExpiry?: number;
  predictedImpact?: string;
  trustScoreChange?: number;
  documentType?: string;
  verificationStatus?: 'pending' | 'verified' | 'failed';
  createdAt: Date;
  read: boolean;
}
