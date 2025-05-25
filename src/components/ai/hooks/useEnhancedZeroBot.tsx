
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { EnhancedZeroBot } from '@/services/ai/enhanced-zerobot';
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
    'How can I reduce waste?',
    'Show me eco-friendly products',
    'Track my order'
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome-' + Date.now(),
        content: `Hello${currentUser?.displayName ? ` ${currentUser.displayName}` : ''}! 👋 I'm your enhanced AI assistant for Zero Waste Mart. I can help you with products, orders, account management, and more. What would you like to know?`,
        sender: 'bot',
        timestamp: new Date(),
        category: 'general'
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
      
      // Use streaming for better UX
      await EnhancedZeroBot.streamResponse(
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
              sources: response.metadata.sources
            }
          );
          
          setSuggestions(response.suggestions);
          
          // Save conversation periodically
          if (Math.random() > 0.7) { // 30% chance to save
            EnhancedZeroBot.saveConversation(userId);
          }
        }
      );
    } catch (error) {
      console.error('Enhanced ZeroBot error:', error);
      setIsProcessing(false);
      setStreamedResponse('');
      
      addBotMessage(
        "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        'general'
      );
      
      toast.error('AI assistant temporarily unavailable');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const clearChat = () => {
    setMessages([]);
    setCurrentContext('general');
    setSuggestions([
      'How can I reduce waste?',
      'Show me eco-friendly products',
      'Track my order'
    ]);
    setStreamedResponse('');
    
    // Re-add welcome message
    setTimeout(() => {
      const welcomeMessage: Message = {
        id: 'welcome-' + Date.now(),
        content: `Hello${currentUser?.displayName ? ` ${currentUser.displayName}` : ''}! 👋 I'm your enhanced AI assistant. How can I help you today?`,
        sender: 'bot',
        timestamp: new Date(),
        category: 'general'
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
