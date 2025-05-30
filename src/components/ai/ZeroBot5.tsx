
import React, { Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useZeroBot } from './hooks/useZeroBot';
import ChatBotButton from '../chat/ChatBotButton';
import ZeroBotTypingIndicatorV5 from './components/zerobot/ZeroBotTypingIndicatorV5';

// Lazy loaded components to improve performance and reduce initial bundle size
const ZeroBotChatContent = lazy(() => import('./components/ZeroBotChatContent'));
const ZeroBotHeader = lazy(() => import('./components/zerobot/ZeroBotV5Header'));
const ZeroBotTabs = lazy(() => import('./components/ZeroBotTabs'));
const HelpTab = lazy(() => import('./components/HelpTab'));
const AnalyticsTab = lazy(() => import('./components/AnalyticsTab'));
const SettingsPanel = lazy(() => import('./components/SettingsPanel'));
const ZeroBotSuggestionsBar = lazy(() => import('./components/zerobot/ZeroBotSuggestionsBar'));

interface ZeroBot5Props {
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

const ZeroBot5: React.FC<ZeroBot5Props> = ({
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

  // Enhanced help topics for v5
  const helpTopics = sellerMode
    ? [
        { title: 'AI Product Descriptions', description: 'Generate compelling product descriptions with AI.' },
        { title: 'Market Insights', description: 'Get AI-powered market trend analysis and recommendations.' },
        { title: 'Customer Sentiment', description: 'Analyze customer feedback and reviews automatically.' },
        { title: 'Inventory Optimization', description: 'Use AI to optimize your inventory levels.' },
        { title: 'Competitor Analysis', description: 'Track and analyze competitor pricing and offerings.' },
      ]
    : [
        { title: 'Personalized Recommendations', description: 'Get AI-powered product recommendations based on your preferences.' },
        { title: 'Sustainability Ratings', description: 'Understanding how our AI calculates product sustainability scores.' },
        { title: 'Virtual Try-On', description: 'Learn how to use our AI virtual try-on feature.' },
        { title: 'Smart Search', description: 'Tips for using natural language to find what you need.' },
        { title: 'Product Comparisons', description: 'Let AI help you compare similar products side by side.' },
      ];

  // Enhanced analytics with AI insights
  const mockAnalytics = {
    interactions: bot.messages.length > 1 ? bot.messages.length - 1 : 0,
    topQuestions: [
      'How sustainable is this product?',
      'Can you recommend alternatives?',
      'What materials is this made from?',
    ],
    averageResponseTime: '0.6 seconds',
    satisfactionRate: '96%',
    categoriesDistribution: {
      product: 40,
      sustainability: 25,
      order: 20,
      tracking: 10,
      other: 5,
    },
    aiInsights: {
      sentimentScore: 0.82,
      commonConcerns: ['product durability', 'shipping speed', 'material sourcing'],
      suggestedImprovements: ['More product details', 'Faster checkout', 'Better recommendations'],
    },
  };

  // Mobile-optimized container classes
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

      {/* Chat window with mobile optimization */}
      <AnimatePresence>
        {bot.isOpen && (
          <motion.div
            className={botWindowClasses}
            initial={isMobile ? { opacity: 0, y: 100, scale: 0.95 } : { opacity: 0, scale: 0.9, y: 40 }}
            animate={isMobile ? { opacity: 1, y: 0, scale: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isMobile ? { opacity: 0, y: 100, scale: 0.95 } : { opacity: 0, scale: 0.85, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 0.8 }}
          >
            {/* V5 Header */}
            <Suspense fallback={<div className="h-14 bg-gradient-to-r from-emerald-500 to-teal-600 animate-pulse rounded-t-2xl"></div>}>
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

export default ZeroBot5;
