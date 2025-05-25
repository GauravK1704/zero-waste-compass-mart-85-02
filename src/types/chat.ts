
export type MessageCategory = 
  | 'general' 
  | 'tracking' 
  | 'invoice' 
  | 'order' 
  | 'product' 
  | 'sustainability' 
  | 'climate' 
  | 'personal'
  | 'support'
  | 'account';

export type MessageSender = 'user' | 'bot' | 'system';

export type Message = {
  id: number | string;
  content: string;
  sender: MessageSender;
  timestamp: Date;
  // Enhanced fields
  category?: MessageCategory;
  isMarkdown?: boolean;
  attachments?: string[];
  referencedLinks?: string[];
  isHighlighted?: boolean;
  confidence?: number; // For AI confidence scoring
  sentiment?: 'positive' | 'neutral' | 'negative'; // For sentiment analysis
  metadata?: {
    processingTime?: number;
    sources?: string[];
    isRealtime?: boolean;
    isTyping?: boolean;
    streamId?: string;
  };
  reaction?: 'like' | 'dislike';
};

export interface ChatOptions {
  enableRealtime?: boolean;
  enableVoice?: boolean;
  showTimestamps?: boolean;
  enableMarkdown?: boolean;
  persistHistory?: boolean;
  maxHistoryItems?: number;
}

export interface ChatAnalytics {
  totalInteractions: number;
  averageResponseTime: number;
  topCategories: Record<MessageCategory, number>;
  userSatisfactionScore?: number;
  lastInteractionDate?: Date;
}

export interface BotPersona {
  name: string;
  avatarUrl?: string;
  role: string;
  description: string;
  tone: 'formal' | 'friendly' | 'professional' | 'casual';
}

export interface RealtimeResponse {
  streamId: string;
  content: string;
  isComplete: boolean;
  timestamp: Date;
}
