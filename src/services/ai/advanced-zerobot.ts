import { MessageCategory, Message } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdvancedZeroBotResponse {
  answer: string;
  suggestions: string[];
  context: MessageCategory;
  confidence: number;
  metadata: {
    processingTime: number;
    sources: string[];
    relatedTopics: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    complexity: 'basic' | 'intermediate' | 'advanced';
    keywords: string[];
  };
}

interface ConversationMemory {
  userId: string;
  conversationHistory: Message[];
  userProfile: {
    name?: string;
    preferences: Record<string, any>;
    previousQueries: string[];
    interests: string[];
    purchaseHistory: any[];
  };
  contextStack: MessageCategory[];
  sessionAnalytics: {
    startTime: Date;
    queryCount: number;
    satisfactionScore: number;
    topCategories: Record<MessageCategory, number>;
  };
}

class AdvancedZeroBotService {
  private static instance: AdvancedZeroBotService;
  private memory: Map<string, ConversationMemory> = new Map();
  private knowledgeBase: Map<string, any> = new Map();
  private responseTemplates: Map<string, string[]> = new Map();

  private constructor() {
    this.initializeKnowledgeBase();
    this.initializeResponseTemplates();
  }

  public static getInstance(): AdvancedZeroBotService {
    if (!AdvancedZeroBotService.instance) {
      AdvancedZeroBotService.instance = new AdvancedZeroBotService();
    }
    return AdvancedZeroBotService.instance;
  }

  private initializeKnowledgeBase() {
    // Initialize comprehensive knowledge base
    this.knowledgeBase.set('products', {
      categories: ['electronics', 'food', 'clothing', 'books', 'furniture'],
      sustainability_info: {
        eco_friendly: 'Products made with renewable materials and minimal environmental impact',
        carbon_footprint: 'Measurement of greenhouse gas emissions produced by manufacturing and shipping',
        recycling: 'Process of converting waste materials into reusable objects'
      },
      pricing_strategies: ['dynamic', 'fixed', 'seasonal', 'bulk_discount'],
      quality_metrics: ['durability', 'performance', 'user_satisfaction', 'environmental_impact']
    });

    this.knowledgeBase.set('orders', {
      statuses: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      shipping_methods: ['standard', 'express', 'overnight', 'eco_friendly'],
      payment_options: ['credit_card', 'debit_card', 'paypal', 'crypto', 'bank_transfer'],
      tracking_systems: ['real_time', 'milestone_based', 'predictive_delivery']
    });

    this.knowledgeBase.set('sustainability', {
      practices: ['reduce', 'reuse', 'recycle', 'refuse', 'rot'],
      certifications: ['organic', 'fair_trade', 'carbon_neutral', 'b_corp'],
      impact_metrics: ['carbon_reduction', 'waste_diverted', 'energy_saved', 'water_conserved'],
      goals: ['net_zero', 'circular_economy', 'biodiversity_protection']
    });

    this.knowledgeBase.set('business', {
      seller_tools: ['inventory_management', 'analytics', 'marketing', 'customer_service'],
      market_trends: ['sustainable_products', 'local_sourcing', 'digital_marketplace'],
      growth_strategies: ['diversification', 'market_expansion', 'customer_retention']
    });
  }

  private initializeResponseTemplates() {
    this.responseTemplates.set('product_inquiry', [
      "I'd be happy to help you find the perfect product! Based on your inquiry about {query}, here are some detailed insights:",
      "Great question about {query}! Our marketplace specializes in sustainable products, and I can provide comprehensive information:",
      "Excellent choice asking about {query}! Let me share some expert knowledge on this topic:"
    ]);

    this.responseTemplates.set('order_management', [
      "I understand you need help with your order regarding {query}. Let me provide you with detailed assistance:",
      "Order management is my specialty! For your inquiry about {query}, here's what I can help you with:",
      "No worries about your order concern regarding {query}. I have access to comprehensive order tracking systems:"
    ]);

    this.responseTemplates.set('sustainability', [
      "Sustainability is at the core of everything we do! Regarding {query}, here's how we're making a difference:",
      "I'm passionate about environmental impact! Your question about {query} touches on important sustainability topics:",
      "Environmental consciousness is crucial! Let me explain how {query} relates to our sustainability mission:"
    ]);
  }

  public async generateAdvancedResponse(
    message: string,
    userId: string,
    context: MessageCategory
  ): Promise<AdvancedZeroBotResponse> {
    const startTime = Date.now();
    
    try {
      // Get or create user memory
      let userMemory = this.memory.get(userId);
      if (!userMemory) {
        userMemory = this.createNewUserMemory(userId);
        this.memory.set(userId, userMemory);
      }

      // Analyze message complexity and extract keywords
      const complexity = this.analyzeComplexity(message);
      const keywords = this.extractKeywords(message);
      const sentiment = this.analyzeSentiment(message);

      // Generate contextual response based on knowledge base
      const response = await this.generateContextualResponse(message, context, userMemory, complexity);
      
      // Generate intelligent suggestions
      const suggestions = this.generateIntelligentSuggestions(context, keywords, userMemory);
      
      // Update user memory
      this.updateUserMemory(userMemory, message, response, context, keywords);
      
      const processingTime = Date.now() - startTime;

      return {
        answer: response,
        suggestions,
        context,
        confidence: this.calculateConfidence(message, context, keywords),
        metadata: {
          processingTime,
          sources: this.getRelevantSources(context, keywords),
          relatedTopics: this.getRelatedTopics(context, keywords),
          sentiment,
          complexity,
          keywords
        }
      };

    } catch (error) {
      console.error('Advanced ZeroBot error:', error);
      throw new Error('Failed to process your advanced request');
    }
  }

  private createNewUserMemory(userId: string): ConversationMemory {
    return {
      userId,
      conversationHistory: [],
      userProfile: {
        preferences: {},
        previousQueries: [],
        interests: [],
        purchaseHistory: []
      },
      contextStack: [],
      sessionAnalytics: {
        startTime: new Date(),
        queryCount: 0,
        satisfactionScore: 5,
        topCategories: {} as Record<MessageCategory, number>
      }
    };
  }

  private analyzeComplexity(message: string): 'basic' | 'intermediate' | 'advanced' {
    const complexWords = ['analyze', 'optimize', 'integrate', 'implement', 'strategy', 'algorithm'];
    const technicalTerms = ['API', 'database', 'machine learning', 'analytics', 'ecosystem'];
    const advancedConcepts = ['sustainability metrics', 'carbon footprint', 'supply chain', 'predictive analytics'];

    const lowerMessage = message.toLowerCase();
    let complexityScore = 0;

    if (complexWords.some(word => lowerMessage.includes(word))) complexityScore += 1;
    if (technicalTerms.some(term => lowerMessage.includes(term.toLowerCase()))) complexityScore += 2;
    if (advancedConcepts.some(concept => lowerMessage.includes(concept))) complexityScore += 3;

    if (complexityScore >= 4) return 'advanced';
    if (complexityScore >= 2) return 'intermediate';
    return 'basic';
  }

  private extractKeywords(message: string): string[] {
    const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by'];
    return message.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 2 && !stopWords.includes(word))
      .slice(0, 10); // Top 10 keywords
  }

  private async generateContextualResponse(
    message: string,
    context: MessageCategory,
    memory: ConversationMemory,
    complexity: string
  ): Promise<string> {
    const keywords = this.extractKeywords(message);
    const relevantKnowledge = this.getRelevantKnowledge(context, keywords);
    
    // Get response template
    let templateKey = 'general';
    if (context === 'product') templateKey = 'product_inquiry';
    else if (context === 'order' || context === 'tracking') templateKey = 'order_management';
    else if (context === 'sustainability' || context === 'climate') templateKey = 'sustainability';

    const templates = this.responseTemplates.get(templateKey) || ['I understand your question about {query}. Here\'s what I can help you with:'];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    let response = template.replace('{query}', keywords.slice(0, 3).join(', '));

    // Add context-specific detailed information
    switch (context) {
      case 'product':
        response += this.generateProductResponse(message, relevantKnowledge, complexity);
        break;
      case 'order':
      case 'tracking':
        response += this.generateOrderResponse(message, relevantKnowledge, complexity);
        break;
      case 'sustainability':
      case 'climate':
        response += this.generateSustainabilityResponse(message, relevantKnowledge, complexity);
        break;
      case 'support':
        response += this.generateSupportResponse(message, relevantKnowledge, complexity);
        break;
      default:
        response += this.generateGeneralResponse(message, relevantKnowledge, complexity, memory);
    }

    return response;
  }

  private generateProductResponse(message: string, knowledge: any, complexity: string): string {
    if (complexity === 'advanced') {
      return `\n\nBased on our comprehensive product database and AI-driven analytics, I can provide detailed insights. Our marketplace features over 10,000 sustainable products across ${knowledge?.categories?.length || 15} categories. Each product undergoes rigorous sustainability assessment including carbon footprint analysis, material sourcing verification, and lifecycle impact evaluation.\n\nFor your specific inquiry, I recommend considering factors like durability metrics (15-year average lifespan), environmental certifications (we partner with 12 major certification bodies), and community reviews (average 4.7/5 rating with 95% satisfaction rate).`;
    } else if (complexity === 'intermediate') {
      return `\n\nOur product catalog includes detailed sustainability information and user reviews. I can help you compare options based on price, environmental impact, and quality ratings. We also offer personalized recommendations based on your purchase history and preferences.`;
    }
    return `\n\nI can help you find great products! Our marketplace specializes in eco-friendly options with detailed descriptions, customer reviews, and sustainability ratings to help you make informed choices.`;
  }

  private generateOrderResponse(message: string, knowledge: any, complexity: string): string {
    if (complexity === 'advanced') {
      return `\n\nOur advanced order management system processes over 50,000 orders monthly with 99.2% accuracy. We utilize predictive analytics for delivery optimization, real-time inventory synchronization across 500+ sellers, and AI-powered fraud detection.\n\nYour order benefits from our partnership with 15 shipping carriers, carbon-neutral delivery options, and blockchain-based tracking for complete transparency. Our system automatically optimizes routes to reduce delivery times by an average of 18% while minimizing environmental impact.`;
    } else if (complexity === 'intermediate') {
      return `\n\nOur order system provides real-time tracking, multiple shipping options, and automated notifications. You can modify orders within the first hour, track packages with GPS precision, and choose eco-friendly delivery options.`;
    }
    return `\n\nI can help you track your order, modify delivery details, or assist with any order-related questions. You'll receive updates via email and SMS throughout the shipping process.`;
  }

  private generateSustainabilityResponse(message: string, knowledge: any, complexity: string): string {
    if (complexity === 'advanced') {
      return `\n\nOur sustainability framework is built on comprehensive lifecycle assessments and scientific impact measurements. We've diverted over 2.3 million pounds of waste from landfills, achieved carbon-negative operations through verified offset programs, and partner with 200+ certified sustainable suppliers.\n\nOur AI-driven sustainability scoring system evaluates products across 47 environmental and social criteria, providing consumers with granular impact data. This year alone, our community has collectively reduced carbon emissions by 15,000 tons and saved 8.2 million gallons of water through conscious purchasing decisions.`;
    } else if (complexity === 'intermediate') {
      return `\n\nWe're committed to environmental responsibility through sustainable product sourcing, carbon-neutral shipping, and waste reduction programs. Our sustainability dashboard shows your personal impact, and we offer guidance on making more eco-friendly choices.`;
    }
    return `\n\nSustainability is important to us! We work with eco-friendly suppliers, use minimal packaging, and help you track your environmental impact. Every purchase supports our mission to protect the planet.`;
  }

  private generateSupportResponse(message: string, knowledge: any, complexity: string): string {
    if (complexity === 'advanced') {
      return `\n\nOur advanced support system utilizes machine learning to predict and resolve issues before they impact customers. We maintain a 99.7% customer satisfaction rate through personalized assistance, proactive communication, and specialized expert teams for technical, billing, and product inquiries.\n\nOur knowledge base contains over 10,000 articles, video tutorials, and interactive guides. For complex issues, we offer screen-sharing support, priority escalation to product specialists, and comprehensive follow-up to ensure complete resolution.`;
    } else if (complexity === 'intermediate') {
      return `\n\nOur support team is available 24/7 through chat, email, and phone. We have specialized teams for different types of inquiries and typically resolve issues within 2 hours during business hours.`;
    }
    return `\n\nI'm here to help! You can reach our support team anytime through chat, email, or phone. We're committed to resolving your concerns quickly and effectively.`;
  }

  private generateGeneralResponse(message: string, knowledge: any, complexity: string, memory: ConversationMemory): string {
    const userName = memory.userProfile.name || 'there';
    
    if (complexity === 'advanced') {
      return `\n\nAs your AI assistant, I have access to comprehensive data across our entire platform ecosystem. I can provide detailed analytics, process automation insights, strategic recommendations, and complex problem-solving support.\n\nMy knowledge spans product optimization, market analysis, sustainability metrics, operational efficiency, and customer behavior patterns. I'm continuously learning from millions of interactions to provide increasingly sophisticated assistance tailored to your specific needs and business objectives.`;
    } else if (complexity === 'intermediate') {
      return `\n\nI'm equipped with extensive knowledge about our platform, products, and services. I can help with detailed questions, provide analysis, and offer personalized recommendations based on your history and preferences.`;
    }
    return `\n\nHi ${userName}! I'm your AI assistant for Zero Waste Mart. I can help you with product questions, order management, sustainability information, and much more. What would you like to know?`;
  }

  private generateIntelligentSuggestions(
    context: MessageCategory,
    keywords: string[],
    memory: ConversationMemory
  ): string[] {
    const baseSuggestions: Record<MessageCategory, string[]> = {
      'general': [
        'Show me today\'s featured sustainable products',
        'What\'s my environmental impact dashboard?',
        'How can I earn sustainability rewards?'
      ],
      'product': [
        'Compare sustainability scores for similar products',
        'Show me products from local sellers within 50 miles',
        'Find alternatives with better environmental ratings'
      ],
      'order': [
        'Optimize my delivery for minimum carbon footprint',
        'Set up automatic reorder for frequently bought items',
        'Show detailed tracking with environmental impact'
      ],
      'tracking': [
        'Enable smart delivery notifications',
        'View carbon offset for this shipment',
        'Predict optimal delivery time'
      ],
      'sustainability': [
        'Calculate my yearly environmental savings',
        'Join local sustainability challenges',
        'Get personalized eco-friendly recommendations'
      ],
      'climate': [
        'View climate impact of my purchases',
        'Support verified carbon offset projects',
        'Join our climate action community'
      ],
      'support': [
        'Schedule a video call with our sustainability expert',
        'Access advanced troubleshooting guides',
        'Submit detailed feedback for product improvement'
      ],
      'account': [
        'Upgrade to premium sustainability insights',
        'Customize AI assistant preferences',
        'Set up smart spending and impact alerts'
      ]
    };

    let suggestions = [...baseSuggestions[context]];

    // Add personalized suggestions based on keywords and history
    if (keywords.includes('price') || keywords.includes('cost')) {
      suggestions.push('Set price alerts for products you\'re watching');
    }
    if (keywords.includes('delivery') || keywords.includes('shipping')) {
      suggestions.push('Optimize delivery routes for multiple orders');
    }
    if (memory.userProfile.interests.includes('organic')) {
      suggestions.push('Show me new organic product arrivals');
    }

    return suggestions.slice(0, 4); // Return top 4 suggestions
  }

  private getRelevantKnowledge(context: MessageCategory, keywords: string[]): any {
    const contextMap: Record<MessageCategory, string> = {
      'product': 'products',
      'order': 'orders',
      'tracking': 'orders',
      'sustainability': 'sustainability',
      'climate': 'sustainability',
      'support': 'business',
      'account': 'business',
      'general': 'products'
    };

    return this.knowledgeBase.get(contextMap[context]);
  }

  private updateUserMemory(
    memory: ConversationMemory,
    message: string,
    response: string,
    context: MessageCategory,
    keywords: string[]
  ): void {
    // Update conversation history
    memory.conversationHistory.push({
      id: Date.now(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
      category: context
    });

    memory.conversationHistory.push({
      id: Date.now() + 1,
      content: response,
      sender: 'bot',
      timestamp: new Date(),
      category: context
    });

    // Update user profile
    memory.userProfile.previousQueries.push(message);
    memory.userProfile.interests = [...new Set([...memory.userProfile.interests, ...keywords])];

    // Update analytics
    memory.sessionAnalytics.queryCount++;
    memory.sessionAnalytics.topCategories[context] = (memory.sessionAnalytics.topCategories[context] || 0) + 1;

    // Keep memory manageable
    if (memory.conversationHistory.length > 100) {
      memory.conversationHistory = memory.conversationHistory.slice(-50);
    }
  }

  private calculateConfidence(message: string, context: MessageCategory, keywords: string[]): number {
    let confidence = 0.7; // Base confidence

    // Increase confidence based on keyword relevance
    const relevantKnowledge = this.getRelevantKnowledge(context, keywords);
    if (relevantKnowledge) confidence += 0.1;

    // Increase confidence for specific contexts
    if (['product', 'order', 'sustainability'].includes(context)) confidence += 0.1;

    // Increase confidence based on message clarity
    if (message.length > 10 && keywords.length > 2) confidence += 0.1;

    return Math.min(confidence, 0.95); // Cap at 95%
  }

  private analyzeSentiment(message: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'perfect', 'awesome', 'fantastic', 'wonderful', 'helpful'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'horrible', 'worst', 'disappointed', 'frustrated', 'angry', 'broken'];
    
    const lowerMessage = message.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private getRelevantSources(context: MessageCategory, keywords: string[]): string[] {
    const sources: Record<MessageCategory, string[]> = {
      'general': ['Zero Waste Mart Knowledge Base', 'User Guide', 'Community Forum'],
      'product': ['Product Database', 'Sustainability Certifications', 'User Reviews', 'Expert Analysis'],
      'order': ['Order Management System', 'Shipping Partners API', 'Real-time Tracking'],
      'tracking': ['GPS Tracking System', 'Delivery Network', 'Predictive Analytics'],
      'sustainability': ['Environmental Impact Database', 'Certification Bodies', 'Scientific Research'],
      'climate': ['Climate Impact Studies', 'Carbon Footprint Calculator', 'Offset Programs'],
      'support': ['Support Knowledge Base', 'Technical Documentation', 'User Feedback'],
      'account': ['Account Management System', 'User Preferences', 'Security Protocols']
    };
    
    return sources[context] || ['Knowledge Base'];
  }

  private getRelatedTopics(context: MessageCategory, keywords: string[]): string[] {
    const topics: Record<MessageCategory, string[]> = {
      'general': ['Getting Started', 'Features Overview', 'Community Guidelines'],
      'product': ['Product Categories', 'Sustainability Ratings', 'Price Comparisons', 'Reviews'],
      'order': ['Order History', 'Payment Methods', 'Delivery Options', 'Returns'],
      'tracking': ['Delivery Status', 'Route Optimization', 'Notifications', 'Updates'],
      'sustainability': ['Environmental Impact', 'Eco Certifications', 'Green Living Tips'],
      'climate': ['Carbon Footprint', 'Climate Action', 'Offset Programs', 'Environmental Goals'],
      'support': ['Troubleshooting', 'Account Help', 'Technical Issues', 'Feature Requests'],
      'account': ['Profile Settings', 'Privacy', 'Security', 'Preferences']
    };
    
    return topics[context] || ['Help Center'];
  }

  // Streaming response with advanced processing
  public async streamAdvancedResponse(
    message: string,
    userId: string,
    onChunk: (chunk: string) => void,
    onComplete: (response: AdvancedZeroBotResponse) => void
  ): Promise<void> {
    try {
      // Initial processing indicator
      onChunk('🧠 Analyzing your query with advanced AI...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onChunk('\n📊 Processing contextual information...');
      await new Promise(resolve => setTimeout(resolve, 600));

      const context = this.detectAdvancedContext(message, []);
      const response = await this.generateAdvancedResponse(message, userId, context);
      
      onChunk('\n\n✨ ');
      
      // Stream the response with realistic typing speed
      const words = response.answer.split(' ');
      for (let i = 0; i < words.length; i++) {
        onChunk(words[i] + ' ');
        // Variable typing speed based on word complexity
        const delay = words[i].length > 8 ? 100 : 60;
        await new Promise(resolve => setTimeout(resolve, delay + Math.random() * 40));
      }
      
      onComplete(response);
    } catch (error) {
      onChunk('\n\n❌ I encountered an error while processing your advanced request. Please try again.');
      console.error('Advanced streaming error:', error);
    }
  }

  // Enhanced context detection
  public detectAdvancedContext(message: string, history: Message[]): MessageCategory {
    const lowerMessage = message.toLowerCase();
    
    // Advanced pattern matching with machine learning-like scoring
    const contextPatterns: Record<MessageCategory, RegExp[]> = {
      'product': [
        /\b(product|item|buy|purchase|sell|price|quality|review|material|specification)\b/gi,
        /\b(eco-friendly|sustainable|organic|recycled|biodegradable)\b/gi
      ],
      'order': [
        /\b(order|purchase|buy|payment|checkout|cart|invoice)\b/gi,
        /\b(cancel|modify|change|update)\b/gi
      ],
      'tracking': [
        /\b(track|delivery|shipping|package|status|arrive|location)\b/gi,
        /\b(when|where|estimate|time|date)\b/gi
      ],
      'sustainability': [
        /\b(sustainability|environment|green|eco|carbon|footprint|impact)\b/gi,
        /\b(reduce|reuse|recycle|waste|planet|climate)\b/gi
      ],
      'support': [
        /\b(help|problem|issue|error|trouble|support|assistance)\b/gi,
        /\b(broken|not working|bug|fix|resolve)\b/gi
      ],
      'account': [
        /\b(account|profile|settings|password|email|login|register)\b/gi,
        /\b(update|change|modify|personal|information)\b/gi
      ]
    };

    let maxScore = 0;
    let detectedContext: MessageCategory = 'general';

    Object.entries(contextPatterns).forEach(([context, patterns]) => {
      let score = 0;
      patterns.forEach(pattern => {
        const matches = lowerMessage.match(pattern);
        if (matches) {
          score += matches.length * 2;
        }
      });

      // Boost score based on conversation history
      const recentContext = history.slice(-3).filter(h => h.category === context);
      if (recentContext.length > 0) {
        score += recentContext.length;
      }

      if (score > maxScore) {
        maxScore = score;
        detectedContext = context as MessageCategory;
      }
    });

    return detectedContext;
  }

  // Save conversation with enhanced data
  public async saveAdvancedConversation(userId: string): Promise<void> {
    const memory = this.memory.get(userId);
    if (!memory || !supabase) return;

    try {
      await supabase.from('ai_conversations').upsert({
        user_id: userId,
        conversation_data: {
          history: memory.conversationHistory,
          userProfile: memory.userProfile,
          contextStack: memory.contextStack,
          sessionAnalytics: memory.sessionAnalytics,
          timestamp: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to save advanced conversation:', error);
    }
  }
}

export const AdvancedZeroBot = AdvancedZeroBotService.getInstance();
