
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatisticsTab } from '@/components/seller/analytics';
import ForecastTab from '@/components/seller/analytics/ForecastTab';
import ExportAnalyticsButton from '@/components/seller/analytics/ExportAnalyticsButton';
import ExpiryTrackingTab from '@/components/seller/analytics/ExpiryTrackingTab';
import CustomerInsightsTab from '@/components/seller/analytics/CustomerInsightsTab';
import InventoryOptimizationTab from '@/components/seller/analytics/InventoryOptimizationTab';
import AIBusinessAssistant from '@/components/seller/analytics/AIBusinessAssistant';
import { revenueData, inventoryForecastData } from '@/components/seller/analytics/mockData';
import { BarChart4, TrendingUp, Calendar, Bot, Users, Package2 } from 'lucide-react';

const Analytics = () => {
  const [selectedTab, setSelectedTab] = useState('statistics');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="p-4 md:p-6 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="flex justify-between items-center"
        variants={itemVariants}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Advanced Analytics Dashboard
        </h1>
        <ExportAnalyticsButton 
          data={selectedTab === 'statistics' ? revenueData : inventoryForecastData} 
          type={selectedTab as 'statistics' | 'forecast'} 
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="border-0 shadow-lg overflow-hidden profile-card">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              AI-Powered Business Intelligence
            </h2>
            <CardDescription>
              Comprehensive insights powered by artificial intelligence to optimize your business performance
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs 
              defaultValue="statistics" 
              value={selectedTab}
              onValueChange={setSelectedTab} 
              className="w-full"
            >
              <TabsList className="w-full bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 grid grid-cols-6 rounded-none">
                <TabsTrigger value="statistics" className="profile-tab">
                  <span className="flex items-center gap-1">
                    <BarChart4 size={16} />
                    Statistics
                  </span>
                </TabsTrigger>
                <TabsTrigger value="forecast" className="profile-tab">
                  <span className="flex items-center gap-1">
                    <TrendingUp size={16} />
                    Sales Forecast
                  </span>
                </TabsTrigger>
                <TabsTrigger value="expiry" className="profile-tab">
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    AI Expiry
                  </span>
                </TabsTrigger>
                <TabsTrigger value="customers" className="profile-tab">
                  <span className="flex items-center gap-1">
                    <Users size={16} />
                    Customer Insights
                  </span>
                </TabsTrigger>
                <TabsTrigger value="inventory" className="profile-tab">
                  <span className="flex items-center gap-1">
                    <Package2 size={16} />
                    Inventory AI
                  </span>
                </TabsTrigger>
                <TabsTrigger value="ai-insights" className="profile-tab">
                  <span className="flex items-center gap-1">
                    <Bot size={16} />
                    AI Assistant
                  </span>
                </TabsTrigger>
              </TabsList>
              
              <AnimatedTabContent value="statistics" currentTab={selectedTab}>
                <div className="p-4">
                  <StatisticsTab />
                </div>
              </AnimatedTabContent>
              
              <AnimatedTabContent value="forecast" currentTab={selectedTab}>
                <div className="p-4">
                  <ForecastTab />
                </div>
              </AnimatedTabContent>

              <AnimatedTabContent value="expiry" currentTab={selectedTab}>
                <div className="p-4">
                  <ExpiryTrackingTab />
                </div>
              </AnimatedTabContent>

              <AnimatedTabContent value="customers" currentTab={selectedTab}>
                <div className="p-4">
                  <CustomerInsightsTab />
                </div>
              </AnimatedTabContent>

              <AnimatedTabContent value="inventory" currentTab={selectedTab}>
                <div className="p-4">
                  <InventoryOptimizationTab />
                </div>
              </AnimatedTabContent>

              <AnimatedTabContent value="ai-insights" currentTab={selectedTab}>
                <div className="p-4">
                  <AIBusinessAssistant />
                </div>
              </AnimatedTabContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

// AnimatedTabContent component for smooth tab transitions
const AnimatedTabContent = ({ value, currentTab, children }: { value: string, currentTab: string, children: React.ReactNode }) => {
  return (
    <TabsContent value={value} className="m-0 p-0">
      {value === currentTab && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="profile-animate-in"
        >
          {children}
        </motion.div>
      )}
    </TabsContent>
  );
};

export default Analytics;
