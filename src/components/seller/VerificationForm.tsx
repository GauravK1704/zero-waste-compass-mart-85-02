
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/components/ui/use-toast';
import { Check, Upload, FileText, Bot, Zap } from 'lucide-react';
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

const VerificationForm: React.FC = () => {
  const { toast } = useToast();
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  
  // List of verification documents with their trust score values
  const [documents, setDocuments] = useState<DocumentType[]>([
    { id: 'business-registration', name: 'Business Registration Certificate', required: true, trustScoreValue: 1.5, uploaded: false },
    { id: 'tax-certificate', name: 'Tax Registration Certificate', required: true, trustScoreValue: 1.2, uploaded: false },
    { id: 'identity-proof', name: 'Identity Proof (Aadhar/PAN)', required: true, trustScoreValue: 0.8, uploaded: false },
    { id: 'address-proof', name: 'Business Address Proof', required: false, trustScoreValue: 0.5, uploaded: false },
    { id: 'quality-certifications', name: 'Quality/Sustainability Certifications', required: false, trustScoreValue: 1.0, uploaded: false }
  ]);
  
  // Track current verification status
  const [isVerifying, setIsVerifying] = useState(false);
  const [trustScoreGained, setTrustScoreGained] = useState(0);
  const [showTrustScorePopup, setShowTrustScorePopup] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  
  // Handle file input click
  const handleFileInputClick = (documentId: string) => {
    if (fileInputRefs.current[documentId]) {
      fileInputRefs.current[documentId]?.click();
    }
  };
  
  // Handle file change with AI verification
  const handleFileChange = async (documentId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const document = documents.find(doc => doc.id === documentId);
      
      // Start AI processing
      setIsAiProcessing(true);
      
      // Simulate AI document verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedDocuments = documents.map(doc => {
        if (doc.id === documentId) {
          if (!doc.uploaded) {
            // Only add the trust score if the document wasn't already uploaded
            const newTrustScore = doc.trustScoreValue;
            setTrustScoreGained(prev => prev + newTrustScore);
            
            // Show trust score popup
            setShowTrustScorePopup(true);
            setTimeout(() => setShowTrustScorePopup(false), 3000);
          }
          return { ...doc, uploaded: true, fileName: file.name, verified: true };
        }
        return doc;
      });
      
      setDocuments(updatedDocuments);
      setIsAiProcessing(false);
      
      toast({
        title: "Document Verified by AI",
        description: `${file.name} has been verified and processed. Trust score increased by +${document?.trustScoreValue.toFixed(1)}.`,
        duration: 5000,
      });
    }
  };
  
  // Submit verification request
  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all required documents are uploaded
    const requiredDocsUploaded = documents
      .filter(doc => doc.required)
      .every(doc => doc.uploaded);
    
    if (!requiredDocsUploaded) {
      toast({
        title: "Missing Required Documents",
        description: "Please upload all required documents to complete verification.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }
    
    setIsVerifying(true);
    
    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false);
      toast({
        title: "Verification Complete",
        description: "Your documents have been AI-verified and your trust score has been updated instantly!",
        duration: 5000,
      });
    }, 2000);
  };
  
  return (
    <form onSubmit={handleVerificationSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Bot className="h-4 w-4 text-purple-600" />
            AI-Powered Document Verification
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Upload documents for instant AI verification and immediate trust score updates
          </p>
          {trustScoreGained > 0 && (
            <motion.div 
              className="text-sm text-green-600 font-medium mt-2 flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Check className="h-4 w-4" />
              <span>Trust score increased by {trustScoreGained.toFixed(1)} points</span>
              <Zap className="h-4 w-4 text-yellow-500" />
            </motion.div>
          )}
        </div>
        
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between rounded-lg border p-3 relative">
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
                    <p className="text-sm font-medium">{doc.name}</p>
                    {doc.verified && (
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
                    {doc.required ? "Required" : "Optional"} • +{doc.trustScoreValue.toFixed(1)} trust score
                  </p>
                  {doc.fileName && (
                    <p className="text-xs text-green-600">{doc.fileName}</p>
                  )}
                </div>
              </div>
              
              <div>
                <input
                  type="file"
                  className="hidden"
                  ref={el => fileInputRefs.current[doc.id] = el}
                  onChange={(e) => handleFileChange(doc.id, e)}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                {doc.uploaded ? (
                  <Button
                    variant="outline" 
                    size="sm"
                    className="flex items-center text-emerald-600 border-emerald-600"
                    type="button"
                    onClick={() => handleFileInputClick(doc.id)}
                  >
                    <Upload className="h-4 w-4 mr-1" /> Change
                  </Button>
                ) : (
                  <Button
                    variant="outline" 
                    size="sm"
                    className="flex items-center"
                    type="button"
                    onClick={() => handleFileInputClick(doc.id)}
                  >
                    <Upload className="h-4 w-4 mr-1" /> Browse
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={isVerifying || !documents.some(doc => doc.uploaded)}
      >
        {isVerifying ? "Processing..." : "Complete AI Verification"}
      </Button>

      {trustScoreGained > 0 && (
        <motion.div 
          className="text-center p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Bot className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">AI Verification Complete</span>
          </div>
          <p className="text-xs text-blue-600">
            Trust score updated instantly: +{trustScoreGained.toFixed(1)} points
          </p>
        </motion.div>
      )}

      {/* Trust Score Popup */}
      {showTrustScorePopup && (
        <motion.div
          className="fixed top-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-green-300 z-50"
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
              <Check className="h-5 w-5 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <h4 className="font-medium">Trust Score Updated</h4>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                New Score: {trustScoreGained.toFixed(1)}/5.0
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </form>
  );
};

export default VerificationForm;
