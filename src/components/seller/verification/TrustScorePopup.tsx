
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface TrustScorePopupProps {
  show: boolean;
  trustScoreGained: number;
}

const TrustScorePopup: React.FC<TrustScorePopupProps> = ({ show, trustScoreGained }) => {
  if (!show) return null;

  return (
    <motion.div
      className="fixed top-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-green-300 z-50"
      initial={{ opacity: 0, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <div className="flex items-center gap-3">
        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
          <Check className="h-5 w-5 text-green-600 dark:text-green-300" />
        </div>
        <div>
          <h4 className="font-medium">Trust Score Updated</h4>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            New Score: {trustScoreGained.toFixed(1)}/5.0
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TrustScorePopup;
