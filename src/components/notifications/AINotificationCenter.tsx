
import React, { useState, useEffect } from 'react';
import { Bell, Bot, AlertTriangle, Clock, TrendingUp, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { AINotification } from '@/types';

const AINotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<AINotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Generate AI-powered notifications based on business patterns
  const generateAINotifications = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockNotifications: AINotification[] = [
      {
        id: '1',
        type: 'expiry_alert',
        title: 'Critical Expiry Alert',
        message: 'AI detected 45 units of Organic Milk expiring in 2 days. Predicted loss: ₹1,125',
        aiConfidence: 0.95,
        priority: 'critical',
        actionable: true,
        suggestedActions: [
          'Apply 30% discount immediately',
          'Create bundle offers with cereals',
          'Contact bulk buyers'
        ],
        relatedProductId: 'prod_milk_001',
        expiryDate: '2024-06-02',
        daysUntilExpiry: 2,
        predictedImpact: 'High revenue loss without immediate action',
        createdAt: new Date(),
        read: false
      },
      {
        id: '2',
        type: 'stock_low',
        title: 'Smart Restock Alert',
        message: 'AI predicts Fresh Bread stock will run out in 18 hours based on current sales velocity',
        aiConfidence: 0.88,
        priority: 'high',
        actionable: true,
        suggestedActions: [
          'Order 50 units from Artisan Bakery',
          'Increase price by 5% to slow demand',
          'Enable pre-orders for tomorrow'
        ],
        relatedProductId: 'prod_bread_002',
        predictedImpact: 'Potential stockout and lost sales',
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        read: false
      },
      {
        id: '3',
        type: 'price_change',
        title: 'Dynamic Pricing Opportunity',
        message: 'AI recommends 15% price increase for Yogurt Cups based on market demand surge',
        aiConfidence: 0.82,
        priority: 'medium',
        actionable: true,
        suggestedActions: [
          'Implement gradual 15% price increase',
          'Monitor competitor pricing',
          'Prepare marketing for premium positioning'
        ],
        relatedProductId: 'prod_yogurt_003',
        predictedImpact: '23% revenue increase potential',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false
      },
      {
        id: '4',
        type: 'expiry_alert',
        title: 'Expiry Pattern Detected',
        message: 'AI identified recurring waste pattern: Fruit Salad consistently expires on Mondays',
        aiConfidence: 0.91,
        priority: 'medium',
        actionable: true,
        suggestedActions: [
          'Reduce Monday orders by 20%',
          'Create weekend promotions',
          'Implement Saturday discounts'
        ],
        relatedProductId: 'prod_fruit_004',
        predictedImpact: 'Reduce weekly waste by 30%',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        read: true
      },
      {
        id: '5',
        type: 'compliance_alert',
        title: 'Quality Compliance Alert',
        message: 'AI detected temperature fluctuation in dairy section. Immediate attention required.',
        aiConfidence: 0.96,
        priority: 'critical',
        actionable: true,
        suggestedActions: [
          'Check refrigeration system immediately',
          'Move products to backup cooler',
          'Contact maintenance service'
        ],
        predictedImpact: 'Prevent product spoilage and compliance issues',
        createdAt: new Date(Date.now() - 1000 * 60 * 10), // 10 mins ago
        read: false
      }
    ];
    
    setNotifications(mockNotifications);
    setIsAnalyzing(false);
    
    toast.success('AI Analysis Complete', {
      description: `Generated ${mockNotifications.length} intelligent notifications based on your business patterns`
    });
  };

  useEffect(() => {
    // Auto-generate notifications on component mount
    generateAINotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => n.priority === 'critical' && !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'expiry_alert': return <Clock className="h-4 w-4" />;
      case 'stock_low': return <Package className="h-4 w-4" />;
      case 'price_change': return <TrendingUp className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative notification-bell rounded-full group"
            aria-label="AI Notifications"
          >
            <motion.div
              animate={criticalCount > 0 ? { rotate: [0, 10, -10, 0] } : {}}
              transition={{ duration: 0.5, repeat: criticalCount > 0 ? Infinity : 0, repeatDelay: 3 }}
            >
              <Bell className="h-5 w-5" />
            </motion.div>
            
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
            
            {criticalCount > 0 && (
              <div className="absolute -top-1 -left-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </Button>
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-600" />
              AI-Powered Notifications
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={generateAINotifications}
                disabled={isAnalyzing}
                className="text-purple-600 border-purple-200"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Bot className="h-4 w-4 mr-1" />
                    Refresh AI
                  </>
                )}
              </Button>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {isAnalyzing ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">AI analyzing your business patterns...</p>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No AI notifications available</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`cursor-pointer transition-all hover:shadow-md ${!notification.read ? 'bg-blue-50 border-blue-200' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(notification.type)}
                        <h4 className="font-medium">{notification.title}</h4>
                        <Badge className={`text-xs ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Bot className="h-3 w-3 mr-1" />
                          {(notification.aiConfidence * 100).toFixed(0)}% confident
                        </Badge>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs"
                          >
                            Mark read
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-3">{notification.message}</p>
                    
                    {notification.daysUntilExpiry !== undefined && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Days until expiry</span>
                          <span>{notification.daysUntilExpiry} days</span>
                        </div>
                        <Progress 
                          value={Math.max(0, (7 - notification.daysUntilExpiry) / 7 * 100)} 
                          className="h-2"
                        />
                      </div>
                    )}
                    
                    {notification.predictedImpact && (
                      <div className="bg-yellow-50 p-2 rounded-md mb-3 border border-yellow-200">
                        <p className="text-xs text-yellow-800">
                          <strong>Predicted Impact:</strong> {notification.predictedImpact}
                        </p>
                      </div>
                    )}
                    
                    {notification.suggestedActions && notification.suggestedActions.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-2">AI Recommended Actions:</p>
                        <ul className="space-y-1">
                          {notification.suggestedActions.map((action, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                              <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                      <span className="text-xs text-gray-500">
                        {notification.createdAt.toLocaleTimeString()}
                      </span>
                      {notification.actionable && (
                        <Button size="sm" variant="outline" className="text-xs">
                          Take Action
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AINotificationCenter;
