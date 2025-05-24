
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, Bot } from 'lucide-react';

interface ExpiryInsightsProps {
  totalAtRisk: number;
  potentialLoss: number;
  recommendedActions: string[];
}

const ExpiryInsights: React.FC<ExpiryInsightsProps> = ({
  totalAtRisk,
  potentialLoss,
  recommendedActions
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Items at Risk</p>
              <p className="text-2xl font-bold text-orange-700">{totalAtRisk}</p>
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
              <p className="text-2xl font-bold text-red-700">₹{potentialLoss}</p>
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
              <p className="text-2xl font-bold text-blue-700">{recommendedActions.length}</p>
            </div>
            <Bot className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpiryInsights;
