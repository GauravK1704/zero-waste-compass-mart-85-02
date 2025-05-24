
import React from 'react';

interface VerifiedDocument {
  type: string;
  documentNumber: string;
  confidence: number;
  verifiedAt: string;
}

interface PerformanceMetricsProps {
  documentsVerified: VerifiedDocument[];
  aiTrustScore: number;
  verified: boolean;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ 
  documentsVerified, 
  aiTrustScore, 
  verified 
}) => {
  const getVerificationStatus = () => {
    if (documentsVerified.length >= 3) return 'Complete';
    if (documentsVerified.length > 0) return 'Partial';
    return 'Pending';
  };

  const getAIConfidenceLevel = () => {
    if (aiTrustScore >= 4) return 'Very High';
    if (aiTrustScore >= 3) return 'High';
    if (aiTrustScore >= 2) return 'Medium';
    return 'Low';
  };

  const getComplianceStatus = () => {
    if (aiTrustScore >= 4 && documentsVerified.length >= 3) return 'Fully Compliant';
    if (aiTrustScore >= 3 || documentsVerified.length >= 2) return 'Mostly Compliant';
    return 'Needs Improvement';
  };

  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Document Verification</span>
        <span className="font-medium">{getVerificationStatus()}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">AI Confidence</span>
        <span className="font-medium">{getAIConfidenceLevel()}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Business Verification</span>
        <span className="font-medium">{verified ? 'Verified' : 'Pending'}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Compliance Status</span>
        <span className="font-medium">{getComplianceStatus()}</span>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
