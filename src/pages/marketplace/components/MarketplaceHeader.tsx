
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MarketplaceHeaderProps {
  showExpiryAlerts: boolean;
  toggleExpiryAlerts: () => void;
}

const MarketplaceHeader: React.FC<MarketplaceHeaderProps> = ({
  showExpiryAlerts,
  toggleExpiryAlerts
}) => {
  return (
    <div className="space-y-6">
      {/* Main Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Zero Waste Marketplace
        </h1>
        <p className="text-lg text-gray-600">
          Discover amazing deals on sustainable products with AI-powered pricing
        </p>
      </motion.div>

      {/* AI Insights Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Bot className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    AI Market Intelligence
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Live
                    </Badge>
                  </h3>
                  <p className="text-sm text-gray-600">
                    Smart pricing recommendations based on demand, expiry dates, and market trends
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="font-semibold">15%</span>
                  </div>
                  <p className="text-xs text-gray-500">Avg. Savings</p>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleExpiryAlerts}
                  className="flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  {showExpiryAlerts ? 'Hide' : 'Show'} Alerts
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Features Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="border-purple-200">
          <CardContent className="p-4 text-center">
            <Bot className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Dynamic Pricing</h4>
            <p className="text-sm text-gray-600">Real-time price optimization</p>
          </CardContent>
        </Card>
        
        <Card className="border-green-200">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Smart Deals</h4>
            <p className="text-sm text-gray-600">AI-curated best offers</p>
          </CardContent>
        </Card>
        
        <Card className="border-amber-200">
          <CardContent className="p-4 text-center">
            <AlertCircle className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Expiry Alerts</h4>
            <p className="text-sm text-gray-600">Intelligent waste reduction</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MarketplaceHeader;
