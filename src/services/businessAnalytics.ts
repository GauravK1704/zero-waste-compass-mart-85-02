
interface BusinessMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  customerRetentionRate: number;
  topSellingProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  seasonalTrends: Array<{
    month: string;
    sales: number;
  }>;
  inventoryTurnover: number;
  profitMargin: number;
}

interface BusinessInsight {
  type: 'opportunity' | 'warning' | 'recommendation' | 'trend';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionItems: string[];
  metrics?: Record<string, number>;
}

class BusinessAnalyticsService {
  private static instance: BusinessAnalyticsService;

  private constructor() {}

  public static getInstance(): BusinessAnalyticsService {
    if (!BusinessAnalyticsService.instance) {
      BusinessAnalyticsService.instance = new BusinessAnalyticsService();
    }
    return BusinessAnalyticsService.instance;
  }

  // Generate mock business metrics (in real app, this would fetch from database)
  generateBusinessMetrics(): BusinessMetrics {
    return {
      totalRevenue: 125000,
      totalOrders: 2150,
      averageOrderValue: 58.14,
      customerRetentionRate: 68.5,
      topSellingProducts: [
        { name: "Organic Milk 1L", sales: 450, revenue: 22500 },
        { name: "Fresh Bread Loaves", sales: 380, revenue: 15200 },
        { name: "Yogurt Cups (12 pack)", sales: 320, revenue: 12800 },
        { name: "Fruit Salad Mix", sales: 290, revenue: 14500 },
        { name: "Canned Soup Variety", sales: 250, revenue: 8750 }
      ],
      seasonalTrends: [
        { month: "Jan", sales: 1800 },
        { month: "Feb", sales: 1950 },
        { month: "Mar", sales: 2100 },
        { month: "Apr", sales: 2300 },
        { month: "May", sales: 2450 },
        { month: "Jun", sales: 2200 }
      ],
      inventoryTurnover: 8.5,
      profitMargin: 23.8
    };
  }

  // AI-powered business insights
  generatePersonalizedInsights(metrics: BusinessMetrics): BusinessInsight[] {
    const insights: BusinessInsight[] = [];

    // Revenue trend analysis
    if (metrics.totalRevenue > 100000) {
      insights.push({
        type: 'opportunity',
        title: 'Strong Revenue Performance',
        description: 'Your revenue has exceeded $100K this quarter. Consider expanding your product range or increasing inventory for high-performing categories.',
        impact: 'high',
        actionItems: [
          'Analyze top-selling product categories for expansion opportunities',
          'Negotiate better supplier terms due to increased volume',
          'Consider premium product lines to increase margins'
        ],
        metrics: { revenueGrowth: 18.5, potentialIncrease: 25000 }
      });
    }

    // Customer retention insights
    if (metrics.customerRetentionRate < 70) {
      insights.push({
        type: 'warning',
        title: 'Customer Retention Below Target',
        description: `Your retention rate of ${metrics.customerRetentionRate}% is below the industry average of 75%. Focus on customer loyalty programs.`,
        impact: 'high',
        actionItems: [
          'Implement a loyalty points program',
          'Send personalized product recommendations',
          'Offer exclusive discounts to returning customers',
          'Improve customer service response times'
        ],
        metrics: { currentRate: metrics.customerRetentionRate, targetRate: 75 }
      });
    }

    // Inventory turnover analysis
    if (metrics.inventoryTurnover > 8) {
      insights.push({
        type: 'recommendation',
        title: 'Excellent Inventory Management',
        description: 'Your inventory turnover of 8.5x indicates efficient stock management. Consider just-in-time ordering for faster-moving items.',
        impact: 'medium',
        actionItems: [
          'Implement automated reordering for fast-moving products',
          'Reduce safety stock for high-turnover items',
          'Negotiate shorter delivery times with suppliers'
        ]
      });
    }

    // Seasonal trend insights
    const isGrowthTrend = metrics.seasonalTrends[5].sales > metrics.seasonalTrends[0].sales;
    if (isGrowthTrend) {
      insights.push({
        type: 'trend',
        title: 'Positive Sales Trajectory',
        description: 'Sales have been consistently growing. Prepare for increased demand in the next quarter.',
        impact: 'high',
        actionItems: [
          'Increase inventory levels by 20-30%',
          'Consider hiring additional staff',
          'Plan marketing campaigns for peak season',
          'Optimize supply chain for higher volumes'
        ]
      });
    }

    // Product performance insights
    const topProduct = metrics.topSellingProducts[0];
    insights.push({
      type: 'opportunity',
      title: `${topProduct.name} is Your Star Product`,
      description: `This product generates ${((topProduct.revenue / metrics.totalRevenue) * 100).toFixed(1)}% of your revenue. Consider expanding this product line.`,
      impact: 'medium',
      actionItems: [
        'Source similar products from the same supplier',
        'Create bundle offers with complementary items',
        'Increase marketing focus on this category',
        'Negotiate better pricing due to volume'
      ]
    });

    return insights;
  }

  // AI recommendations based on business patterns
  generateAIRecommendations(metrics: BusinessMetrics): string[] {
    const recommendations = [];

    // Dynamic pricing recommendations
    if (metrics.profitMargin < 25) {
      recommendations.push('Implement dynamic pricing: Increase prices by 3-5% on high-demand items during peak hours.');
    }

    // Inventory optimization
    const avgTurnover = metrics.inventoryTurnover;
    if (avgTurnover > 6) {
      recommendations.push('Optimize inventory: Your turnover rate suggests you can reduce stock levels by 15% without risking stockouts.');
    }

    // Customer segmentation
    recommendations.push('Customer segmentation: Create targeted campaigns for your top 20% customers who generate 80% of revenue.');

    // Seasonal preparation
    recommendations.push('Seasonal planning: Based on trends, increase dairy and fresh produce inventory by 25% for next month.');

    // Cross-selling opportunities
    recommendations.push('Cross-selling: Customers buying organic milk are 60% likely to buy fresh bread. Create bundle offers.');

    return recommendations;
  }
}

export const businessAnalytics = BusinessAnalyticsService.getInstance();
export type { BusinessMetrics, BusinessInsight };
