
import { MessageCategory } from '@/types/chat';

interface NLPAnalysis {
  intent: string;
  entities: Record<string, string>;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  isFollowUp: boolean;
  language: string;
  normalizedText: string;
}

class NLPProcessor {
  private static instance: NLPProcessor;
  private conversationHistory: string[] = [];

  private constructor() {}

  public static getInstance(): NLPProcessor {
    if (!NLPProcessor.instance) {
      NLPProcessor.instance = new NLPProcessor();
    }
    return NLPProcessor.instance;
  }

  // Enhanced text normalization for misspellings and informal text
  public normalizeText(text: string): string {
    // Common misspellings and informal text corrections
    const corrections: Record<string, string> = {
      'wher': 'where',
      'hw': 'how',
      'u': 'you',
      'ur': 'your',
      'wat': 'what',
      'wen': 'when',
      'y': 'why',
      'plz': 'please',
      'pls': 'please',
      'thx': 'thanks',
      'ty': 'thank you',
      'cant': "can't",
      'wont': "won't",
      'dont': "don't",
      'isnt': "isn't",
      'wasnt': "wasn't",
      'werent': "weren't",
      'shouldnt': "shouldn't",
      'wouldnt': "wouldn't",
      'couldnt': "couldn't",
      'havent': "haven't",
      'hasnt': "hasn't",
      'hadnt': "hadn't",
      'wont': "won't",
      'im': "I'm",
      'ive': "I've",
      'id': "I'd",
      'ill': "I'll",
      'youre': "you're",
      'youve': "you've",
      'youd': "you'd",
      'youll': "you'll",
      'hes': "he's",
      'shes': "she's",
      'its': "it's",
      'were': "we're",
      'weve': "we've",
      'wed': "we'd",
      'well': "we'll",
      'theyre': "they're",
      'theyve': "they've",
      'theyd': "they'd",
      'theyll': "they'll"
    };

    let normalized = text.toLowerCase();
    
    // Apply corrections
    Object.entries(corrections).forEach(([wrong, correct]) => {
      const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
      normalized = normalized.replace(regex, correct);
    });

    return normalized;
  }

  // Detect language (simplified version)
  public detectLanguage(text: string): string {
    const commonWords = {
      english: ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'],
      spanish: ['el', 'la', 'y', 'o', 'pero', 'en', 'de', 'a', 'por', 'con', 'para'],
      french: ['le', 'la', 'et', 'ou', 'mais', 'dans', 'de', 'à', 'pour', 'avec', 'par'],
      german: ['der', 'die', 'das', 'und', 'oder', 'aber', 'in', 'auf', 'zu', 'für', 'von', 'mit']
    };

    const lowerText = text.toLowerCase();
    const scores: Record<string, number> = {};

    Object.entries(commonWords).forEach(([lang, words]) => {
      scores[lang] = words.filter(word => lowerText.includes(word)).length;
    });

    const detectedLang = Object.entries(scores).reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b)[0];
    return scores[detectedLang] > 0 ? detectedLang : 'english';
  }

  // Enhanced sentiment analysis
  public analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = [
      'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome', 'perfect',
      'love', 'like', 'happy', 'pleased', 'satisfied', 'delighted', 'thrilled', 'excited',
      'thank', 'thanks', 'appreciate', 'grateful', 'helpful', 'useful', 'brilliant'
    ];

    const negativeWords = [
      'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'dislike', 'angry',
      'frustrated', 'disappointed', 'annoyed', 'upset', 'furious', 'disgusted',
      'problem', 'issue', 'error', 'bug', 'broken', 'wrong', 'fail', 'suck'
    ];

    const strongNegativeWords = [
      'outrageous', 'unacceptable', 'ridiculous', 'pathetic', 'useless', 'garbage'
    ];

    const lowerText = text.toLowerCase();
    
    let positiveScore = positiveWords.filter(word => lowerText.includes(word)).length;
    let negativeScore = negativeWords.filter(word => lowerText.includes(word)).length;
    
    // Strong negative words count double
    negativeScore += strongNegativeWords.filter(word => lowerText.includes(word)).length * 2;

    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  }

  // Analyze user input comprehensively
  public analyzeInput(text: string): NLPAnalysis {
    const normalizedText = this.normalizeText(text);
    const language = this.detectLanguage(text);
    const sentiment = this.analyzeSentiment(text);
    
    // Detect if this is a follow-up question
    const followUpIndicators = ['also', 'and', 'what about', 'how about', 'additionally', 'furthermore'];
    const isFollowUp = followUpIndicators.some(indicator => 
      normalizedText.includes(indicator)
    ) || this.conversationHistory.length > 0;

    // Extract entities (simplified)
    const entities = this.extractEntities(normalizedText);
    
    // Determine intent
    const intent = this.detectIntent(normalizedText);
    
    // Store in conversation history
    this.conversationHistory.push(normalizedText);
    if (this.conversationHistory.length > 5) {
      this.conversationHistory.shift();
    }

    return {
      intent,
      entities,
      sentiment,
      confidence: 0.85,
      isFollowUp,
      language,
      normalizedText
    };
  }

  private extractEntities(text: string): Record<string, string> {
    const entities: Record<string, string> = {};
    
    // Extract order numbers
    const orderMatch = text.match(/(?:order|#)\s*([a-z0-9-]+)/i);
    if (orderMatch) entities.orderId = orderMatch[1];
    
    // Extract prices
    const priceMatch = text.match(/\$?(\d+(?:\.\d{2})?)/);
    if (priceMatch) entities.price = priceMatch[1];
    
    // Extract dates
    const dateMatch = text.match(/\b(?:today|tomorrow|yesterday|\d{1,2}\/\d{1,2}\/\d{4})\b/i);
    if (dateMatch) entities.date = dateMatch[0];

    return entities;
  }

  private detectIntent(text: string): string {
    const intents = {
      'track_order': ['track', 'where', 'status', 'delivery', 'shipping'],
      'product_info': ['product', 'item', 'details', 'specifications', 'material'],
      'complaint': ['problem', 'issue', 'wrong', 'broken', 'defective'],
      'compliment': ['good', 'great', 'excellent', 'amazing', 'thank'],
      'help': ['help', 'support', 'assist', 'guide'],
      'recommendation': ['recommend', 'suggest', 'best', 'similar']
    };

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return intent;
      }
    }

    return 'general';
  }

  public clearHistory(): void {
    this.conversationHistory = [];
  }
}

export const nlpProcessor = NLPProcessor.getInstance();
