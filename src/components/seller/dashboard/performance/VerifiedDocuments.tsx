
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VerifiedDocumentsProps {
  documentsVerified: string[];
}

const VerifiedDocuments: React.FC<VerifiedDocumentsProps> = ({ documentsVerified }) => {
  if (documentsVerified.length === 0) return null;

  return (
    <div className="bg-green-50 p-3 rounded-md border border-green-200">
      <h4 className="font-medium text-green-800 mb-2">AI Verified Documents</h4>
      <div className="flex flex-wrap gap-2">
        {documentsVerified.map((doc, index) => (
          <Badge key={index} variant="outline" className="text-green-700 border-green-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            {doc}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default VerifiedDocuments;
