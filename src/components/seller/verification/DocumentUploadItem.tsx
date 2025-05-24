
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Upload, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

interface DocumentType {
  id: string;
  name: string;
  required: boolean;
  trustScoreValue: number;
  uploaded: boolean;
  fileName?: string;
  verified?: boolean;
}

interface DocumentUploadItemProps {
  document: DocumentType;
  isAiProcessing: boolean;
  onFileInputClick: (documentId: string) => void;
  onFileChange: (documentId: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const DocumentUploadItem: React.FC<DocumentUploadItemProps> = ({
  document,
  isAiProcessing,
  onFileInputClick,
  onFileChange,
  fileInputRef
}) => {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3 relative">
      {isAiProcessing && (
        <div className="absolute inset-0 bg-blue-50 bg-opacity-50 flex items-center justify-center rounded-lg">
          <div className="flex items-center gap-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">AI Verifying...</span>
          </div>
        </div>
      )}
      
      <div className="flex items-center">
        <FileText className="h-5 w-5 text-muted-foreground mr-2" />
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{document.name}</p>
            {document.verified && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full"
              >
                <Bot className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">AI Verified</span>
              </motion.div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {document.required ? "Required" : "Optional"} • +{document.trustScoreValue.toFixed(1)} trust score
          </p>
          {document.fileName && (
            <p className="text-xs text-green-600">{document.fileName}</p>
          )}
        </div>
      </div>
      
      <div>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => onFileChange(document.id, e)}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        />
        {document.uploaded ? (
          <Button
            variant="outline" 
            size="sm"
            className="flex items-center text-emerald-600 border-emerald-600"
            type="button"
            onClick={() => onFileInputClick(document.id)}
          >
            <Upload className="h-4 w-4 mr-1" /> Change
          </Button>
        ) : (
          <Button
            variant="outline" 
            size="sm"
            className="flex items-center"
            type="button"
            onClick={() => onFileInputClick(document.id)}
          >
            <Upload className="h-4 w-4 mr-1" /> Browse
          </Button>
        )}
      </div>
    </div>
  );
};

export default DocumentUploadItem;
