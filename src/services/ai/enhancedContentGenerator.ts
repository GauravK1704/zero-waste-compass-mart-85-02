
import { MessageCategory } from '@/types/chat';
import { nlpProcessor } from './nlpProcessor';
import { userPreferencesService } from './userPreferences';
import { orderTracker } from './orderTracker';
import { knowledgeBase } from './knowledgeBase';

class EnhancedContentGenerator {
  private static instance: EnhancedContentGenerator;

  private constructor() {}

  public static getInstance(): EnhancedContentGenerator {
    if (!EnhancedContentGenerator.instance) {
      EnhancedContentGenerator.instance = new EnhancedContentGenerator();
    }
    return EnhancedContentGenerator.instance;
  }

  public async generateEnhancedResponse(
    message: string,
    userId: string,
    category: MessageCategory,
    sellerMode: boolean = false
  ): Promise<{
    answer: string;
    suggestions: string[];
    escalateToHuman: boolean;
    sentiment: string;
    language: string;
  }> {
    // Analyze the input with NLP
    const analysis = nlpProcessor.analyzeInput(message);
    
    // Track user interaction
    userPreferencesService.trackInteraction(userId, 'chat_message', { message, category });
    
    // Get user profile for personalization
    const userProfile = userPreferencesService.getUserProfile(userId);
    
    // Determine if we need to escalate to human support
    const escalateToHuman = this.shouldEscalateToHuman(analysis);
    
    // Generate response based on intent and context
    let response = await this.generateContextualResponse(
      analysis,
      category,
      userId,
      sellerMode,
      userProfile
    );
    
    // Get personalized suggestions
    const suggestions = this.generatePersonalizedSuggestions(
      category,
      userId,
      sellerMode,
      analysis.intent
    );

    // Apply language adaptation
    response = this.adaptLanguage(response, analysis.language, userProfile?.preferences.communicationStyle || 'friendly');

    return {
      answer: response,
      suggestions,
      escalateToHuman,
      sentiment: analysis.sentiment,
      language: analysis.language
    };
  }

  private async generateContextualResponse(
    analysis: any,
    category: MessageCategory,
    userId: string,
    sellerMode: boolean,
    userProfile: any
  ): Promise<string> {
    const { intent, entities, sentiment, normalizedText } = analysis;

    // Handle order tracking
    if (intent === 'track_order' && entities.orderId) {
      const orderStatus = await orderTracker.trackOrder(entities.orderId);
      if (orderStatus) {
        return orderTracker.generateTrackingResponse(orderStatus);
      } else {
        return "I couldn't find that order. Please check the order number and try again, or I can help you look it up using your email address.";
      }
    }

    // Handle complaints with escalation
    if (intent === 'complaint' || sentiment === 'negative') {
      return this.generateSympathyResponse(normalizedText, sellerMode) + " " + 
        this.getContextualSolution(category, normalizedText);
    }

    // Handle compliments
    if (intent === 'compliment' || sentiment === 'positive') {
      return this.generateAppreciationResponse(userProfile?.greetingName || 'there');
    }

    // Handle recommendations
    if (intent === 'recommendation') {
      return this.generateRecommendationResponse(normalizedText, sellerMode, userProfile);
    }

    // Handle product information
    if (intent === 'product_info' || category === 'product') {
      return this.generateProductResponse(normalizedText, sellerMode);
    }

    // Search knowledge base for relevant information
    const knowledgeArticles = knowledgeBase.searchArticles(normalizedText);
    if (knowledgeArticles.length > 0) {
      const article = knowledgeArticles[0];
      knowledgeBase.incrementViews(article.id);
      return `Based on our knowledge base: ${article.content.substring(0, 200)}... Would you like more detailed information about this topic?`;
    }

    // Default contextual response
    return this.generateDefaultResponse(category, sellerMode, userProfile);
  }

  private shouldEscalateToHuman(analysis: any): boolean {
    const escalationTriggers = [
      'speak to human', 'human agent', 'customer service', 'supervisor',
      'manager', 'representative', 'person', 'real person'
    ];

    const strongNegativeWords = ['outrageous', 'unacceptable', 'ridiculous', 'pathetic'];
    
    return escalationTriggers.some(trigger => 
      analysis.normalizedText.includes(trigger)
    ) || strongNegativeWords.some(word => 
      analysis.normalizedText.includes(word)
    ) || analysis.sentiment === 'negative' && analysis.confidence > 0.8;
  }

  private generateSympathyResponse(text: string, sellerMode: boolean): string {
    const responses = sellerMode ? [
      "I sincerely apologize for any inconvenience you've experienced.",
      "I understand your frustration, and I'm here to help resolve this issue.",
      "Thank you for bringing this to my attention. Let me help you solve this problem."
    ] : [
      "I'm really sorry to hear about this issue.",
      "I understand how frustrating that must be.",
      "Thank you for your patience. Let me help you with this right away."
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateAppreciationResponse(name: string): string {
    const responses = [
      `Thank you so much, ${name}! Your feedback means a lot to us. 😊`,
      `I'm delighted to hear that, ${name}! We're always working to improve your experience.`,
      `That's wonderful to hear, ${name}! Thank you for choosing Zero Waste Mart.`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  private generateRecommendationResponse(text: string, sellerMode: boolean, userProfile: any): string {
    if (sellerMode) {
      return "Based on market trends and your selling history, I recommend focusing on sustainable home goods and eco-friendly personal care items. These categories show strong growth potential.";
    } else {
      const preferences = userProfile?.preferences;
      if (preferences?.sustainability) {
        return "I'd be happy to recommend some eco-friendly products! Based on your interest in sustainability, you might love our bamboo kitchenware collection or our zero-waste starter kit.";
      }
      return "I can help you find the perfect products! What specific type of item or category are you interested in?";
    }
  }

  private generateProductResponse(text: string, sellerMode: boolean): string {
    if (sellerMode) {
      return "I can help you with product details for your listings. Our seller dashboard provides comprehensive product information including specifications, sustainability ratings, and competitive pricing data.";
    } else {
      return "I'd be happy to provide detailed product information! Our products come with comprehensive sustainability ratings, material specifications, and user reviews. What specific product would you like to know about?";
    }
  }

  private generateDefaultResponse(category: MessageCategory, sellerMode: boolean, userProfile: any): string {
    const name = userProfile?.greetingName || 'there';
    
    if (sellerMode) {
      return `Hi ${name}! I'm here to help with your selling needs. Whether it's product listings, order management, or market insights, I'm ready to assist you in growing your sustainable business.`;
    } else {
      return `Hello ${name}! I'm here to help you discover sustainable products and make eco-friendly choices. What can I assist you with today?`;
    }
  }

  private generatePersonalizedSuggestions(
    category: MessageCategory,
    userId: string,
    sellerMode: boolean,
    intent: string
  ): string[] {
    // Get user-specific recommendations
    const personalizedRecs = userPreferencesService.generateRecommendations(userId);
    
    // Base suggestions by context
    const baseSuggestions = sellerMode ? [
      'View your sales analytics',
      'Manage product listings',
      'Check inventory levels'
    ] : [
      'Browse sustainable products',
      'Track my orders',
      'Learn about zero waste living'
    ];

    // Combine personalized and base suggestions
    return [...personalizedRecs, ...baseSuggestions].slice(0, 3);
  }

  private adaptLanguage(text: string, language: string, style: string): string {
    // Simple language adaptation (could be expanded with translation APIs)
    if (language !== 'english') {
      return text + ' (Translated from English)';
    }

    // Adapt communication style
    switch (style) {
      case 'formal':
        return text.replace(/Hi!/g, 'Good day.').replace(/😊/g, '');
      case 'casual':
        return text.replace(/I would/g, "I'd").replace(/cannot/g, "can't");
      default:
        return text;
    }
  }

  private getContextualSolution(category: MessageCategory, text: string): string {
    const solutions = {
      order: "I can help you track your order, modify it if it hasn't shipped, or start a return process if needed.",
      product: "I can provide detailed product information, help you find alternatives, or connect you with the seller for specific questions.",
      shipping: "I can check your delivery status, update your address, or arrange for expedited shipping if available.",
      general: "Let me help you find the best solution. I can connect you with our customer service team if needed."
    };

    return solutions[category] || solutions.general;
  }
}

export const enhancedContentGenerator = EnhancedContentGenerator.getInstance();
