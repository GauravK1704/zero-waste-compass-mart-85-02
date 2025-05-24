
import React from 'react';
import { Target } from 'lucide-react';

interface TrustScoreGoalProps {
  aiTrustScore: number;
}

const TrustScoreGoal: React.FC<TrustScoreGoalProps> = ({ aiTrustScore }) => {
  return (
    <div className="pt-2 border-t border-purple-100">
      <div className="flex items-center gap-2 text-sm text-purple-700">
        <Target className="h-4 w-4" />
        <span>
          {aiTrustScore >= 4.5 
            ? 'Excellent trust score! You have maximum seller benefits.' 
            : `Upload ${Math.ceil((4.5 - aiTrustScore) / 0.8)} more documents to reach excellent status`}
        </span>
      </div>
    </div>
  );
};

export default TrustScoreGoal;
