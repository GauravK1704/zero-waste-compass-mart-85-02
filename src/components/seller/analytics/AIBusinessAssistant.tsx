
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Bot, TrendingUp, AlertTriangle, Lightbulb, Target, BarChart3, Users, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { businessAnalytics, BusinessMetrics, BusinessInsight } from '@/services/businessAnalytics';
import { toast } from 'sonner';

const AIBusinessAssistant: React.FC = () => {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<BusinessInsight | null>(null);

  useEffect(() => {
    loadBusinessData();
  }, []);

  const loadBusinessData = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const businessMetrics = businessAnalytics.generateBusinessMetrics();
    const businessInsights = businessAnalytics.generatePersonalizedInsights(businessMetrics);
    const aiRecommendations = businessAnalytics.generateAIRecommendations(businessMetrics);
    
    setMetrics(businessMetrics);
    setInsights(businessInsights);
    setRecommendations(aiRecommendations);
    setIsAnalyzing(false);
    
    toast.success("AI Business Analysis Complete", {
      description: `Generated ${businessInsights.length} insights and ${aiRecommendations.length} recommendations`
    });
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'recommendation': return <Lightbulb className="h-4 w-4" />;
      case 'trend': return <BarChart3 className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-red-100 text-red-800 border-red-200';
      case 'recommendation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'trend': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isAnalyzing) {
    return (
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardContent className="p-8">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mx-auto mb-4"
            >
              <Bot className="h-16 w-16 text-purple-600" />
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              AI is Analyzing Your Business Patterns
            </h3>
            <p className="text-gray-600 mb-4">
              Processing sales data, customer behavior, and market trends...
            </p>
            <Progress value={75} className="w-64 mx-auto" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Business Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">₹{metrics.totalRevenue.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Orders</p>
                  <p className="text-2xl font-bold text-blue-600">{metrics.totalOrders.toLocaleString()}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold text-purple-600">₹{metrics.averageOrderValue.toFixed(0)}</p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Retention Rate</p>
                  <p className="text-2xl font-bold text-orange-600">{metrics.customerRetentionRate}%</p>
                </div>
                <Users className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Insights and Recommendations */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-600" />
            AI Business Intelligence Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="insights" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="insights">Business Insights</TabsTrigger>
              <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
              <TabsTrigger value="products">Product Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="insights" className="space-y-4">
              <div className="grid gap-4">
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`border-l-4 cursor-pointer hover:shadow-md transition-shadow ${
                      insight.type === 'opportunity' ? 'border-l-green-500' :
                      insight.type === 'warning' ? 'border-l-red-500' :
                      insight.type === 'recommendation' ? 'border-l-blue-500' : 'border-l-purple-500'
                    }`} onClick={() => setSelectedInsight(insight)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getInsightIcon(insight.type)}
                              <h4 className="font-semibold">{insight.title}</h4>
                              <Badge className={getInsightColor(insight.type)}>
                                {insight.impact} impact
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-gray-700">Action Items:</p>
                              {insight.actionItems.slice(0, 2).map((action, i) => (
                                <p key={i} className="text-xs text-gray-600">• {action}</p>
                              ))}
                              {insight.actionItems.length > 2 && (
                                <p className="text-xs text-blue-600">+{insight.actionItems.length - 2} more actions</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="recommendations" className="space-y-4">
              <div className="space-y-3">
                {recommendations.map((recommendation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                  >
                    <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-800 mb-1">AI Recommendation #{index + 1}</p>
                      <p className="text-sm text-blue-700">{recommendation}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="products" className="space-y-4">
              {metrics && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800">Top Performing Products</h4>
                  {metrics.topSellingProducts.map((product, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium">{product.name}</h5>
                            <p className="text-sm text-gray-600">{product.sales} units sold</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">₹{product.revenue.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">
                              {((product.revenue / metrics.totalRevenue) * 100).toFixed(1)}% of revenue
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Refresh Analysis Button */}
      <div className="flex justify-center">
        <Button 
          onClick={loadBusinessData}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          <Bot className="h-4 w-4 mr-2" />
          Refresh AI Analysis
        </Button>
      </div>
    </div>
  );
};

export default AIBusinessAssistant;
