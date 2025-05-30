
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Message, MessageCategory } from '@/types/chat';
import AISearchBar from './SearchBar';
import SuggestionsList from './SuggestionsList';
import ChatInput from './ChatInput';
import ChatMessages from './chat/ChatMessages';

interface ZeroBotChatContentProps {
  messages: Message[];
  filteredMessages: Message[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  toggleSearch: () => void;
  isProcessing: boolean;
  streamedResponse: string;
  currentContext: MessageCategory;
  sellerMode: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  suggestions: string[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  currentUser?: any;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleMessageReaction: (messageId: number | string, reaction: 'like' | 'dislike') => void;
  cancelCurrentStream: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  isRecording: boolean;
  handleSuggestionClick: (suggestion: string) => void;
  isMobile?: boolean;
}

const ZeroBotChatContent: React.FC<ZeroBotChatContentProps> = ({
  messages,
  filteredMessages,
  searchQuery,
  setSearchQuery,
  isSearching,
  toggleSearch,
  isProcessing,
  streamedResponse,
  currentContext,
  sellerMode,
  inputValue,
  setInputValue,
  suggestions,
  messagesEndRef,
  currentUser,
  handleSendMessage,
  handleKeyPress,
  handleMessageReaction,
  cancelCurrentStream,
  startRecording,
  stopRecording,
  isRecording,
  handleSuggestionClick,
  isMobile = false
}) => {
  const displayMessages = searchQuery ? filteredMessages : messages;
  
  return (
    <>
      <AnimatePresence>
        <AISearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredMessages={filteredMessages}
          isSearching={isSearching}
        />
      </AnimatePresence>
      
      {/* Messages */}
      <ChatMessages
        messages={displayMessages}
        searchQuery={searchQuery}
        streamedResponse={streamedResponse}
        currentContext={currentContext}
        sellerMode={sellerMode}
        messagesEndRef={messagesEndRef}
        handleMessageReaction={handleMessageReaction}
        cancelCurrentStream={cancelCurrentStream}
        currentUser={currentUser}
      />
      
      {/* Suggestions */}
      <SuggestionsList 
        suggestions={suggestions}
        isSearching={isSearching}
        handleSuggestionClick={handleSuggestionClick}
      />
      
      {/* Input area */}
      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleKeyPress={handleKeyPress}
        handleSendMessage={handleSendMessage}
        isProcessing={isProcessing}
        isSearching={isSearching}
        toggleSearch={toggleSearch}
        startRecording={startRecording}
        isRecording={isRecording}
        stopRecording={stopRecording}
        isMobile={isMobile}
      />
    </>
  );
};

export default ZeroBotChatContent;
