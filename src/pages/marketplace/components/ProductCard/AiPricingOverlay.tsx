
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, TrendingUp, TrendingDown } from 'lucide-react';

interface AiPricingData {
  recommendedPrice: number;
  priceChange: number;
  reason: string;
  confidence: number;
}

interface AiPricingOverlayProps {
  aiPricing: AiPricingData;
  showAiPricing: boolean;
}

export const AiPricingOverlay: React.FC<AiPricingOverlayProps> = ({ 
  aiPricing, 
  showAiPricing 
}) => {
  if (!showAiPricing) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute top-2 left-2 z-10 bg-gradient-to-r from-purple-500 to-blue-500 text-white p-2 rounded-lg text-xs shadow-lg"
    >
      <div className="flex items-center gap-1 mb-1">
        <Bot className="h-3 w-3" />
        <span className="font-bold">AI Price</span>
      </div>
      <div className="flex items-center gap-1">
        {aiPricing.priceChange > 0 ? (
          <TrendingUp className="h-3 w-3 text-green-300" />
        ) : (
          <TrendingDown className="h-3 w-3 text-red-300" />
        )}
        <span>₹{aiPricing.recommendedPrice}</span>
      </div>
      <div className="text-xs opacity-90">{aiPricing.reason}</div>
      <div className="text-xs opacity-75">Confidence: {aiPricing.confidence}%</div>
    </motion.div>
  );
};
