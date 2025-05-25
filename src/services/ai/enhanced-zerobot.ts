
import { MessageCategory, Message } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EnhancedZeroBotResponse {
  answer: string;
  suggestions: string[];
  context: MessageCategory;
  confidence: number;
  metadata: {
    processingTime: number;
    sources: string[];
    relatedTopics: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
  };
}

interface ZeroBotMemory {
  userId: string;
  conversationHistory: Message[];
  userPreferences: Record<string, any>;
  contextStack: MessageCategory[];
}

class EnhancedZeroBotService {
  private static instance: EnhancedZeroBotService;
  private memory: Map<string, ZeroBotMemory> = new Map();
  private isProcessing: boolean = false;

  private constructor() {}

  public static getInstance(): EnhancedZeroBotService {
    if (!EnhancedZeroBotService.instance) {
      EnhancedZeroBotService.instance = new EnhancedZeroBotService();
    }
    return EnhancedZeroBotService.instance;
  }

  // Enhanced context detection with machine learning-like behavior
  public detectAdvancedContext(message: string, history: Message[]): MessageCategory {
    const lowerMessage = message.toLowerCase();
    
    // Analyze conversation history for better context
    const recentContext = history.slice(-3).map(m => m.category).filter(Boolean);
    
    // Advanced keyword matching with weights
    const contextScores: Record<MessageCategory, number> = {
      'general': 0,
      'product': 0,
      'order': 0,
      'support': 0,
      'account': 0
    };

    // Product-related keywords
    if (/(product|item|buy|purchase|sell|price|discount|quality|review)/i.test(message)) {
      contextScores.product += 3;
    }

    // Order-related keywords
    if (/(order|delivery|shipping|track|status|payment|invoice)/i.test(message)) {
      contextScores.order += 3;
    }

    // Support-related keywords
    if (/(help|problem|issue|error|bug|complaint|refund|return)/i.test(message)) {
      contextScores.support += 3;
    }

    // Account-related keywords
    if (/(account|profile|settings|password|email|personal|update)/i.test(message)) {
      contextScores.account += 3;
    }

    // Boost score based on recent context
    if (recentContext.length > 0) {
      const mostRecentContext = recentContext[recentContext.length - 1];
      if (mostRecentContext && contextScores[mostRecentContext] !== undefined) {
        contextScores[mostRecentContext] += 2;
      }
    }

    // Find highest scoring context
    const bestContext = Object.entries(contextScores).reduce((a, b) => 
      contextScores[a[0] as MessageCategory] > contextScores[b[0] as MessageCategory] ? a : b
    )[0] as MessageCategory;

    return bestContext !== 'general' ? bestContext : 'general';
  }

  // Advanced response generation with context awareness
  public async generateEnhancedResponse(
    message: string, 
    userId: string,
    context: MessageCategory
  ): Promise<EnhancedZeroBotResponse> {
    const startTime = Date.now();
    
    try {
      // Get or create user memory
      let userMemory = this.memory.get(userId);
      if (!userMemory) {
        userMemory = {
          userId,
          conversationHistory: [],
          userPreferences: {},
          contextStack: []
        };
        this.memory.set(userId, userMemory);
      }

      // Store current message in memory
      const userMessage: Message = {
        id: Date.now().toString(),
        content: message,
        sender: 'user',
        timestamp: new Date(),
        category: context
      };
      userMemory.conversationHistory.push(userMessage);

      // Generate contextual response
      const response = this.generateContextualResponse(message, context, userMemory);
      
      // Generate suggestions based on context and history
      const suggestions = this.generateSmartSuggestions(context, userMemory);
      
      // Analyze sentiment
      const sentiment = this.analyzeSentiment(message);
      
      // Store bot response in memory
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date(),
        category: context
      };
      userMemory.conversationHistory.push(botMessage);

      // Update context stack
      userMemory.contextStack.push(context);
      if (userMemory.contextStack.length > 5) {
        userMemory.contextStack.shift();
      }

      const processingTime = Date.now() - startTime;

      return {
        answer: response,
        suggestions,
        context,
        confidence: 0.85 + Math.random() * 0.1, // Simulate realistic confidence
        metadata: {
          processingTime,
          sources: this.getRelevantSources(context),
          relatedTopics: this.getRelatedTopics(context),
          sentiment
        }
      };

    } catch (error) {
      console.error('Enhanced ZeroBot error:', error);
      throw new Error('Failed to process your request');
    }
  }

  private generateContextualResponse(
    message: string, 
    context: MessageCategory, 
    memory: ZeroBotMemory
  ): string {
    const lowerMessage = message.toLowerCase();
    const userName = memory.userPreferences.name || 'there';

    // Personalized responses based on context
    switch (context) {
      case 'product':
        if (lowerMessage.includes('recommend')) {
          return `Hi ${userName}! Based on your preferences, I'd recommend checking out our eco-friendly products. What type of item are you looking for specifically?`;
        }
        if (lowerMessage.includes('price')) {
          return `I can help you find the best prices! Our marketplace offers competitive pricing with regular discounts. Would you like me to show you current deals?`;
        }
        return `I'm here to help you find the perfect products! What are you looking to buy or sell today?`;

      case 'order':
        if (lowerMessage.includes('track')) {
          return `I can help you track your order! Please go to your Dashboard > My Orders to see real-time tracking information. Need help finding a specific order?`;
        }
        if (lowerMessage.includes('cancel')) {
          return `I understand you want to cancel an order. You can cancel orders that haven't shipped yet from your order history. Would you like me to guide you through the process?`;
        }
        return `I'm here to help with your orders! Whether it's tracking, cancellation, or delivery questions, I've got you covered.`;

      case 'support':
        return `I'm sorry you're experiencing an issue. I'm here to help! Can you describe the problem in more detail so I can provide the best solution?`;

      case 'account':
        return `I can help you manage your account settings. What would you like to update - your profile, preferences, or security settings?`;

      default:
        // Check for greetings
        if (/(hi|hello|hey|good morning|good afternoon|good evening)/i.test(message)) {
          return `Hello ${userName}! 👋 Welcome to Zero Waste Mart! I'm your AI assistant, ready to help you with anything - from finding products to managing orders. What can I do for you today?`;
        }
        
        // Check for farewells
        if (/(bye|goodbye|see you|thanks|thank you)/i.test(message)) {
          return `You're welcome, ${userName}! Thanks for using Zero Waste Mart. Feel free to ask me anything anytime. Have a great day! 🌱`;
        }

        return `I'm your Zero Waste Mart AI assistant! I can help you with products, orders, account management, and more. What would you like to know?`;
    }
  }

  private generateSmartSuggestions(context: MessageCategory, memory: ZeroBotMemory): string[] {
    const baseContextSuggestions: Record<MessageCategory, string[]> = {
      'general': [
        'Show me today\'s featured products',
        'How does Zero Waste Mart work?',
        'What are your sustainability goals?'
      ],
      'product': [
        'Show me eco-friendly alternatives',
        'What\'s on sale today?',
        'Find products near me'
      ],
      'order': [
        'Track my recent order',
        'View order history',
        'Delivery options available'
      ],
      'support': [
        'Contact customer service',
        'Report a problem',
        'Return/refund policy'
      ],
      'account': [
        'Update my profile',
        'Change password',
        'Notification preferences'
      ]
    };

    // Personalize suggestions based on conversation history
    const suggestions = [...baseContextSuggestions[context]];
    
    // Add contextual suggestions based on recent interactions
    if (memory.contextStack.includes('product') && context !== 'product') {
      suggestions.push('Continue shopping');
    }
    
    if (memory.contextStack.includes('order') && context !== 'order') {
      suggestions.push('Check order status');
    }

    return suggestions;
  }

  private analyzeSentiment(message: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'perfect', 'awesome', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'worst', 'disappointed', 'frustrated'];
    
    const lowerMessage = message.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private getRelevantSources(context: MessageCategory): string[] {
    const sources: Record<MessageCategory, string[]> = {
      'general': ['Zero Waste Mart Help Center', 'User Guide'],
      'product': ['Product Catalog', 'Seller Guidelines', 'Eco Standards'],
      'order': ['Order Management System', 'Shipping Partners', 'Payment Gateway'],
      'support': ['Customer Support Database', 'FAQ'],
      'account': ['User Account System', 'Privacy Policy']
    };
    
    return sources[context] || ['Knowledge Base'];
  }

  private getRelatedTopics(context: MessageCategory): string[] {
    const topics: Record<MessageCategory, string[]> = {
      'general': ['Getting Started', 'Sustainability', 'Community'],
      'product': ['Categories', 'Pricing', 'Reviews', 'Shipping'],
      'order': ['Tracking', 'Payment', 'Delivery', 'Returns'],
      'support': ['Troubleshooting', 'Contact Us', 'Feedback'],
      'account': ['Security', 'Preferences', 'History']
    };
    
    return topics[context] || ['Help'];
  }

  // Streaming response for real-time chat experience
  public async streamResponse(
    message: string,
    userId: string,
    onChunk: (chunk: string) => void,
    onComplete: (response: EnhancedZeroBotResponse) => void
  ): Promise<void> {
    try {
      // Simulate real-time processing
      onChunk('🤔 Processing your request');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onChunk('...\n\n');
      await new Promise(resolve => setTimeout(resolve, 300));

      const context = this.detectAdvancedContext(message, []);
      const response = await this.generateEnhancedResponse(message, userId, context);
      
      // Stream the response word by word
      const words = response.answer.split(' ');
      for (const word of words) {
        onChunk(word + ' ');
        await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 30));
      }
      
      onComplete(response);
    } catch (error) {
      onChunk('\n\nI apologize, but I encountered an error. Please try again.');
      console.error('Streaming error:', error);
    }
  }

  // Save conversation to Supabase for persistence
  public async saveConversation(userId: string): Promise<void> {
    const memory = this.memory.get(userId);
    if (!memory || !supabase) return;

    try {
      await supabase.from('ai_conversations').upsert({
        user_id: userId,
        conversation_data: {
          history: memory.conversationHistory,
          preferences: memory.userPreferences,
          contextStack: memory.contextStack
        },
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  }
}

export const EnhancedZeroBot = EnhancedZeroBotService.getInstance();
