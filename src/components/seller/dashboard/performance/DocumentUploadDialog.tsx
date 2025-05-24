
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, Bot } from 'lucide-react';
import DocumentUploadForm from './DocumentUploadForm';

interface DocumentUploadDialogProps {
  onDocumentVerified: (documentType: string, trustIncrease: number) => void;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({ onDocumentVerified }) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  return (
    <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-purple-600 border-purple-200 hover:bg-purple-50">
          <Upload className="h-4 w-4 mr-1" />
          Verify Documents
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-600" />
            AI Document Verification
          </DialogTitle>
        </DialogHeader>
        
        <DocumentUploadForm 
          onDocumentVerified={onDocumentVerified}
          onClose={() => setUploadDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
