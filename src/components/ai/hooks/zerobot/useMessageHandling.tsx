
import { toast } from 'sonner';
import { ZeroBotAI } from '@/services/ZeroBotAI';
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
}

export function useMessageHandling({
  addUserMessage,
  addBotMessage,
  currentUser,
  setIsProcessing,
  setStreamedResponse,
  setCurrentContext,
  realtimeActive,
  setSuggestions,
  setMessages,
}: MessageHandlingProps) {
  
  // Initialize with personalized greeting
  const initializeChat = () => {
    if (currentUser?.id) {
      const personalizedGreeting = ZeroBotAI.getPersonalizedGreeting(currentUser.id);
      setMessages([{
        id: 1,
        content: personalizedGreeting,
        sender: 'bot',
        timestamp: new Date(),
        category: 'general',
      }]);
    }
  };

  // Enhanced message handling with new features
  const handleSendMessage = async (content: string = '') => {
    if (!content.trim()) return;
    
    // Add user message to chat
    addUserMessage(content);
    
    setIsProcessing(true);
    
    try {
      // Detect context of user message with enhanced NLP
      const detectedContext = ZeroBotAI.detectMessageContext(content);
      setCurrentContext(detectedContext);
      
      // Set enhanced options for request
      const options = {
        category: detectedContext,
        userId: currentUser?.id || 'anonymous',
        realtime: realtimeActive,
        sellerMode: currentUser?.isSeller || false
      };
      
      if (realtimeActive) {
        // Initialize streaming response
        setStreamedResponse('');
        
        // Process with enhanced streaming
        await ZeroBotAI.processMessageRealtime(
          content,
          options,
          // On chunk handler
          (chunk: string) => {
            setStreamedResponse(prev => prev + chunk);
          },
          // On complete handler with enhanced data
          (response) => {
            setIsProcessing(false);
            setStreamedResponse('');
            
            // Handle escalation to human if needed
            if (response.metadata?.escalateToHuman) {
              toast.info("I've noted you'd like to speak with a human representative.", {
                action: {
                  label: "Contact Support",
                  onClick: () => {
                    // Could integrate with support system
                    window.open('mailto:support@zerowastemart.com', '_blank');
                  }
                }
              });
            }
            
            // Add completed message with enhanced metadata
            addBotMessage(
              response.answer, 
              response.context || 'general',
              {
                processingTime: response.metadata?.processingTime,
                sources: response.metadata?.relatedTopics,
                isRealtime: true,
                sentiment: response.metadata?.sentiment,
                language: response.metadata?.language,
                escalateToHuman: response.metadata?.escalateToHuman
              }
            );
            
            // Update suggestions with personalized recommendations
            setSuggestions(response.suggestions || []);
          }
        );
      } else {
        // Process with enhanced features
        const response = await ZeroBotAI.processMessage(content, options);
        
        // Handle escalation to human if needed
        if (response.metadata?.escalateToHuman) {
          toast.info("I've noted you'd like to speak with a human representative.", {
            action: {
              label: "Contact Support",
              onClick: () => {
                window.open('mailto:support@zerowastemart.com', '_blank');
              }
            }
          });
        }
        
        // Add bot response with enhanced metadata
        addBotMessage(
          response.answer, 
          response.context || 'general',
          {
            processingTime: response.metadata?.processingTime,
            sources: response.metadata?.relatedTopics,
            sentiment: response.metadata?.sentiment,
            language: response.metadata?.language,
            escalateToHuman: response.metadata?.escalateToHuman
          }
        );
        
        // Update suggestions with personalized recommendations
        setSuggestions(response.suggestions || []);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      setIsProcessing(false);
      setStreamedResponse('');
      
      // Add error message
      addBotMessage(
        "I apologize, but I encountered an error processing your request. Please try again.",
        'general'
      );
      
      toast.error("Something went wrong. Please try again.");
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      handleSendMessage(target.value);
      target.value = '';
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };
  
  const handleMessageReaction = (messageId: number | string, reaction: 'like' | 'dislike') => {
    // Enhanced feedback handling with sentiment tracking
    if (currentUser?.id) {
      // Track user feedback for learning
      const feedbackData = { messageId, reaction, timestamp: new Date() };
      console.log('User feedback:', feedbackData);
    }
    
    toast.success(
      reaction === 'like' 
        ? 'Thank you for your feedback! This helps me learn.' 
        : 'Thanks for the feedback. I\'ll work on improving my responses.'
    );
  };
  
  const handleTopicClick = (title: string) => {
    handleSendMessage(`Tell me about ${title}`);
  };
  
  const handleGetStartedClick = () => {
    handleSendMessage('Help me get started');
  };
  
  return {
    handleSendMessage,
    handleKeyPress,
    handleSuggestionClick,
    handleMessageReaction,
    handleTopicClick,
    handleGetStartedClick,
    initializeChat,
    cancelCurrentStream: ZeroBotAI.cancelCurrentStream
  };
}
