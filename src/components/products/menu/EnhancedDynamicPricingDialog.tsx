
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Item } from '@/types';
import { Bot, TrendingUp, TrendingDown, AlertCircle, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface EnhancedDynamicPricingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: any) => void;
  product: Item;
}

const EnhancedDynamicPricingDialog: React.FC<EnhancedDynamicPricingDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  product
}) => {
  const [settings, setSettings] = useState({
    enabled: false,
    minPrice: product.currentPrice * 0.7,
    maxPrice: product.currentPrice * 1.3,
    strategy: 'ai-optimized',
    automaticAdjustment: true,
    competitorTracking: true,
    demandSensitivity: 'medium',
    timeBasedPricing: false,
    inventoryBasedPricing: true
  });

  const [aiInsights, setAiInsights] = useState({
    recommendedPrice: 0,
    priceChangeReason: '',
    expectedImpact: '',
    confidence: 0,
    marketTrend: 'stable' as 'up' | 'down' | 'stable'
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Generate AI insights when dialog opens
  useEffect(() => {
    if (isOpen) {
      generateAiInsights();
    }
  }, [isOpen, product]);

  const generateAiInsights = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock AI recommendations based on product data
    const mockInsights = {
      recommendedPrice: Math.round((product.currentPrice * (0.9 + Math.random() * 0.2)) * 100) / 100,
      priceChangeReason: Math.random() > 0.5 
        ? 'High demand detected in your area with limited competitor stock'
        : 'Market analysis suggests price optimization opportunity',
      expectedImpact: Math.random() > 0.5 
        ? '+15% sales volume, +8% revenue'
        : '+22% profit margin, stable volume',
      confidence: 75 + Math.floor(Math.random() * 20),
      marketTrend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'down' : 'stable'
    };
    
    setAiInsights(mockInsights);
    setIsAnalyzing(false);
  };

  const handleSave = () => {
    const enhancedSettings = {
      ...settings,
      aiInsights,
      lastUpdated: new Date().toISOString()
    };
    
    onSave(enhancedSettings);
    toast.success("AI Dynamic Pricing Configured", {
      description: "Your pricing strategy has been updated with AI optimization"
    });
  };

  const applyAiRecommendation = () => {
    setSettings(prev => ({
      ...prev,
      minPrice: aiInsights.recommendedPrice * 0.9,
      maxPrice: aiInsights.recommendedPrice * 1.1,
      enabled: true,
      strategy: 'ai-optimized'
    }));
    
    toast.success("AI Recommendation Applied", {
      description: `Price range updated to ₹${(aiInsights.recommendedPrice * 0.9).toFixed(2)} - ₹${(aiInsights.recommendedPrice * 1.1).toFixed(2)}`
    });
  };

  const getTrendIcon = () => {
    switch (aiInsights.marketTrend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Target className="h-4 w-4 text-blue-500" />;
    }
  };

  const getConfidenceColor = () => {
    if (aiInsights.confidence >= 80) return 'text-green-600 bg-green-50';
    if (aiInsights.confidence >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-600" />
            AI Dynamic Pricing for "{product.name}"
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* AI Insights Card */}
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600" />
                AI Market Intelligence
                {isAnalyzing && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isAnalyzing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Recommended Price</span>
                        {getTrendIcon()}
                      </div>
                      <div className="text-2xl font-bold text-purple-700">
                        ₹{aiInsights.recommendedPrice.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-600">
                        Current: ₹{product.currentPrice}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-sm font-medium">AI Confidence</span>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getConfidenceColor()}`}>
                        {aiInsights.confidence}%
                      </div>
                      <div className="text-xs text-gray-600">
                        Market Trend: {aiInsights.marketTrend}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">AI Analysis</Label>
                      <p className="text-sm text-gray-700 mt-1">{aiInsights.priceChangeReason}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Expected Impact</Label>
                      <p className="text-sm text-green-700 mt-1">{aiInsights.expectedImpact}</p>
                    </div>
                  </div>

                  <Button 
                    onClick={applyAiRecommendation}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    Apply AI Recommendation
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-purple-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-purple-200 rounded w-1/2 mx-auto"></div>
                    <div className="h-4 bg-purple-200 rounded w-2/3 mx-auto"></div>
                  </div>
                  <p className="text-sm text-purple-600 mt-4">Analyzing market data...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pricing Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enable Dynamic Pricing */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enabled">Enable Dynamic Pricing</Label>
                  <p className="text-sm text-gray-500">Let AI automatically adjust prices based on market conditions</p>
                </div>
                <Switch
                  id="enabled"
                  checked={settings.enabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enabled: checked }))}
                />
              </div>

              {/* Price Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minPrice">Minimum Price (₹)</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    step="0.01"
                    value={settings.minPrice}
                    onChange={(e) => setSettings(prev => ({ ...prev, minPrice: parseFloat(e.target.value) || 0 }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="maxPrice">Maximum Price (₹)</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    step="0.01"
                    value={settings.maxPrice}
                    onChange={(e) => setSettings(prev => ({ ...prev, maxPrice: parseFloat(e.target.value) || 0 }))}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* AI Strategy */}
              <div>
                <Label htmlFor="strategy">Pricing Strategy</Label>
                <Select 
                  value={settings.strategy} 
                  onValueChange={(value) => setSettings(prev => ({ ...prev, strategy: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai-optimized">🤖 AI Optimized (Recommended)</SelectItem>
                    <SelectItem value="demand-based">📈 Demand Based</SelectItem>
                    <SelectItem value="competitor-based">🏪 Competitor Based</SelectItem>
                    <SelectItem value="inventory-based">📦 Inventory Based</SelectItem>
                    <SelectItem value="time-based">⏰ Time Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Settings */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Advanced AI Features</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Automatic Adjustments</Label>
                      <p className="text-xs text-gray-500">AI makes real-time price changes</p>
                    </div>
                    <Switch
                      checked={settings.automaticAdjustment}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, automaticAdjustment: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Competitor Tracking</Label>
                      <p className="text-xs text-gray-500">Monitor competitor prices</p>
                    </div>
                    <Switch
                      checked={settings.competitorTracking}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, competitorTracking: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Time-Based Pricing</Label>
                      <p className="text-xs text-gray-500">Adjust prices by time of day</p>
                    </div>
                    <Switch
                      checked={settings.timeBasedPricing}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, timeBasedPricing: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Inventory-Based</Label>
                      <p className="text-xs text-gray-500">Price based on stock levels</p>
                    </div>
                    <Switch
                      checked={settings.inventoryBasedPricing}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, inventoryBasedPricing: checked }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="demandSensitivity">Demand Sensitivity</Label>
                  <Select 
                    value={settings.demandSensitivity} 
                    onValueChange={(value) => setSettings(prev => ({ ...prev, demandSensitivity: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🐌 Low - Conservative adjustments</SelectItem>
                      <SelectItem value="medium">⚖️ Medium - Balanced approach</SelectItem>
                      <SelectItem value="high">🚀 High - Aggressive optimization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              <Bot className="h-4 w-4 mr-2" />
              Save AI Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedDynamicPricingDialog;
