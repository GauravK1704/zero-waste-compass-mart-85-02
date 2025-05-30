
import { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { useChatMessages } from './zerobot/useChatMessages';
import { useUIState } from './zerobot/useUIState';
import { useSearch } from './zerobot/useSearch';
import { useMessageHandling } from './zerobot/useMessageHandling';
import { useVoiceRecording } from './zerobot/useVoiceRecording';
import { useSettings } from './zerobot/useSettings';

export function useZeroBot(initialPrompt?: string, sellerMode = false) {
  // Auth context
  const { currentUser } = useAuth();
  
  // Get functionality from smaller, focused hooks
  const chatMessages = useChatMessages(sellerMode, initialPrompt);
  const uiState = useUIState();
  const search = useSearch(chatMessages.messages);
  const voiceRecording = useVoiceRecording();
  const settings = useSettings({ addBotMessage: chatMessages.addBotMessage });
  
  // Create combined message handling hook with all dependencies including input value
  const messageHandling = useMessageHandling({
    setMessages: chatMessages.setMessages,
    addUserMessage: chatMessages.addUserMessage,
    addBotMessage: chatMessages.addBotMessage,
    currentUser,
    setIsProcessing: chatMessages.setIsProcessing,
    setStreamedResponse: chatMessages.setStreamedResponse,
    setCurrentContext: chatMessages.setCurrentContext,
    isProcessing: chatMessages.isProcessing,
    realtimeActive: settings.realtimeActive,
    currentContext: chatMessages.currentContext,
    setSuggestions: chatMessages.setSuggestions,
    inputValue: uiState.inputValue,
    setInputValue: uiState.setInputValue,
  });
  
  // Combine the clear chat function with seller mode
  const clearChat = () => settings.clearChat(sellerMode);
  
  return {
    // Messages and content
    ...chatMessages,
    
    // UI states
    ...uiState,
    
    // Search functionality
    ...search,
    
    // Recording functionality
    ...voiceRecording,
    
    // Settings
    ...settings,
    clearChat,
    
    // Message handling
    ...messageHandling,
    
    // User info
    currentUser,
  };
}
