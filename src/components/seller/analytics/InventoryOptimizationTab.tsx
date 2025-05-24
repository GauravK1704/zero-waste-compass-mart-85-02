
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Package2, TrendingDown, TrendingUp, AlertTriangle, Bot, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const InventoryOptimizationTab: React.FC = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Mock inventory data
  const inventoryHealth = [
    { category: 'Fruits & Vegetables', stock: 85, optimal: 90, trend: 'up', turnover: 12 },
    { category: 'Dairy Products', stock: 45, optimal: 80, trend: 'down', turnover: 8 },
    { category: 'Grains & Cereals', stock: 120, optimal: 100, trend: 'stable', turnover: 15 },
    { category: 'Snacks & Beverages', stock: 65, optimal: 75, trend: 'up', turnover: 18 },
    { category: 'Personal Care', stock: 30, optimal: 60, trend: 'down', turnover: 6 }
  ];

  const reorderAlerts = [
    { 
      item: 'Organic Milk 1L', 
      currentStock: 12, 
      reorderPoint: 20, 
      leadTime: '2 days',
      supplier: 'Fresh Dairy Co.',
      priority: 'high'
    },
    { 
      item: 'Basmati Rice 5kg', 
      currentStock: 8, 
      reorderPoint: 15, 
      leadTime: '1 week',
      supplier: 'Golden Grains Ltd.',
      priority: 'medium'
    },
    { 
      item: 'Cooking Oil 1L', 
      currentStock: 5, 
      reorderPoint: 12, 
      leadTime: '3 days',
      supplier: 'Pure Oil Industries',
      priority: 'high'
    }
  ];

  const optimizationSuggestions = [
    {
      category: 'Overstocked Items',
      items: ['Canned Tomatoes', 'Pasta Sauce', 'Frozen Peas'],
      action: 'Consider promotional offers to clear excess stock',
      impact: 'Reduce holding costs by ₹8,500',
      confidence: 92
    },
    {
      category: 'Fast Moving Items',
      items: ['Fresh Bread', 'Milk', 'Eggs'],
      action: 'Increase order frequency to prevent stockouts',
      impact: 'Increase revenue by ₹12,000/month',
      confidence: 88
    },
    {
      category: 'Seasonal Optimization',
      items: ['Ice Cream', 'Cold Drinks', 'Fresh Fruits'],
      action: 'Prepare for summer demand surge',
      impact: 'Capture additional ₹25,000 in seasonal sales',
      confidence: 85
    }
  ];

  const stockMovement = [
    { week: 'Week 1', inflow: 2500, outflow: 2200, netChange: 300 },
    { week: 'Week 2', inflow: 2800, outflow: 2400, netChange: 400 },
    { week: 'Week 3', inflow: 2200, outflow: 2600, netChange: -400 },
    { week: 'Week 4', inflow: 3200, outflow: 2800, netChange: 400 }
  ];

  const handleOptimization = async () => {
    setIsOptimizing(true);
    
    // Simulate AI optimization
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    toast.success("Inventory Optimization Complete", {
      description: "Generated new reorder recommendations and stock level optimizations"
    });
    
    setIsOptimizing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'default';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Inventory Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Total SKUs</p>
                <p className="text-2xl font-bold text-green-700">1,247</p>
                <p className="text-xs text-green-500">+15 new this week</p>
              </div>
              <Package2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Avg Turnover</p>
                <p className="text-2xl font-bold text-blue-700">12.5x</p>
                <p className="text-xs text-blue-500">Per year</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Reorder Alerts</p>
                <p className="text-2xl font-bold text-orange-700">{reorderAlerts.length}</p>
                <p className="text-xs text-orange-500">Items need attention</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Stock Value</p>
                <p className="text-2xl font-bold text-purple-700">₹2.8L</p>
                <p className="text-xs text-purple-500">Current inventory</p>
              </div>
              <Package2 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Optimization Controls */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-600" />
            AI Inventory Optimization Engine
          </CardTitle>
          <Button 
            onClick={handleOptimization}
            disabled={isOptimizing}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {isOptimizing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Optimizing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Run AI Optimization
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optimizationSuggestions.map((suggestion, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-purple-800">{suggestion.category}</h4>
                  <Badge variant="outline" className="text-purple-600">
                    {suggestion.confidence}% confidence
                  </Badge>
                </div>
                <p className="text-sm text-purple-700 mb-2">{suggestion.action}</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-purple-600">Items:</span>
                  <div className="flex gap-1">
                    {suggestion.items.map((item, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-sm font-medium text-green-700">{suggestion.impact}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Inventory Health and Stock Movement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Health Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inventoryHealth.map((category, index) => (
                <div key={index} className="p-3 bg-gradient-to-r from-white to-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{category.category}</span>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(category.trend)}
                      <span className="text-sm text-gray-600">{category.turnover}x/year</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500">Stock Level:</span>
                    <Progress 
                      value={(category.stock / category.optimal) * 100} 
                      className="h-2 flex-1"
                    />
                    <span className="text-xs text-gray-600">{category.stock}/{category.optimal}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stock Movement Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stockMovement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="inflow" stroke="#10B981" name="Inflow" strokeWidth={2} />
                  <Line type="monotone" dataKey="outflow" stroke="#EF4444" name="Outflow" strokeWidth={2} />
                  <Line type="monotone" dataKey="netChange" stroke="#8B5CF6" name="Net Change" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reorder Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Urgent Reorder Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reorderAlerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-gray-800">{alert.item}</h4>
                    <Badge variant={getPriorityColor(alert.priority)}>
                      {alert.priority} priority
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                    <span>Current: {alert.currentStock} units</span>
                    <span>Reorder at: {alert.reorderPoint} units</span>
                    <span>Lead time: {alert.leadTime}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Supplier: {alert.supplier}</p>
                </div>
                <Button size="sm" variant="outline" className="ml-4">
                  Create Order
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryOptimizationTab;
