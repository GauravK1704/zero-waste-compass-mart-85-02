
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, TrendingUp, Clock, Star, Bot, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const CustomerInsightsTab: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock customer data
  const customerSegments = [
    { name: 'Regular Customers', value: 45, color: '#8B5CF6' },
    { name: 'New Customers', value: 30, color: '#06B6D4' },
    { name: 'Premium Customers', value: 15, color: '#F59E0B' },
    { name: 'Inactive Customers', value: 10, color: '#EF4444' }
  ];

  const customerBehavior = [
    { day: 'Mon', visits: 120, purchases: 45, avgSpent: 250 },
    { day: 'Tue', visits: 140, purchases: 52, avgSpent: 280 },
    { day: 'Wed', visits: 135, purchases: 48, avgSpent: 265 },
    { day: 'Thu', visits: 160, purchases: 58, avgSpent: 310 },
    { day: 'Fri', visits: 180, purchases: 72, avgSpent: 340 },
    { day: 'Sat', visits: 220, purchases: 85, avgSpent: 380 },
    { day: 'Sun', visits: 190, purchases: 68, avgSpent: 295 }
  ];

  const topCustomers = [
    { id: 1, name: 'Rahul Sharma', totalSpent: 12500, orders: 24, lastOrder: '2 days ago', segment: 'Premium' },
    { id: 2, name: 'Priya Patel', totalSpent: 9800, orders: 18, lastOrder: '1 day ago', segment: 'Regular' },
    { id: 3, name: 'Amit Kumar', totalSpent: 8200, orders: 15, lastOrder: '3 days ago', segment: 'Regular' },
    { id: 4, name: 'Sneha Gupta', totalSpent: 7500, orders: 12, lastOrder: '1 week ago', segment: 'Regular' },
    { id: 5, name: 'Vikash Singh', totalSpent: 6800, orders: 11, lastOrder: '4 days ago', segment: 'New' }
  ];

  const aiInsights = [
    {
      title: "Peak Shopping Hours",
      description: "Most customers shop between 6-8 PM on weekdays",
      confidence: 94,
      recommendation: "Consider running flash sales during these hours"
    },
    {
      title: "Customer Retention",
      description: "Premium customers have 85% repeat purchase rate",
      confidence: 92,
      recommendation: "Create loyalty programs for regular customers"
    },
    {
      title: "Seasonal Trends",
      description: "Grocery demand increases 40% during festival seasons",
      confidence: 88,
      recommendation: "Stock up on essentials 2 weeks before major festivals"
    }
  ];

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Customer Analysis Complete", {
      description: "Updated customer insights and behavior patterns"
    });
    
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      {/* Customer Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Customers</p>
                <p className="text-2xl font-bold text-blue-700">1,247</p>
                <p className="text-xs text-blue-500">+12% this month</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Avg. Order Value</p>
                <p className="text-2xl font-bold text-green-700">₹315</p>
                <p className="text-xs text-green-500">+8% this month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Customer Rating</p>
                <p className="text-2xl font-bold text-purple-700">4.8</p>
                <p className="text-xs text-purple-500">Based on 892 reviews</p>
              </div>
              <Star className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Retention Rate</p>
                <p className="text-2xl font-bold text-orange-700">78%</p>
                <p className="text-xs text-orange-500">+5% this month</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis Controls */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-600" />
            AI Customer Intelligence
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
                <Eye className="h-4 w-4 mr-2" />
                Analyze Customer Behavior
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-medium text-purple-800 mb-2">{insight.title}</h4>
                <p className="text-sm text-purple-700 mb-2">{insight.description}</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-purple-600">Confidence:</span>
                  <Progress value={insight.confidence} className="h-1 flex-1" />
                  <span className="text-xs text-purple-600">{insight.confidence}%</span>
                </div>
                <p className="text-xs text-purple-600 italic">{insight.recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Segments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerSegments}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {customerSegments.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {customerSegments.map((segment, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: segment.color }}
                  ></div>
                  <span className="text-sm">{segment.name}: {segment.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Customer Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customerBehavior}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visits" fill="#8B5CF6" name="Visits" />
                  <Bar dataKey="purchases" fill="#06B6D4" name="Purchases" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCustomers.map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{customer.name}</h4>
                    <p className="text-sm text-gray-600">{customer.orders} orders • Last order: {customer.lastOrder}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={customer.segment === 'Premium' ? 'default' : 'secondary'}>
                    {customer.segment}
                  </Badge>
                  <div className="text-right">
                    <p className="font-bold text-lg">₹{customer.totalSpent.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Total Spent</p>
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

export default CustomerInsightsTab;
