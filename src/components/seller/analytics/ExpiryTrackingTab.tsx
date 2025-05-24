
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, AlertTriangle, Clock, Package, TrendingUp, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ExpiryItem {
  id: string;
  name: string;
  currentStock: number;
  expiryDate: string;
  daysUntilExpiry: number;
  aiRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  aiRecommendation: string;
  aiPredictedSalesRate: number;
  category: string;
  batchNumber?: string;
}

const ExpiryTrackingTab: React.FC = () => {
  const [expiryItems, setExpiryItems] = useState<ExpiryItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState({
    totalAtRisk: 0,
    potentialLoss: 0,
    recommendedActions: [] as string[]
  });

  // Mock AI-generated expiry data
  useEffect(() => {
    generateMockExpiryData();
  }, []);

  const generateMockExpiryData = () => {
    const mockItems: ExpiryItem[] = [
      {
        id: '1',
        name: 'Organic Milk 1L',
        currentStock: 45,
        expiryDate: '2024-06-02',
        daysUntilExpiry: 3,
        aiRiskLevel: 'critical',
        aiRecommendation: 'Immediate 40% discount recommended. AI predicts 80% sales boost.',
        aiPredictedSalesRate: 15,
        category: 'Dairy',
        batchNumber: 'OM240525'
      },
      {
        id: '2',
        name: 'Fresh Bread Loaves',
        currentStock: 28,
        expiryDate: '2024-06-01',
        daysUntilExpiry: 2,
        aiRiskLevel: 'critical',
        aiRecommendation: 'Bundle with other items. AI suggests buy-2-get-1 offer.',
        aiPredictedSalesRate: 22,
        category: 'Bakery',
        batchNumber: 'FB240524'
      },
      {
        id: '3',
        name: 'Yogurt Cups (12 pack)',
        currentStock: 67,
        expiryDate: '2024-06-08',
        daysUntilExpiry: 9,
        aiRiskLevel: 'medium',
        aiRecommendation: 'Monitor closely. Consider 15% discount in 3 days.',
        aiPredictedSalesRate: 8,
        category: 'Dairy'
      },
      {
        id: '4',
        name: 'Fruit Salad Mix',
        currentStock: 23,
        expiryDate: '2024-06-05',
        daysUntilExpiry: 6,
        aiRiskLevel: 'medium',
        aiRecommendation: 'Cross-promote with lunch items. AI predicts 25% increase.',
        aiPredictedSalesRate: 4,
        category: 'Fresh Produce'
      },
      {
        id: '5',
        name: 'Canned Soup Variety',
        currentStock: 156,
        expiryDate: '2025-03-15',
        daysUntilExpiry: 258,
        aiRiskLevel: 'low',
        aiRecommendation: 'Stable inventory. Consider bulk pricing for quantity sales.',
        aiPredictedSalesRate: 2,
        category: 'Canned Goods'
      }
    ];

    setExpiryItems(mockItems);
    
    // Calculate AI insights
    const totalAtRisk = mockItems.filter(item => 
      item.aiRiskLevel === 'critical' || item.aiRiskLevel === 'high'
    ).reduce((sum, item) => sum + item.currentStock, 0);
    
    const potentialLoss = mockItems
      .filter(item => item.aiRiskLevel === 'critical')
      .reduce((sum, item) => sum + (item.currentStock * 2.5), 0); // Estimate ₹2.5 per unit
    
    setAiInsights({
      totalAtRisk,
      potentialLoss,
      recommendedActions: [
        'Apply dynamic pricing to 73 critical items',
        'Create bundle offers for dairy products',
        'Increase marketing for items expiring in 2-3 days',
        'Contact bulk buyers for surplus inventory'
      ]
    });
  };

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("AI Analysis Complete", {
      description: "Updated recommendations and risk levels based on sales patterns"
    });
    
    // Update some recommendations to simulate AI learning
    setExpiryItems(prev => prev.map(item => ({
      ...item,
      aiRecommendation: item.aiRiskLevel === 'critical' 
        ? `Enhanced AI recommendation: ${item.aiRecommendation} (Updated)`
        : item.aiRecommendation
    })));
    
    setIsAnalyzing(false);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'default';
    }
  };

  const getUrgencyProgress = (days: number) => {
    if (days <= 2) return 95;
    if (days <= 5) return 70;
    if (days <= 10) return 40;
    return 10;
  };

  return (
    <div className="space-y-6">
      {/* AI Insights Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Items at Risk</p>
                <p className="text-2xl font-bold text-orange-700">{aiInsights.totalAtRisk}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Potential Loss</p>
                <p className="text-2xl font-bold text-red-700">₹{aiInsights.potentialLoss}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">AI Recommendations</p>
                <p className="text-2xl font-bold text-blue-700">{aiInsights.recommendedActions.length}</p>
              </div>
              <Bot className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis Controls */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-600" />
            AI Expiry Intelligence
          </CardTitle>
          <Button 
            onClick={handleAiAnalysis}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Bot className="h-4 w-4 mr-2" />
                Run AI Analysis
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Recommended Actions:</h4>
            {aiInsights.recommendedActions.map((action, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                {action}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expiry Items List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Expiry Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expiryItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4 bg-gradient-to-r from-white to-gray-50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <Badge variant={getRiskBadgeColor(item.aiRiskLevel)}>
                        {item.aiRiskLevel}
                      </Badge>
                      {item.batchNumber && (
                        <span className="text-xs text-gray-500">#{item.batchNumber}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        Stock: {item.currentStock}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Expires: {item.expiryDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.daysUntilExpiry} days left
                      </span>
                    </div>
                  </div>
                </div>

                {/* Urgency Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Urgency Level</span>
                    <span>{getUrgencyProgress(item.daysUntilExpiry)}%</span>
                  </div>
                  <Progress 
                    value={getUrgencyProgress(item.daysUntilExpiry)} 
                    className="h-2"
                  />
                </div>

                {/* AI Recommendation */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-md border border-purple-200">
                  <div className="flex items-start gap-2">
                    <Bot className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-purple-700 mb-1">AI Recommendation</p>
                      <p className="text-sm text-purple-800">{item.aiRecommendation}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className="text-purple-600">
                          Predicted daily sales: {item.aiPredictedSalesRate} units
                        </span>
                        <span className="text-purple-600">
                          Category: {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpiryTrackingTab;
