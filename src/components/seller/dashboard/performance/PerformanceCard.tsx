
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';
import TrustScoreDisplay from './TrustScoreDisplay';
import VerifiedDocuments from './VerifiedDocuments';
import PerformanceMetrics from './PerformanceMetrics';
import TrustScoreGoal from './TrustScoreGoal';
import DocumentUploadDialog from './DocumentUploadDialog';

interface PerformanceCardProps {
  trustScore?: number;
  verified?: boolean;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({ trustScore = 0, verified = false }) => {
  const [aiTrustScore, setAiTrustScore] = useState(trustScore);
  const [documentsVerified, setDocumentsVerified] = useState<Array<{
    type: string;
    documentNumber: string;
    confidence: number;
    verifiedAt: string;
  }>>([]);

  const handleDocumentVerified = (documentType: string, trustIncrease: number, verificationData: any) => {
    const newTrustScore = Math.min(5.0, aiTrustScore + trustIncrease);
    setAiTrustScore(newTrustScore);
    setDocumentsVerified(prev => [...prev, {
      type: documentType,
      documentNumber: verificationData.documentNumber,
      confidence: verificationData.confidence,
      verifiedAt: verificationData.verifiedAt
    }]);
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            AI Trust Score
          </span>
          <DocumentUploadDialog onDocumentVerified={handleDocumentVerified} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TrustScoreDisplay 
          aiTrustScore={aiTrustScore} 
          documentsVerified={documentsVerified} 
        />
        
        <VerifiedDocuments documentsVerified={documentsVerified} />
        
        <PerformanceMetrics 
          documentsVerified={documentsVerified}
          aiTrustScore={aiTrustScore}
          verified={verified}
        />

        <TrustScoreGoal aiTrustScore={aiTrustScore} />
      </CardContent>
    </Card>
  );
};

export default PerformanceCard;
