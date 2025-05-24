
import React from 'react';
import { Shield, Award, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface VerifiedDocument {
  type: string;
  documentNumber: string;
  confidence: number;
  verifiedAt: string;
}

interface TrustScoreDisplayProps {
  aiTrustScore: number;
  documentsVerified: VerifiedDocument[];
}

const TrustScoreDisplay: React.FC<TrustScoreDisplayProps> = ({ 
  aiTrustScore, 
  documentsVerified 
}) => {
  const getTrustScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 3.5) return 'text-blue-600';
    if (score >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrustScoreBadge = (score: number) => {
    if (score >= 4.5) return { text: 'Excellent', color: 'bg-green-100 text-green-800 border-green-200' };
    if (score >= 3.5) return { text: 'Good', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    if (score >= 2.5) return { text: 'Fair', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    return { text: 'Needs Improvement', color: 'bg-red-100 text-red-800 border-red-200' };
  };

  const averageConfidence = documentsVerified.length > 0 
    ? documentsVerified.reduce((sum, doc) => sum + doc.confidence, 0) / documentsVerified.length 
    : 0;

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`text-3xl font-bold ${getTrustScoreColor(aiTrustScore)}`}>
            {aiTrustScore.toFixed(1)}/5.0
          </span>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            <Badge className={getTrustScoreBadge(aiTrustScore).color}>
              {getTrustScoreBadge(aiTrustScore).text}
            </Badge>
          </div>
        </div>
        {documentsVerified.length > 0 && (
          <div className="text-right">
            <Badge className="bg-green-100 text-green-800 border-green-200 mb-1">
              <CheckCircle className="h-3 w-3 mr-1" />
              {documentsVerified.length} docs verified
            </Badge>
            <div className="text-xs text-gray-600">
              Avg. confidence: {(averageConfidence * 100).toFixed(1)}%
            </div>
          </div>
        )}
      </div>
      
      <Progress value={(aiTrustScore / 5) * 100} className="h-3" />
      
      <div className="text-xs text-gray-600 text-center">
        Trust Score based on AI-verified documents • Secure & Confidential
      </div>
    </>
  );
};

export default TrustScoreDisplay;
