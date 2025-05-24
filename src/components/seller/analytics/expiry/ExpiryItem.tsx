
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Package, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

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

interface ExpiryItemCardProps {
  item: ExpiryItem;
  index: number;
}

const ExpiryItemCard: React.FC<ExpiryItemCardProps> = ({ item, index }) => {
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
    <motion.div
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
  );
};

export default ExpiryItemCard;
