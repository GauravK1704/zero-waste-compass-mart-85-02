import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Bot } from 'lucide-react';
import { toast } from 'sonner';
import ExpiryInsights from './expiry/ExpiryInsights';
import ExpiryItemCard from './expiry/ExpiryItem';

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
    
    const totalAtRisk = mockItems.filter(item => 
      item.aiRiskLevel === 'critical' || item.aiRiskLevel === 'high'
    ).reduce((sum, item) => sum + item.currentStock, 0);
    
    const potentialLoss = mockItems
      .filter(item => item.aiRiskLevel === 'critical')
      .reduce((sum, item) => sum + (item.currentStock * 2.5), 0);
    
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
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("AI Analysis Complete", {
      description: "Updated recommendations and risk levels based on sales patterns"
    });
    
    setExpiryItems(prev => prev.map(item => ({
      ...item,
      aiRecommendation: item.aiRiskLevel === 'critical' 
        ? `Enhanced AI recommendation: ${item.aiRecommendation} (Updated)`
        : item.aiRecommendation
    })));
    
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <ExpiryInsights {...aiInsights} />

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
              <ExpiryItemCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpiryTrackingTab;
