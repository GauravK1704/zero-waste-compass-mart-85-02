
import { MessageCategory } from '@/types/chat';

class ContextDetectorService {
  private static instance: ContextDetectorService;

  private constructor() {}

  public static getInstance(): ContextDetectorService {
    if (!ContextDetectorService.instance) {
      ContextDetectorService.instance = new ContextDetectorService();
    }
    return ContextDetectorService.instance;
  }

  public detectMessageContext(message: string): MessageCategory {
    const lowerMessage = message.toLowerCase();
    
    // Order related keywords
    if (lowerMessage.includes('order') || lowerMessage.includes('track') || 
        lowerMessage.includes('delivery') || lowerMessage.includes('shipping')) {
      return 'order';
    }
    
    // Product related keywords
    if (lowerMessage.includes('product') || lowerMessage.includes('item') || 
        lowerMessage.includes('buy') || lowerMessage.includes('purchase') ||
        lowerMessage.includes('price') || lowerMessage.includes('available')) {
      return 'product';
    }
    
    // Sustainability keywords
    if (lowerMessage.includes('sustainable') || lowerMessage.includes('eco') || 
        lowerMessage.includes('environment') || lowerMessage.includes('green') ||
        lowerMessage.includes('waste') || lowerMessage.includes('carbon')) {
      return 'sustainability';
    }
    
    // Support keywords
    if (lowerMessage.includes('help') || lowerMessage.includes('support') || 
        lowerMessage.includes('problem') || lowerMessage.includes('issue') ||
        lowerMessage.includes('complaint') || lowerMessage.includes('refund')) {
      return 'support';
    }
    
    // Tracking keywords
    if (lowerMessage.includes('where') || lowerMessage.includes('status') ||
        lowerMessage.includes('tracking') || /\b[A-Z0-9-]{6,}\b/.test(message)) {
      return 'tracking';
    }
    
    // Account keywords
    if (lowerMessage.includes('account') || lowerMessage.includes('profile') ||
        lowerMessage.includes('login') || lowerMessage.includes('password')) {
      return 'account';
    }
    
    // Climate keywords
    if (lowerMessage.includes('climate') || lowerMessage.includes('warming') ||
        lowerMessage.includes('carbon footprint')) {
      return 'climate';
    }
    
    // Personal keywords
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') ||
        lowerMessage.includes('preference') || lowerMessage.includes('like')) {
      return 'personal';
    }
    
    // Invoice keywords
    if (lowerMessage.includes('invoice') || lowerMessage.includes('receipt') ||
        lowerMessage.includes('bill') || lowerMessage.includes('payment')) {
      return 'invoice';
    }
    
    return 'general';
  }
}

export const contextDetector = ContextDetectorService.getInstance();
