
import { MessageCategory } from '@/types/chat';
import { contentGenerator } from './contentGenerator';
import { nlpProcessor } from './nlpProcessor';
import { userPreferencesService } from './userPreferences';
import { orderTracker } from './orderTracker';
import { knowledgeBase } from './knowledgeBase';

interface EnhancedResponse {
  answer: string;
  suggestions: string[];
  sentiment: string;
  language: string;
  escalateToHuman: boolean;
}

class EnhancedContentGeneratorService {
  private static instance: EnhancedContentGeneratorService;

  private constructor() {}

  public static getInstance(): EnhancedContentGeneratorService {
    if (!EnhancedContentGeneratorService.instance) {
      EnhancedContentGeneratorService.instance = new EnhancedContentGeneratorService();
    }
    return EnhancedContentGeneratorService.instance;
  }

  public async generateEnhancedResponse(
    message: string,
    userId: string,
    context: MessageCategory,
    sellerMode: boolean = false
  ): Promise<EnhancedResponse> {
    // Analyze input with NLP
    const analysis = nlpProcessor.analyzeInput(message);
    
    // Get user preferences for personalization
    const userProfile = userPreferencesService.getUserProfile(userId);
    
    // Track interaction
    userPreferencesService.trackInteraction(userId, 'message', { context, message });
    
    let response = '';
    let escalateToHuman = false;
    
    // Handle order tracking requests
    if (analysis.intent === 'track_order' && analysis.entities.orderId) {
      const orderStatus = await orderTracker.trackOrder(analysis.entities.orderId);
      if (orderStatus) {
        response = orderTracker.generateTrackingResponse(orderStatus);
      } else {
        response = "I couldn't find an order with that ID. Please check the order number and try again, or I can connect you with customer service.";
        escalateToHuman = true;
      }
    }
    // Handle knowledge base queries
    else if (analysis.intent === 'help' || message.toLowerCase().includes('how') || message.toLowerCase().includes('what')) {
      const articles = knowledgeBase.searchArticles(message);
      if (articles.length > 0) {
        response = `Based on our knowledge base: ${articles[0].content}\n\nWould you like more information about any of these topics?`;
      } else {
        response = contentGenerator.generateContextualResponse(message, context);
      }
    }
    // Handle complaints with escalation
    else if (analysis.intent === 'complaint' || analysis.sentiment === 'negative') {
      response = "I understand you're experiencing an issue. I want to make sure this gets resolved properly for you. Let me gather some details and connect you with our support team who can provide immediate assistance.";
      escalateToHuman = true;
    }
    // Handle compliments
    else if (analysis.intent === 'compliment' || analysis.sentiment === 'positive') {
      response = sellerMode 
        ? "Thank you so much! I'm glad I could help with your business needs. Is there anything else I can assist you with today?"
        : "Thank you for the kind words! I'm here to help make your sustainable shopping experience great. What else can I help you with?";
    }
    // Generate contextual response
    else {
      response = contentGenerator.generateContextualResponse(message, context);
    }
    
    // Add personalization based on user profile
    if (userProfile?.greetingName && !analysis.isFollowUp) {
      response = response.replace(/Hello!|Hi there!|Hi!/g, `Hello ${userProfile.greetingName}!`);
    }
    
    // Generate suggestions based on context and user preferences
    let suggestions = contentGenerator.generateContextualSuggestions(context);
    if (userProfile) {
      const personalizedSuggestions = userPreferencesService.generateRecommendations(userId);
      suggestions = [...personalizedSuggestions, ...suggestions].slice(0, 3);
    }
    
    return {
      answer: response,
      suggestions,
      sentiment: analysis.sentiment,
      language: analysis.language,
      escalateToHuman
    };
  }
}

export const enhancedContentGenerator = EnhancedContentGeneratorService.getInstance();
