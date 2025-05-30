import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useZeroBot } from './hooks/useZeroBot';
import ZeroBotButton from './components/ZeroBotButton';
import ZeroBotHeader from './components/ZeroBotHeader';
import ZeroBotTabs from './components/ZeroBotTabs';
import ZeroBotChatContent from './components/ZeroBotChatContent';
import HelpTab from './components/HelpTab';
import AnalyticsTab from './components/AnalyticsTab';
import SettingsPanel from './components/SettingsPanel';
import { TabType } from '@/types';

interface ZeroBot4Props {
  initialPrompt?: string;
  showInitially?: boolean;
  enableVoice?: boolean;
  enableRealtime?: boolean;
  showAnalytics?: boolean;
  sellerMode?: boolean;
}

const ZeroBot4: React.FC<ZeroBot4Props> = ({
  initialPrompt,
  showInitially = false,
  enableVoice = true,
  enableRealtime = true,
  showAnalytics = false,
  sellerMode = false,
}) => {
  // Help topics for seller mode vs regular mode
  const helpTopics = sellerMode ? [
    { title: 'Adding Products', description: 'Learn how to add new products to your inventory.' },
    { title: 'Managing Orders', description: 'Track and manage customer orders efficiently.' },
    { title: 'Analytics Dashboard', description: 'Understand your seller performance metrics.' },
    { title: 'Promotions & Discounts', description: 'Create effective promotions for your products.' },
    { title: 'Shipping Settings', description: 'Configure your shipping options and rates.' }
  ] : [
    { title: 'Tracking Orders', description: 'How to track your packages and deliveries.' },
    { title: 'Returns & Refunds', description: 'Process for returning items and getting refunds.' },
    { title: 'Sustainability Scores', description: 'Understanding our product sustainability ratings.' },
    { title: 'Account Management', description: 'Managing your profile and preferences.' },
    { title: 'Payment Methods', description: 'Setting up and managing payment options.' }
  ];
  
  // Analytics data (would be from real data in production)
  const mockAnalytics = {
    interactions: 24,
    topQuestions: ['Where is my order?', 'How do I return this item?', 'Are these products sustainable?'],
    averageResponseTime: '1.4 seconds',
    satisfactionRate: '92%',
    categoriesDistribution: {
      product: 35,
      order: 25,
      tracking: 20,
      sustainability: 15,
      other: 5
    }
  };
  
  // Initialize the bot with our custom hook
  const bot = useZeroBot(initialPrompt, sellerMode);

  return (
    <>
      {/* Chat button */}
      {!bot.isOpen && (
        <ZeroBotButton 
          onClick={() => {
            bot.setIsOpen(true);
            bot.setHasUnreadMessages(false);
          }}
          hasUnreadMessages={bot.hasUnreadMessages}
          sellerMode={sellerMode}
        />
      )}
      
      {/* Chat window */}
      <AnimatePresence>
        {bot.isOpen && (
          <div className="fixed bottom-6 right-6 z-50 w-full sm:w-96 h-[500px] flex flex-col bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
            {/* Header */}
            <ZeroBotHeader
              isOpen={bot.isOpen}
              sellerMode={sellerMode}
              realtimeActive={bot.realtimeActive}
              toggleRealtimeMode={bot.toggleRealtimeMode}
              onClose={() => bot.setIsOpen(false)}
            />
            
            {/* Tabs */}
            <ZeroBotTabs
              activeTab={bot.activeTab}
              setActiveTab={(tab: TabType) => bot.setActiveTab(tab)}
              showAnalytics={showAnalytics}
            />
            
            {/* Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Fixing the Tabs issue by properly implementing the Tabs component structure */}
              <Tabs value={bot.activeTab} className="flex-1 flex flex-col overflow-hidden">
                <TabsContent value="chat" className="flex-1 overflow-hidden flex flex-col mt-0 p-0">
                  <ZeroBotChatContent
                    messages={bot.messages}
                    filteredMessages={bot.filteredMessages}
                    searchQuery={bot.searchQuery}
                    setSearchQuery={bot.setSearchQuery}
                    isSearching={bot.isSearching}
                    toggleSearch={bot.toggleSearch}
                    isProcessing={bot.isProcessing}
                    streamedResponse={bot.streamedResponse}
                    currentContext={bot.currentContext}
                    sellerMode={sellerMode}
                    inputValue={bot.inputValue}
                    setInputValue={bot.setInputValue}
                    suggestions={bot.suggestions}
                    messagesEndRef={bot.messagesEndRef}
                    currentUser={bot.currentUser}
                    handleSendMessage={bot.handleSendMessage}
                    handleKeyPress={bot.handleKeyPress}
                    handleMessageReaction={bot.handleMessageReaction}
                    cancelCurrentStream={bot.cancelCurrentStream}
                    startRecording={enableVoice ? bot.startRecording : () => {}}
                    stopRecording={bot.stopRecording}
                    isRecording={bot.isRecording}
                    handleSuggestionClick={bot.handleSuggestionClick}
                  />
                </TabsContent>
                
                <TabsContent value="help" className="flex-1 overflow-auto mt-0 p-0">
                  <HelpTab
                    helpTopics={helpTopics}
                    sellerMode={sellerMode}
                    onGetStartedClick={bot.handleGetStartedClick}
                    onTopicClick={bot.handleTopicClick}
                  />
                </TabsContent>
                
                <TabsContent value="analytics" className="flex-1 overflow-auto mt-0 p-0">
                  <AnalyticsTab
                    mockAnalytics={mockAnalytics}
                    sellerMode={sellerMode}
                    onReturn={() => bot.setActiveTab('chat')}
                  />
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Settings panel */}
            <AnimatePresence>
              <SettingsPanel 
                showSettings={bot.showSettings}
                sellerMode={sellerMode}
                onClose={() => bot.setShowSettings(false)}
                clearChat={bot.clearChat}
              />
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ZeroBot4;
