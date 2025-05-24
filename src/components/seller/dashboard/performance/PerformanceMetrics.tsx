
import React from 'react';

interface PerformanceMetricsProps {
  documentsVerified: string[];
  aiTrustScore: number;
  verified: boolean;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ 
  documentsVerified, 
  aiTrustScore, 
  verified 
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Document Verification</span>
        <span className="font-medium">{documentsVerified.length > 0 ? 'Complete' : 'Pending'}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">AI Confidence</span>
        <span className="font-medium">{aiTrustScore >= 4 ? 'High' : aiTrustScore >= 3 ? 'Medium' : 'Low'}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Business Verification</span>
        <span className="font-medium">{verified ? 'Verified' : 'Pending'}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Compliance Status</span>
        <span className="font-medium">{aiTrustScore >= 3.5 ? 'Compliant' : 'Needs Review'}</span>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
