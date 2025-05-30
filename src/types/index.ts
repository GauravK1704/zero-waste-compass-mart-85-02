export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  isSeller: boolean;
  isAdmin: boolean;
  role: 'user' | 'seller' | 'admin';
  language: string;
  gstin: string;
  businessAddress: string;
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
      marketingEmails: boolean;
    };
    language: string;
    theme: string;
  };
}

export interface Message {
  id: number | string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  category: MessageCategory;
  metadata?: any;
}

export type MessageCategory = 
  | 'general' 
  | 'product' 
  | 'order' 
  | 'tracking' 
  | 'sustainability' 
  | 'climate' 
  | 'personal' 
  | 'invoice'
  | 'support'
  | 'account';

export type TabType = 'chat' | 'help' | 'analytics';

export interface ZeroBotResponse {
  answer: string;
  context: MessageCategory;
  confidence: number;
  suggestions: string[];
  metadata: {
    processingTime: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    language: string;
    escalateToHuman?: boolean;
    complexity: 'simple' | 'medium' | 'complex';
    keywords: string[];
    relatedTopics: string[];
    emotion?: 'frustrated' | 'happy' | 'confused' | 'angry' | 'neutral';
    requiresFollowUp?: boolean;
  };
}

export interface ConversationContext {
  userId: string;
  sessionId: string;
  history: Message[];
  currentIntent: string;
  userProfile?: {
    name?: string;
    preferences?: any;
    mood?: string;
    previousQueries?: string[];
  };
  formData?: Record<string, any>;
  stepInProgress?: string;
}

export interface KnowledgeBaseEntry {
  id: string;
  title: string;
  content: string;
  category: MessageCategory;
  keywords: string[];
  language: string;
}

export interface OrderTracking {
  orderId: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  location?: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  lastUpdate: Date;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  tags: string[];
  variants: Variant[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface Variant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  options: Record<string, string>;
}
