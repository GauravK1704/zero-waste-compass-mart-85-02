
import { MessageCategory, Message } from '@/types/chat';

export interface ZeroBotResponse {
  answer: string;
  suggestions: string[];
  context?: MessageCategory;
  confidence?: number;
  metadata?: {
    sources?: string[];
    processingTime?: number;
    relatedTopics?: string[];
    sentiment?: 'positive' | 'neutral' | 'negative';
    language?: string;
    escalateToHuman?: boolean;
    complexity?: 'low' | 'medium' | 'high';
    keywords?: string[];
  }
}

export interface ZeroBotRequestOptions {
  category?: MessageCategory;
  userId?: string;
  previousMessages?: Message[];
  realtime?: boolean;
  maxTokens?: number;
  sellerMode?: boolean;
}
