
import { MessageCategory, Message } from '@/types/chat';
import { debounce } from 'lodash';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ZeroBotResponse, ZeroBotRequestOptions } from './ai/types';
import { contextDetector } from './ai/contextDetector';
import { loggingService } from './ai/loggingService';
import { streamHandler } from './ai/streamHandler';
import { enhancedContentGenerator } from './ai/enhancedContentGenerator';
import { userPreferencesService } from './ai/userPreferences';
import { nlpProcessor } from './ai/nlpProcessor';

class ZeroBotAIService {
  private static instance: ZeroBotAIService;

  private constructor() {
    // Initialize the service
  }

  public static getInstance(): ZeroBotAIService {
    if (!ZeroBotAIService.instance) {
      ZeroBotAIService.instance = new ZeroBotAIService();
    }
    return ZeroBotAIService.instance;
  }

  // Enhanced context detection with NLP
  public detectMessageContext(message: string): MessageCategory {
    return contextDetector.detectMessageContext(message);
  }

  // Enhanced realtime processing with new features
  public async processMessageRealtime(
    message: string, 
    options: ZeroBotRequestOptions,
    onChunk: (chunk: string) => void,
    onComplete: (response: ZeroBotResponse) => void
  ): Promise<void> {
    try {
      const userId = options.userId || 'anonymous';
      const sellerMode = options.sellerMode || false;
      
      // Use enhanced content generator
      const enhancedResponse = await enhancedContentGenerator.generateEnhancedResponse(
        message,
        userId,
        options.category || 'general',
        sellerMode
      );

      // Check if we need to escalate to human
      if (enhancedResponse.escalateToHuman) {
        onChunk("I understand you'd like to speak with a human representative. ");
        await new Promise(resolve => setTimeout(resolve, 500));
        onChunk("Let me connect you with our customer service team. ");
        await new Promise(resolve => setTimeout(resolve, 500));
        onChunk("In the meantime, is there anything specific I can help you with right now?");
      } else {
        // Stream the enhanced response
        const words = enhancedResponse.answer.split(' ');
        for (const word of words) {
          onChunk(word + ' ');
          await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 30));
        }
      }

      // Complete with enhanced response data
      onComplete({
        answer: enhancedResponse.answer,
        suggestions: enhancedResponse.suggestions,
        context: options.category || 'general',
        confidence: 0.92,
        metadata: {
          relatedTopics: enhancedResponse.suggestions,
          processingTime: 1200,
          sentiment: enhancedResponse.sentiment as 'positive' | 'neutral' | 'negative',
          language: enhancedResponse.language,
          escalateToHuman: enhancedResponse.escalateToHuman,
          sources: ['Enhanced AI System'],
          complexity: 'medium',
          keywords: [message.toLowerCase()]
        }
      });

    } catch (error) {
      console.error("Error in enhanced realtime processing:", error);
      onChunk("I apologize, but I encountered an error. Please try again.");
      onComplete({
        answer: "I'm sorry, I encountered an error while processing your request.",
        suggestions: ["Try asking again", "Contact support", "Check your connection"],
        context: 'general',
        confidence: 0.1,
        metadata: {
          processingTime: 100,
          sentiment: 'neutral',
          language: 'english',
          escalateToHuman: false,
          sources: [],
          relatedTopics: [],
          complexity: 'low',
          keywords: []
        }
      });
    }
  }
  
  // Enhanced traditional processing
  public async processMessage(
    message: string, 
    options: ZeroBotRequestOptions = {}
  ): Promise<ZeroBotResponse> {
    try {
      const userId = options.userId || 'anonymous';
      const sellerMode = options.sellerMode || false;

      // Log interaction if Supabase is available
      if (supabase && userId !== 'anonymous') {
        await loggingService.logUserInteraction(userId, message, options.category);
      }
      
      // Use enhanced content generator
      const enhancedResponse = await enhancedContentGenerator.generateEnhancedResponse(
        message,
        userId,
        options.category || contextDetector.detectMessageContext(message),
        sellerMode
      );
      
      return {
        answer: enhancedResponse.answer,
        suggestions: enhancedResponse.suggestions,
        context: options.category || 'general',
        confidence: 0.92,
        metadata: {
          relatedTopics: enhancedResponse.suggestions,
          processingTime: 1200,
          sentiment: enhancedResponse.sentiment as 'positive' | 'neutral' | 'negative',
          language: enhancedResponse.language,
          escalateToHuman: enhancedResponse.escalateToHuman,
          sources: ['Enhanced AI System'],
          complexity: 'medium',
          keywords: [message.toLowerCase()]
        }
      };
    } catch (error) {
      console.error("Error processing message:", error);
      toast.error("Failed to process your request. Please try again.");
      
      return {
        answer: "I'm sorry, I encountered an error while processing your request. Please try again.",
        suggestions: ["Try a simpler question", "Contact support", "Reload the chat"],
        context: 'general',
        confidence: 0.1,
        metadata: {
          processingTime: 100,
          sentiment: 'neutral',
          language: 'english',
          escalateToHuman: false,
          sources: [],
          relatedTopics: [],
          complexity: 'low',
          keywords: []
        }
      };
    }
  }

  // Get personalized greeting for users
  public getPersonalizedGreeting(userId: string): string {
    return userPreferencesService.getPersonalizedGreeting(userId);
  }

  // Update user preferences
  public updateUserPreferences(userId: string, preferences: any): void {
    userPreferencesService.updateUserProfile(userId, { preferences });
  }

  // Set user's preferred name for greetings
  public setUserName(userId: string, name: string): void {
    userPreferencesService.updateUserProfile(userId, { greetingName: name });
  }
  
  // Cancel current streaming response
  public cancelCurrentStream(): void {
    streamHandler.cancelCurrentStream();
  }

  // Clear conversation history for a user
  public clearUserHistory(userId: string): void {
    nlpProcessor.clearHistory();
    // Could also clear user preferences if needed
  }
  
  // Debounced version of process message for search-as-you-type scenarios
  public processMessageDebounced = debounce(this.processMessage, 300);
}

export const ZeroBotAI = ZeroBotAIService.getInstance();
export type { ZeroBotResponse, ZeroBotRequestOptions };
