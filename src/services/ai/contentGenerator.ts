
import { MessageCategory } from '@/types/chat';

class ContentGeneratorService {
  private static instance: ContentGeneratorService;

  private constructor() {}

  public static getInstance(): ContentGeneratorService {
    if (!ContentGeneratorService.instance) {
      ContentGeneratorService.instance = new ContentGeneratorService();
    }
    return ContentGeneratorService.instance;
  }

  public generateContextualResponse(message: string, context: MessageCategory): string {
    const lowerMessage = message.toLowerCase();

    switch (context) {
      case 'order':
        if (lowerMessage.includes('track')) {
          return "I can help you track your order! Please provide your order ID or tracking number, and I'll get you the latest status update. 📦";
        }
        return "I'm here to help with your order! Whether you need to track, modify, or get information about your purchase, I've got you covered.";

      case 'product':
        return "Great! I'd be happy to help you find the perfect sustainable products. What type of eco-friendly items are you looking for today? 🌱";

      case 'sustainability':
        return "Wonderful! I love helping people make more sustainable choices. Whether you're starting your zero-waste journey or looking to expand your eco-friendly practices, I'm here to guide you! 🌍";

      case 'support':
        if (lowerMessage.includes('problem') || lowerMessage.includes('issue')) {
          return "I'm sorry to hear you're experiencing an issue. I'm here to help resolve this for you. Can you tell me more about what's happening? 🤝";
        }
        return "I'm here to provide support! How can I assist you today?";

      default:
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
          return "Hello! 👋 Welcome to Zero Waste Mart! I'm your AI assistant, ready to help you discover sustainable products, track orders, or answer any questions you might have. What can I do for you today?";
        }
        return "I'm your Zero Waste Mart AI assistant! I can help with product recommendations, order tracking, sustainability tips, and much more. What would you like to know? 😊";
    }
  }

  public generateContextualSuggestions(context: MessageCategory): string[] {
    const suggestions: Record<MessageCategory, string[]> = {
      'general': [
        'Show me featured eco-friendly products',
        'How can I start living zero waste?',
        'Track my recent order'
      ],
      'product': [
        'Show me sustainable alternatives',
        'What\'s popular this week?',
        'Find products under $50'
      ],
      'order': [
        'Check my order status',
        'Modify my delivery address',
        'Return or exchange item'
      ],
      'sustainability': [
        'Tips for reducing plastic waste',
        'Best eco-friendly swaps',
        'Learn about carbon footprint'
      ],
      'support': [
        'Contact customer service',
        'Report a problem',
        'Get help with my account'
      ],
      'tracking': [
        'Track by order number',
        'Delivery time estimates',
        'Change delivery preferences'
      ],
      'invoice': [
        'Download receipt',
        'Payment information',
        'Billing questions'
      ],
      'climate': [
        'Climate impact of products',
        'Carbon neutral shipping',
        'Renewable packaging info'
      ],
      'personal': [
        'Update my preferences',
        'Manage notifications',
        'Account settings'
      ],
      'account': [
        'Update profile information',
        'Change password',
        'Privacy settings'
      ]
    };

    return suggestions[context] || suggestions.general;
  }

  public generateRelatedTopics(context: MessageCategory): string[] {
    const topics: Record<MessageCategory, string[]> = {
      'general': ['Getting Started', 'Product Catalog', 'Sustainability Tips'],
      'product': ['Categories', 'Reviews', 'Sustainability Ratings'],
      'order': ['Shipping', 'Returns', 'Payment'],
      'sustainability': ['Zero Waste', 'Eco Tips', 'Green Living'],
      'support': ['FAQ', 'Contact', 'Help Center'],
      'tracking': ['Delivery', 'Shipping Updates', 'Logistics'],
      'invoice': ['Billing', 'Payments', 'Receipts'],
      'climate': ['Carbon Impact', 'Environment', 'Climate Action'],
      'personal': ['Profile', 'Preferences', 'Settings'],
      'account': ['Security', 'Privacy', 'Account Management']
    };

    return topics[context] || topics.general;
  }
}

export const contentGenerator = ContentGeneratorService.getInstance();
