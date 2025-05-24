
import React from 'react';
import { Bot, Check, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface VerificationHeaderProps {
  trustScoreGained: number;
}

const VerificationHeader: React.FC<VerificationHeaderProps> = ({ trustScoreGained }) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Bot className="h-4 w-4 text-purple-600" />
        AI-Powered Document Verification
      </h3>
      <p className="text-xs text-gray-500 mt-1">
        Upload documents for instant AI verification and immediate trust score updates
      </p>
      {trustScoreGained > 0 && (
        <motion.div 
          className="text-sm text-green-600 font-medium mt-2 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Check className="h-4 w-4" />
          <span>Trust score increased by {trustScoreGained.toFixed(1)} points</span>
          <Zap className="h-4 w-4 text-yellow-500" />
        </motion.div>
      )}
    </div>
  );
};

export default VerificationHeader;
