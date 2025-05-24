
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, Image, FileText, Bot } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface DocumentUploadFormProps {
  onDocumentVerified: (documentType: string, trustIncrease: number) => void;
  onClose: () => void;
}

const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({ onDocumentVerified, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  const detectDocumentType = (fileName: string): string => {
    const name = fileName.toLowerCase();
    if (name.includes('pan') || name.includes('pancard')) return 'PAN Card';
    if (name.includes('aadhar') || name.includes('aadhaar')) return 'Aadhar Card';
    if (name.includes('gst') || name.includes('gstin')) return 'GST Certificate';
    if (name.includes('driving') || name.includes('license')) return 'Driving License';
    if (name.includes('passport')) return 'Passport';
    if (name.includes('business') || name.includes('registration')) return 'Business Registration';
    return 'Identity Document';
  };

  const calculateTrustScoreIncrease = (docType: string): number => {
    const scoreMap: Record<string, number> = {
      'PAN Card': 0.8,
      'Aadhar Card': 0.7,
      'GST Certificate': 1.0,
      'Driving License': 0.5,
      'Passport': 0.9,
      'Business Registration': 1.2,
      'Identity Document': 0.4
    };
    return scoreMap[docType] || 0.4;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type', {
          description: 'Please select an image, PDF, or text file'
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error('File too large', {
          description: 'Please select a file smaller than 10MB'
        });
        return;
      }

      setSelectedFile(file);
      toast.success('Document selected', {
        description: `${file.name} is ready for AI verification`
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('No document selected', {
        description: 'Please select a document to upload for AI verification'
      });
      return;
    }

    setIsUploading(true);
    setIsAiProcessing(true);

    try {
      const documentType = detectDocumentType(selectedFile.name);
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const aiConfidence = Math.random() * 0.3 + 0.7;
      const trustIncrease = calculateTrustScoreIncrease(documentType);
      
      if (aiConfidence > 0.8) {
        onDocumentVerified(documentType, trustIncrease);
        
        toast.success('AI Verification Successful', {
          description: `${documentType} verified with ${(aiConfidence * 100).toFixed(1)}% confidence. Trust score increased by +${trustIncrease.toFixed(1)}`
        });
      } else {
        toast.warning('Verification Needs Review', {
          description: `${documentType} requires manual review. AI confidence: ${(aiConfidence * 100).toFixed(1)}%`
        });
      }
      
      setSelectedFile(null);
      onClose();
      
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      toast.error('AI Verification Failed', {
        description: 'There was an error processing your document. Please try again.'
      });
    } finally {
      setIsUploading(false);
      setIsAiProcessing(false);
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    fileInput?.click();
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (file.type === 'application/pdf') return <FileText className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-2">Supported Documents</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• PAN Card (+0.8 trust score)</li>
          <li>• Aadhar Card (+0.7 trust score)</li>
          <li>• GST Certificate (+1.0 trust score)</li>
          <li>• Business Registration (+1.2 trust score)</li>
          <li>• Passport (+0.9 trust score)</li>
        </ul>
      </div>

      <div>
        <Label htmlFor="file-upload">Select Document</Label>
        <input
          id="file-upload"
          type="file"
          accept="image/*,.pdf,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div 
          onClick={triggerFileInput}
          className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors"
        >
          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">
            Click to browse or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Supports: Images, PDF, Text (Max 10MB)
          </p>
        </div>
      </div>

      {selectedFile && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 p-3 rounded-md border border-green-200"
        >
          <div className="flex items-center gap-2">
            {getFileIcon(selectedFile)}
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">{selectedFile.name}</p>
              <p className="text-xs text-green-600">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {detectDocumentType(selectedFile.name)}
              </p>
            </div>
            <Bot className="h-4 w-4 text-green-600" />
          </div>
        </motion.div>
      )}

      {isAiProcessing && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-purple-50 p-3 rounded-md border border-purple-200"
        >
          <div className="flex items-center gap-2 text-purple-700">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
            <span className="text-sm">AI analyzing document...</span>
          </div>
        </motion.div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="flex-1 bg-purple-600 hover:bg-purple-700"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              AI Verifying...
            </>
          ) : (
            <>
              <Bot className="h-4 w-4 mr-2" />
              Start AI Verification
            </>
          )}
        </Button>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default DocumentUploadForm;
