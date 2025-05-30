
import { toast } from 'sonner';
import { enhancedZeroBotAI } from '@/services/ai/EnhancedZeroBotAI';
import { Message, MessageCategory } from '@/types/chat';

interface MessageHandlingProps {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  addUserMessage: (content: string) => void;
  addBotMessage: (content: string, category?: MessageCategory, metadata?: any) => void;
  currentUser?: any;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  setStreamedResponse: React.Dispatch<React.SetStateAction<string>>;
  setCurrentContext: React.Dispatch<React.SetStateAction<MessageCategory>>;
  isProcessing: boolean;
  realtimeActive: boolean;
  currentContext: MessageCategory;
  setSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
}

export function useMessageHandling({
  addUserMessage,
  addBotMessage,
  currentUser,
  setIsProcessing,
  setStreamedResponse,
  setCurrentContext,
  setSuggestions,
  setMessages,
  inputValue,
  setInputValue,
}: MessageHandlingProps) {
  
  // Initialize with enhanced personalized greeting
  const initializeChat = () => {
    if (currentUser?.id) {
      const greeting = `Hello${currentUser.displayName ? ` ${currentUser.displayName}` : ''}! 👋 I'm your enhanced AI assistant for Zero Waste Mart. I can help you with:\n\n🛍️ Smart product recommendations\n📦 Real-time order tracking\n🌱 Sustainability guidance\n💬 Natural conversation in multiple languages\n🤝 Escalation to human support when needed\n\nWhat would you like to explore today? 😊`;
      
      setMessages([{
        id: 1,
        content: greeting,
        sender: 'bot',
        timestamp: new Date(),
        category: 'general',
      }]);
    }
  };

  // Enhanced message handling with comprehensive AI capabilities
  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent) return;
    
    // Clear input IMMEDIATELY before processing
    setInputValue('');
    
    // Add user message to chat
    addUserMessage(messageContent);
    
    setIsProcessing(true);
    
    try {
      // Use enhanced AI processing
      const response = await enhancedZeroBotAI.processEnhancedMessage(
        messageContent,
        currentUser?.id || 'anonymous',
        {
          language: currentUser?.language || 'english',
          sessionId: `session_${currentUser?.id || 'anonymous'}`,
          userProfile: {
            name: currentUser?.displayName,
            preferences: currentUser?.preferences,
            isSeller: currentUser?.isSeller
          }
        }
      );
      
      // Update context based on AI response
      setCurrentContext(response.context);
      
      // Handle escalation to human if needed
      if (response.metadata.escalateToHuman) {
        toast.info("I'm connecting you with a human representative! 👥", {
          action: {
            label: "Contact Support",
            onClick: () => {
              window.open('mailto:support@zerowastemart.com', '_blank');
            }
          }
        });
      }
      
      // Handle feedback collection
      if (response.metadata.requiresFollowUp) {
        setTimeout(() => {
          toast.info("How am I doing? Rate my response! ⭐", {
            action: {
              label: "Give Feedback",
              onClick: () => {
                // Could open a feedback modal here
                console.log('Feedback requested');
              }
            }
          });
        }, 3000);
      }
      
      // Add bot response with enhanced metadata
      addBotMessage(
        response.answer,
        response.context,
        {
          processingTime: response.metadata.processingTime,
          sentiment: response.metadata.sentiment,
          language: response.metadata.language,
          escalateToHuman: response.metadata.escalateToHuman,
          confidence: response.confidence,
          complexity: response.metadata.complexity,
          keywords: response.metadata.keywords,
          emotion: response.metadata.emotion,
          requiresFollowUp: response.metadata.requiresFollowUp
        }
      );
      
      // Update suggestions with AI recommendations
      setSuggestions(response.suggestions);
      setIsProcessing(false);
      
    } catch (error) {
      console.error("Enhanced AI error:", error);
      setIsProcessing(false);
      setStreamedResponse('');
      
      // Add friendly error message with escalation option
      addBotMessage(
        "I apologize, but I'm experiencing some technical difficulties! 😅 Let me connect you with a human agent who can help you right away. 🤝",
        'support'
      );
      
      toast.error("AI assistant temporarily unavailable - connecting to human support");
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };
  
  const handleMessageReaction = (messageId: number | string, reaction: 'like' | 'dislike') => {
    // Enhanced feedback collection with sentiment tracking
    if (currentUser?.id) {
      const feedbackData = { 
        messageId, 
        reaction, 
        timestamp: new Date(),
        userId: currentUser.id 
      };
      
      // Collect feedback for AI improvement
      enhancedZeroBotAI.collectFeedback(
        `session_${currentUser.id}`,
        reaction === 'like' ? 5 : 2,
        `User ${reaction}d message ${messageId}`
      );
      
      console.log('Enhanced feedback collected:', feedbackData);
    }
    
    const responseMessage = reaction === 'like' 
      ? 'Thank you for the positive feedback! This helps me learn and improve. 😊✨' 
      : 'Thanks for letting me know! I\'ll work on providing better responses. Your feedback helps me grow! 🤝📈';
    
    toast.success(responseMessage);
  };
  
  const handleTopicClick = (title: string) => {
    handleSendMessage(`Tell me about ${title}`);
  };
  
  const handleGetStartedClick = () => {
    handleSendMessage('Help me get started with sustainable living and explore your features');
  };
  
  const cancelCurrentStream = () => {
    // Enhanced stream cancellation
    setIsProcessing(false);
    setStreamedResponse('');
    toast.info("Response cancelled. How else can I help you? 😊");
  };
  
  return {
    handleSendMessage,
    handleKeyPress,
    handleSuggestionClick,
    handleMessageReaction,
    handleTopicClick,
    handleGetStartedClick,
    initializeChat,
    cancelCurrentStream
  };
}
