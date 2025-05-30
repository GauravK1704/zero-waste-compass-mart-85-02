
import { Message, MessageCategory, ZeroBotResponse, ConversationContext, KnowledgeBaseEntry, OrderTracking } from '@/types';

class EnhancedZeroBotAI {
  private static instance: EnhancedZeroBotAI;
  private conversations: Map<string, ConversationContext> = new Map();
  private knowledgeBase: KnowledgeBaseEntry[] = [];
  private orderDatabase: Map<string, OrderTracking> = new Map();

  private constructor() {
    this.initializeKnowledgeBase();
    this.initializeMockOrders();
  }

  public static getInstance(): EnhancedZeroBotAI {
    if (!EnhancedZeroBotAI.instance) {
      EnhancedZeroBotAI.instance = new EnhancedZeroBotAI();
    }
    return EnhancedZeroBotAI.instance;
  }

  // Intent Detection & Context Memory
  public detectIntent(message: string, context?: ConversationContext): string {
    const lowerMessage = message.toLowerCase();
    
    const intentPatterns = {
      'track_order': /track|where is|order status|delivery|shipping/,
      'product_info': /product|item|details|price|specifications|materials/,
      'recommendation': /recommend|suggest|best|similar|what should/,
      'complaint': /problem|issue|wrong|broken|defective|not working/,
      'compliment': /thank|great|good|excellent|amazing|love/,
      'form_help': /fill|form|register|signup|step by step/,
      'escalate': /human|agent|support|help me|speak to someone/,
      'personal_info': /my account|my profile|my details|change my/,
      'feedback': /feedback|rate|review|satisfaction/
    };

    for (const [intent, pattern] of Object.entries(intentPatterns)) {
      if (pattern.test(lowerMessage)) {
        return intent;
      }
    }

    return 'general';
  }

  // Language Detection
  public detectLanguage(text: string): string {
    const hindiPattern = /[\u0900-\u097F]/;
    if (hindiPattern.test(text)) return 'hindi';
    
    const commonHindiWords = ['kya', 'hai', 'mera', 'order', 'kahan', 'kaise'];
    if (commonHindiWords.some(word => text.toLowerCase().includes(word))) return 'hindi';
    
    return 'english';
  }

  // Emotion Detection
  public detectEmotion(message: string): 'frustrated' | 'happy' | 'confused' | 'angry' | 'neutral' {
    const lowerMessage = message.toLowerCase();
    
    if (/angry|furious|mad|hate|terrible|worst/.test(lowerMessage)) return 'angry';
    if (/frustrated|annoyed|irritated|fed up/.test(lowerMessage)) return 'frustrated';
    if (/confused|don't understand|unclear|help|lost/.test(lowerMessage)) return 'confused';
    if (/happy|great|excellent|love|amazing|perfect/.test(lowerMessage)) return 'happy';
    
    return 'neutral';
  }

  // Smart Product Recommendations
  public async getProductRecommendations(preferences: any): Promise<string[]> {
    // Simulate smart recommendations based on user preferences
    const recommendations = [
      "🌱 Eco-friendly bamboo utensil set - perfect for sustainable living",
      "♻️ Reusable glass water bottles - reduce plastic waste",
      "🌿 Organic cotton tote bags - stylish and sustainable",
      "🍃 Biodegradable phone cases - protect your phone and planet"
    ];
    
    return recommendations.slice(0, 3);
  }

  // Order Tracking
  public async trackOrder(orderId: string): Promise<OrderTracking | null> {
    return this.orderDatabase.get(orderId.toUpperCase()) || null;
  }

  // Knowledge Base Search
  public searchKnowledgeBase(query: string): KnowledgeBaseEntry[] {
    const lowerQuery = query.toLowerCase();
    return this.knowledgeBase.filter(entry => 
      entry.title.toLowerCase().includes(lowerQuery) ||
      entry.content.toLowerCase().includes(lowerQuery) ||
      entry.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
    );
  }

  // Enhanced Message Processing
  public async processEnhancedMessage(
    message: string,
    userId: string,
    options: {
      language?: string;
      sessionId?: string;
      userProfile?: any;
    } = {}
  ): Promise<ZeroBotResponse> {
    const startTime = Date.now();
    
    // Get or create conversation context
    const sessionId = options.sessionId || `session_${Date.now()}`;
    let context = this.conversations.get(sessionId) || {
      userId,
      sessionId,
      history: [],
      currentIntent: 'general',
      userProfile: options.userProfile
    };

    // Detect language, intent, and emotion
    const language = options.language || this.detectLanguage(message);
    const intent = this.detectIntent(message, context);
    const emotion = this.detectEmotion(message);
    
    // Add to conversation history
    const userMessage: Message = {
      id: Date.now(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
      category: 'general'
    };
    context.history.push(userMessage);
    context.currentIntent = intent;

    let response = '';
    let suggestions: string[] = [];
    let escalateToHuman = false;
    let requiresFollowUp = false;

    // Handle different intents
    switch (intent) {
      case 'track_order':
        response = await this.handleOrderTracking(message, context);
        suggestions = ['Check another order', 'Update delivery address', 'Contact support'];
        break;
        
      case 'product_info':
        response = await this.handleProductInfo(message, context);
        suggestions = await this.getProductRecommendations(context.userProfile);
        break;
        
      case 'recommendation':
        response = await this.handleRecommendations(message, context);
        suggestions = ['View more products', 'Add to cart', 'Compare products'];
        break;
        
      case 'complaint':
        response = await this.handleComplaint(message, context);
        escalateToHuman = true;
        suggestions = ['Speak to manager', 'Get refund', 'Return product'];
        break;
        
      case 'form_help':
        response = await this.handleFormAssistance(message, context);
        requiresFollowUp = true;
        suggestions = ['Continue filling form', 'Save for later', 'Get help'];
        break;
        
      case 'escalate':
        response = this.handleEscalation(emotion, language);
        escalateToHuman = true;
        break;
        
      default:
        response = await this.handleGeneral(message, context, emotion, language);
        suggestions = this.getContextualSuggestions(context.currentIntent);
    }

    // Apply emotion-based adjustments
    response = this.adjustResponseForEmotion(response, emotion, language);

    // Save updated context
    this.conversations.set(sessionId, context);

    const processingTime = Date.now() - startTime;

    return {
      answer: response,
      context: this.mapIntentToCategory(intent),
      confidence: 0.85,
      suggestions,
      metadata: {
        processingTime,
        sentiment: emotion === 'happy' ? 'positive' : emotion === 'angry' ? 'negative' : 'neutral',
        language,
        escalateToHuman,
        complexity: this.assessComplexity(message),
        keywords: this.extractKeywords(message),
        relatedTopics: this.getRelatedTopics(intent),
        emotion,
        requiresFollowUp
      }
    };
  }

  private async handleOrderTracking(message: string, context: ConversationContext): Promise<string> {
    // Extract order ID from message
    const orderIdMatch = message.match(/(?:order|#)\s*([a-z0-9-]+)/i);
    
    if (orderIdMatch) {
      const orderId = orderIdMatch[1].toUpperCase();
      const order = await this.trackOrder(orderId);
      
      if (order) {
        return `📦 Great news! I found your order ${order.orderId}.\n\n` +
               `Status: ${order.status.toUpperCase()}\n` +
               `${order.location ? `Location: ${order.location}\n` : ''}` +
               `${order.estimatedDelivery ? `Expected delivery: ${order.estimatedDelivery}\n` : ''}` +
               `Last updated: ${order.lastUpdate.toLocaleDateString()}\n\n` +
               `${this.getStatusEmoji(order.status)} Everything looks good! 😊`;
      } else {
        return `I couldn't find an order with ID "${orderId}". Please double-check the order number or contact support if you need help! 📞`;
      }
    }
    
    return "I'd be happy to help track your order! 📦 Please provide your order ID or order number, and I'll get the latest status for you. 😊";
  }

  private async handleProductInfo(message: string, context: ConversationContext): Promise<string> {
    const knowledgeResults = this.searchKnowledgeBase(message);
    
    if (knowledgeResults.length > 0) {
      const result = knowledgeResults[0];
      return `🌟 Here's what I found about "${result.title}":\n\n${result.content}\n\nWould you like to know more about our sustainable products? 🌱`;
    }
    
    return "I'd love to help you learn more about our products! 🛍️ Could you tell me which specific product you're interested in? I can provide details about materials, sustainability ratings, pricing, and more! ✨";
  }

  private async handleRecommendations(message: string, context: ConversationContext): Promise<string> {
    const recommendations = await this.getProductRecommendations(context.userProfile);
    
    return `Based on your interests, here are my top recommendations: 🌟\n\n` +
           recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n') +
           `\n\nAll of these are highly rated by our community! Would you like more details about any of them? 😊`;
  }

  private async handleComplaint(message: string, context: ConversationContext): Promise<string> {
    return `I'm really sorry to hear about this issue! 😔 Your experience is important to us, and I want to make sure we resolve this properly.\n\n` +
           `I'm connecting you with a human support specialist who can provide immediate assistance. In the meantime, could you please share your order number if this is order-related? 📝\n\n` +
           `We're committed to making this right! 💪`;
  }

  private async handleFormAssistance(message: string, context: ConversationContext): Promise<string> {
    if (!context.formData) {
      context.formData = {};
      context.stepInProgress = 'start';
    }
    
    return `I'm here to help you fill out the form step by step! 📝\n\n` +
           `Let's start with the basics. What's your first name? I'll guide you through each section to make it super easy! 😊`;
  }

  private handleEscalation(emotion: string, language: string): string {
    const responses = {
      english: `I understand you'd like to speak with a human representative. 👥 I'm connecting you with our support team right now!\n\n` +
               `Someone will be with you shortly to provide personalized assistance. Thank you for your patience! 🙏`,
      hindi: `मैं समझ गया हूं कि आप किसी व्यक्ति से बात करना चाहते हैं। 👥 मैं आपको अभी हमारी सपोर्ट टीम से जोड़ रहा हूं!\n\n` +
              `कोई व्यक्ति जल्द ही आपकी व्यक्तिगत सहायता के लिए उपलब्ध होगा। धैर्य के लिए धन्यवाद! 🙏`
    };
    
    return responses[language as keyof typeof responses] || responses.english;
  }

  private async handleGeneral(message: string, context: ConversationContext, emotion: string, language: string): Promise<string> {
    const userName = context.userProfile?.name ? `, ${context.userProfile.name}` : '';
    
    return `Hi there${userName}! 👋 I'm your AI assistant, and I'm here to help with anything you need!\n\n` +
           `I can help you with:\n` +
           `🛍️ Product recommendations and information\n` +
           `📦 Order tracking and status updates\n` +
           `🌱 Sustainability tips and eco-friendly options\n` +
           `📝 Account management and form assistance\n\n` +
           `What would you like to explore today? 😊`;
  }

  private adjustResponseForEmotion(response: string, emotion: string, language: string): string {
    switch (emotion) {
      case 'frustrated':
      case 'angry':
        return `I hear your frustration, and I'm here to help! 🤝\n\n${response}`;
      case 'confused':
        return `No worries, let me break this down for you! 💡\n\n${response}`;
      case 'happy':
        return `That's wonderful! 🎉\n\n${response}`;
      default:
        return response;
    }
  }

  private getStatusEmoji(status: string): string {
    const emojis = {
      'pending': '⏳',
      'confirmed': '✅',
      'shipped': '🚚',
      'delivered': '📬',
      'cancelled': '❌'
    };
    return emojis[status as keyof typeof emojis] || '📦';
  }

  private mapIntentToCategory(intent: string): MessageCategory {
    const mapping: Record<string, MessageCategory> = {
      'track_order': 'tracking',
      'product_info': 'product',
      'recommendation': 'product',
      'complaint': 'support',
      'form_help': 'account',
      'escalate': 'support',
      'personal_info': 'personal'
    };
    return mapping[intent] || 'general';
  }

  private assessComplexity(message: string): 'simple' | 'medium' | 'complex' {
    if (message.length < 20) return 'simple';
    if (message.length < 100) return 'medium';
    return 'complex';
  }

  private extractKeywords(message: string): string[] {
    return message.toLowerCase().match(/\b\w{4,}\b/g)?.slice(0, 5) || [];
  }

  private getRelatedTopics(intent: string): string[] {
    const topics: Record<string, string[]> = {
      'track_order': ['delivery status', 'shipping updates', 'order management'],
      'product_info': ['product details', 'sustainability', 'pricing'],
      'recommendation': ['product suggestions', 'user preferences', 'reviews']
    };
    return topics[intent] || ['general help', 'support'];
  }

  private getContextualSuggestions(intent: string): string[] {
    const suggestions: Record<string, string[]> = {
      'track_order': ['Track another order', 'Update delivery preferences', 'Contact support'],
      'product_info': ['View similar products', 'Check sustainability rating', 'Add to wishlist'],
      'general': ['Browse products', 'Track my orders', 'Sustainability tips', 'Account settings']
    };
    return suggestions[intent] || suggestions.general;
  }

  private initializeKnowledgeBase(): void {
    this.knowledgeBase = [
      {
        id: '1',
        title: 'Sustainable Materials Guide',
        content: 'Our products use eco-friendly materials like bamboo, recycled plastic, and organic cotton. Each item includes detailed material information and sustainability ratings.',
        category: 'sustainability',
        keywords: ['materials', 'sustainable', 'eco-friendly', 'bamboo', 'recycled'],
        language: 'english'
      },
      {
        id: '2',
        title: 'Order Tracking Help',
        content: 'Track your orders using your order ID. You\'ll receive real-time updates via SMS and email. Delivery typically takes 2-5 business days.',
        category: 'tracking',
        keywords: ['track', 'order', 'delivery', 'shipping', 'status'],
        language: 'english'
      }
    ];
  }

  private initializeMockOrders(): void {
    this.orderDatabase.set('ZWM001', {
      orderId: 'ZWM001',
      status: 'shipped',
      location: 'Distribution Center - Mumbai',
      estimatedDelivery: 'Tomorrow',
      trackingNumber: 'TRK123456789',
      lastUpdate: new Date()
    });
    
    this.orderDatabase.set('ZWM002', {
      orderId: 'ZWM002',
      status: 'delivered',
      location: 'Delivered to your address',
      estimatedDelivery: 'Completed',
      lastUpdate: new Date(Date.now() - 86400000) // Yesterday
    });
  }

  // Feedback Collection
  public async collectFeedback(sessionId: string, rating: number, comment?: string): Promise<void> {
    const context = this.conversations.get(sessionId);
    if (context) {
      console.log(`Feedback collected for session ${sessionId}: ${rating}/5`, comment);
      // In a real app, this would save to database
    }
  }

  // Clear conversation context
  public clearContext(sessionId: string): void {
    this.conversations.delete(sessionId);
  }
}

export const enhancedZeroBotAI = EnhancedZeroBotAI.getInstance();
