
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { AdvancedZeroBot } from '@/services/ai/advanced-zerobot';
import { Message, MessageCategory } from '@/types/chat';
import { toast } from 'sonner';

export function useEnhancedZeroBot() {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState('');
  const [currentContext, setCurrentContext] = useState<MessageCategory>('general');
  const [suggestions, setSuggestions] = useState<string[]>([
    'How can I reduce my environmental impact?',
    'Show me top-rated sustainable products',
    'Analyze my order history for insights'
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with enhanced welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome-' + Date.now(),
        content: `Hello${currentUser?.displayName ? ` ${currentUser.displayName}` : ''}! 👋 I'm your advanced AI assistant for Zero Waste Mart. I'm equipped with comprehensive knowledge about products, sustainability, market trends, and can provide detailed analytics and personalized recommendations. What would you like to explore today?`,
        sender: 'bot',
        timestamp: new Date(),
        category: 'general',
        confidence: 1.0,
        metadata: {
          processingTime: 0,
          sources: ['Advanced AI System'],
          isRealtime: true
        }
      };
      setMessages([welcomeMessage]);
    }
  }, [currentUser, messages.length]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamedResponse]);

  const addUserMessage = (content: string) => {
    const userMessage: Message = {
      id: 'user-' + Date.now(),
      content,
      sender: 'user',
      timestamp: new Date(),
      category: currentContext
    };
    setMessages(prev => [...prev, userMessage]);
  };

  const addBotMessage = (content: string, category: MessageCategory = 'general', metadata?: any) => {
    const botMessage: Message = {
      id: 'bot-' + Date.now(),
      content,
      sender: 'bot',
      timestamp: new Date(),
      category,
      metadata
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isProcessing) return;

    addUserMessage(content);
    setIsProcessing(true);
    setStreamedResponse('');

    try {
      const userId = currentUser?.id || 'anonymous';
      
      // Use advanced streaming for enhanced UX
      await AdvancedZeroBot.streamAdvancedResponse(
        content,
        userId,
        // On chunk received
        (chunk: string) => {
          setStreamedResponse(prev => prev + chunk);
        },
        // On complete
        (response) => {
          setIsProcessing(false);
          setStreamedResponse('');
          setCurrentContext(response.context);
          
          addBotMessage(
            response.answer,
            response.context,
            {
              confidence: response.confidence,
              processingTime: response.metadata.processingTime,
              sentiment: response.metadata.sentiment,
              sources: response.metadata.sources,
              complexity: response.metadata.complexity,
              keywords: response.metadata.keywords,
              relatedTopics: response.metadata.relatedTopics
            }
          );
          
          setSuggestions(response.suggestions);
          
          // Save conversation with enhanced data
          if (Math.random() > 0.5) { // 50% chance to save for better performance
            AdvancedZeroBot.saveAdvancedConversation(userId);
          }
        }
      );
    } catch (error) {
      console.error('Enhanced ZeroBot error:', error);
      setIsProcessing(false);
      setStreamedResponse('');
      
      addBotMessage(
        "I apologize, but I'm experiencing technical difficulties with my advanced processing systems. Please try again in a moment, and I'll provide you with the detailed assistance you deserve.",
        'general'
      );
      
      toast.error('Advanced AI assistant temporarily unavailable');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const clearChat = () => {
    setMessages([]);
    setCurrentContext('general');
    setSuggestions([
      'How can I reduce my environmental impact?',
      'Show me top-rated sustainable products', 
      'Analyze my order history for insights'
    ]);
    setStreamedResponse('');
    
    // Re-add enhanced welcome message
    setTimeout(() => {
      const welcomeMessage: Message = {
        id: 'welcome-' + Date.now(),
        content: `Hello${currentUser?.displayName ? ` ${currentUser.displayName}` : ''}! 👋 I'm your advanced AI assistant, ready to provide comprehensive insights and personalized recommendations. How can I assist you today?`,
        sender: 'bot',
        timestamp: new Date(),
        category: 'general',
        confidence: 1.0
      };
      setMessages([welcomeMessage]);
    }, 100);
  };

  return {
    // UI State
    isOpen,
    setIsOpen,
    
    // Messages
    messages,
    isProcessing,
    streamedResponse,
    currentContext,
    suggestions,
    messagesEndRef,
    
    // Actions
    handleSendMessage,
    handleSuggestionClick,
    clearChat,
    
    // User info
    currentUser
  };
}
