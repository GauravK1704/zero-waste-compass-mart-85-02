
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Bot, Mic, ShoppingCart, Search, Brain, MessageCircle } from 'lucide-react';

interface HelpTopicProps {
  title: string;
  description: string;
}

interface HelpTabProps {
  helpTopics: HelpTopicProps[];
  sellerMode: boolean;
  onGetStartedClick: () => void;
  onTopicClick: (title: string) => void;
}

const HelpTab: React.FC<HelpTabProps> = ({
  helpTopics,
  sellerMode,
  onGetStartedClick,
  onTopicClick
}) => {
  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-gray-50 to-white">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Bot className="w-6 h-6 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-800">ZeroBot AI v5.0</h2>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">Enhanced</Badge>
        </div>
        <p className="text-sm text-gray-600">
          {sellerMode ? "Your intelligent seller assistant" : "Your smart shopping companion"}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-auto p-3 flex flex-col items-center gap-1 hover:bg-purple-50"
          onClick={onGetStartedClick}
        >
          <MessageCircle className="w-4 h-4 text-purple-600" />
          <span className="text-xs">Get Started</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-auto p-3 flex flex-col items-center gap-1 hover:bg-green-50"
          onClick={() => onTopicClick("show me featured products")}
        >
          <ShoppingCart className="w-4 h-4 text-green-600" />
          <span className="text-xs">Browse Products</span>
        </Button>
      </div>

      {/* FAQ Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Search className="w-4 h-4" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-2">
          {helpTopics.map((topic, i) => (
            <Card key={i} className="cursor-pointer hover:bg-gray-50 transition-colors border-gray-100">
              <CardContent className="p-3" onClick={() => onTopicClick(topic.title)}>
                <h4 className="font-medium text-sm text-gray-800">{topic.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{topic.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* New Features Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Brain className="w-4 h-4" />
          Enhanced AI Features
        </h3>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
            <Badge variant="secondary" className="h-6 w-6 rounded-full p-0 flex items-center justify-center bg-purple-100">
              <Sparkles size={12} className="text-purple-600" />
            </Badge>
            <div className="flex-1">
              <span className="text-xs font-medium text-gray-800">Smart Understanding</span>
              <p className="text-xs text-gray-500">Understands informal & misspelled text</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
            <Badge variant="secondary" className="h-6 w-6 rounded-full p-0 flex items-center justify-center bg-blue-100">
              <Bot size={12} className="text-blue-600" />
            </Badge>
            <div className="flex-1">
              <span className="text-xs font-medium text-gray-800">Personalized Responses</span>
              <p className="text-xs text-gray-500">Remembers your preferences & history</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
            <Badge variant="secondary" className="h-6 w-6 rounded-full p-0 flex items-center justify-center bg-green-100">
              <Search size={12} className="text-green-600" />
            </Badge>
            <div className="flex-1">
              <span className="text-xs font-medium text-gray-800">Order Tracking</span>
              <p className="text-xs text-gray-500">Real-time order status & updates</p>
            </div>
          </div>
          
          {!sellerMode && (
            <div className="flex items-center gap-3 p-2 bg-amber-50 rounded-lg">
              <Badge variant="secondary" className="h-6 w-6 rounded-full p-0 flex items-center justify-center bg-amber-100">
                <Mic size={12} className="text-amber-600" />
              </Badge>
              <div className="flex-1">
                <span className="text-xs font-medium text-gray-800">Voice Input</span>
                <p className="text-xs text-gray-500">Speak naturally for hands-free use</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Main CTA */}
      <Button 
        className={`w-full ${sellerMode ? 'bg-amber-500 hover:bg-amber-600' : 'bg-purple-500 hover:bg-purple-600'} text-white`}
        onClick={onGetStartedClick}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Start Chatting
      </Button>
    </div>
  );
};

export default HelpTab;
