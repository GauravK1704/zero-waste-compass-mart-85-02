
import React, { Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useZeroBot } from './hooks/useZeroBot';
import ChatBotButton from '../chat/ChatBotButton';
import ZeroBotTypingIndicatorV5 from './components/zerobot/ZeroBotTypingIndicatorV5';

// Lazy loaded components for performance
const ZeroBotChatContent = lazy(() => import('./components/ZeroBotChatContent'));
const ZeroBotHeader = lazy(() => import('./components/zerobot/ZeroBotV5Header'));
const ZeroBotTabs = lazy(() => import('./components/ZeroBotTabs'));
const HelpTab = lazy(() => import('./components/HelpTab'));
const AnalyticsTab = lazy(() => import('./components/AnalyticsTab'));
const SettingsPanel = lazy(() => import('./components/SettingsPanel'));
const ZeroBotSuggestionsBar = lazy(() => import('./components/zerobot/ZeroBotSuggestionsBar'));

interface ZeroBotHomeProps {
  initialPrompt?: string;
  showInitially?: boolean;
  enableVoice?: boolean;
  enableRealtime?: boolean;
  showAnalytics?: boolean;
  sellerMode?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  enableAI?: boolean;
  isMobile?: boolean;
}

const ZeroBotHome: React.FC<ZeroBotHomeProps> = ({
  initialPrompt,
  showInitially = false,
  enableVoice = true,
  enableRealtime = true,
  showAnalytics = true,
  sellerMode = false,
  theme = 'auto',
  enableAI = true,
  isMobile = false,
}) => {
  const bot = useZeroBot(initialPrompt, sellerMode);

  // Help topics for home users
  const helpTopics = [
    { title: 'Find Sustainable Products', description: 'Discover eco-friendly alternatives for everyday items.' },
    { title: 'Track My Orders', description: 'Get real-time updates on your purchase deliveries.' },
    { title: 'Sustainability Tips', description: 'Learn how to live more sustainably with practical advice.' },
    { title: 'Product Comparisons', description: 'Compare products based on sustainability and price.' },
    { title: 'Account Management', description: 'Manage your profile, preferences, and settings.' },
  ];

  // Enhanced analytics for home users
  const mockAnalytics = {
    interactions: bot.messages.length > 1 ? bot.messages.length - 1 : 0,
    topQuestions: [
      'Where can I find eco-friendly products?',
      'How sustainable is this item?',
      'When will my order arrive?',
    ],
    averageResponseTime: '0.6 seconds',
    satisfactionRate: '96%',
    categoriesDistribution: {
      product: 45,
      sustainability: 30,
      order: 15,
      tracking: 8,
      other: 2,
    },
    aiInsights: {
      sentimentScore: 0.82,
      commonConcerns: ['product authenticity', 'delivery speed', 'sustainability verification'],
      suggestedImprovements: ['More product details', 'Faster checkout', 'Better recommendations'],
    },
  };

  const botWindowClasses = isMobile
    ? "fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-gradient-to-br from-purple-50/95 via-white/95 to-emerald-50/85 rounded-t-3xl h-[90vh] shadow-2xl border-t border-gray-200"
    : "fixed bottom-6 right-6 w-full sm:w-96 h-[600px] z-50 flex flex-col bg-gradient-to-br from-purple-50/95 via-white/95 to-emerald-50/85 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden";

  return (
    <>
      {/* Floating bot button */}
      {!bot.isOpen && (
        <ChatBotButton
          onClick={() => {
            bot.setIsOpen(true);
            bot.setHasUnreadMessages(false);
          }}
          isOpen={bot.isOpen}
          hasUnread={bot.hasUnreadMessages}
          isMobile={isMobile}
        />
      )}

      {/* Chat window */}
      <AnimatePresence>
        {bot.isOpen && (
          <motion.div
            className={botWindowClasses}
            initial={isMobile ? { opacity: 0, y: 100, scale: 0.95 } : { opacity: 0, scale: 0.9, y: 40 }}
            animate={isMobile ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isMobile ? { opacity: 0, y: 100, scale: 0.95 } : { opacity: 0, scale: 0.85, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 0.8 }}
          >
            {/* Header */}
            <Suspense fallback={<div className="h-14 bg-gradient-to-r from-purple-400 to-indigo-500 animate-pulse rounded-t-2xl"></div>}>
              <ZeroBotHeader
                sellerMode={sellerMode}
                showSettings={bot.showSettings}
                onClose={() => bot.setIsOpen(false)}
                onSettings={() => bot.setShowSettings(true)}
                badgeVersion="v5.0"
              />
            </Suspense>

            {/* Tabs */}
            <Suspense fallback={<div className="h-10 bg-white border-b animate-pulse"></div>}>
              <ZeroBotTabs
                activeTab={bot.activeTab}
                setActiveTab={(tab: 'chat' | 'help' | 'analytics') => bot.setActiveTab(tab)}
                showAnalytics={showAnalytics}
              />
            </Suspense>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-gray-50/90 via-white/90 to-emerald-50/70 relative">
              <Tabs value={bot.activeTab} className="flex-1 flex flex-col overflow-hidden">
                <TabsContent value="chat" className="flex-1 overflow-hidden flex flex-col p-0 m-0">
                  {/* Suggestions Bar */}
                  <Suspense fallback={<div className="h-12 bg-gray-100/50 animate-pulse"></div>}>
                    <ZeroBotSuggestionsBar
                      suggestions={bot.suggestions}
                      isProcessing={bot.isProcessing}
                      onSuggestionClick={bot.handleSuggestionClick}
                      animationEnabled={true}
                    />
                  </Suspense>

                  {/* Chat content */}
                  <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading chat...</div>}>
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
                      isMobile={isMobile}
                    />
                  </Suspense>

                  {/* Typing indicator */}
                  <ZeroBotTypingIndicatorV5 isTyping={bot.isProcessing} sellerMode={sellerMode} />
                </TabsContent>

                {/* Help Tab */}
                <TabsContent value="help" className="flex-1 overflow-auto mt-0 p-0">
                  <Suspense fallback={<div className="p-4">Loading help content...</div>}>
                    <HelpTab
                      helpTopics={helpTopics}
                      sellerMode={sellerMode}
                      onGetStartedClick={bot.handleGetStartedClick}
                      onTopicClick={bot.handleTopicClick}
                    />
                  </Suspense>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="flex-1 overflow-auto mt-0 p-0">
                  <Suspense fallback={<div className="p-4">Loading analytics...</div>}>
                    <AnalyticsTab
                      mockAnalytics={mockAnalytics}
                      sellerMode={sellerMode}
                      onReturn={() => bot.setActiveTab('chat')}
                    />
                  </Suspense>
                </TabsContent>
              </Tabs>
            </div>

            {/* Settings panel */}
            <AnimatePresence>
              {bot.showSettings && (
                <Suspense fallback={<div className="absolute inset-0 bg-black/20"></div>}>
                  <SettingsPanel
                    showSettings={bot.showSettings}
                    sellerMode={sellerMode}
                    onClose={() => bot.setShowSettings(false)}
                    clearChat={bot.clearChat}
                  />
                </Suspense>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ZeroBotHome;
