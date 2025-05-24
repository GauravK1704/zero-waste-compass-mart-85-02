
import React from 'react';
import { CheckCircle, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VerifiedDocument {
  type: string;
  documentNumber: string;
  confidence: number;
  verifiedAt: string;
}

interface VerifiedDocumentsProps {
  documentsVerified: VerifiedDocument[];
}

const VerifiedDocuments: React.FC<VerifiedDocumentsProps> = ({ documentsVerified }) => {
  if (documentsVerified.length === 0) return null;

  const maskDocumentNumber = (docNumber: string, docType: string) => {
    if (docType === 'PAN Card') {
      return docNumber.slice(0, 3) + '***' + docNumber.slice(-2);
    }
    if (docType === 'Aadhar Card') {
      return docNumber.replace(/\d(?=\d{4})/g, '*');
    }
    return docNumber.slice(0, 4) + '***' + docNumber.slice(-3);
  };

  return (
    <div className="bg-green-50 p-4 rounded-md border border-green-200">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="h-4 w-4 text-green-600" />
        <h4 className="font-medium text-green-800">AI Verified Documents</h4>
      </div>
      <div className="space-y-2">
        {documentsVerified.map((doc, index) => (
          <div key={index} className="bg-white p-3 rounded border border-green-200">
            <div className="flex items-center justify-between mb-1">
              <Badge variant="outline" className="text-green-700 border-green-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                {doc.type}
              </Badge>
              <span className="text-xs text-green-600">
                {(doc.confidence * 100).toFixed(1)}% confidence
              </span>
            </div>
            <div className="text-xs text-gray-600">
              Doc: {maskDocumentNumber(doc.documentNumber, doc.type)}
              <span className="ml-2">
                Verified: {new Date(doc.verifiedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerifiedDocuments;
