
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import VerificationHeader from './verification/VerificationHeader';
import DocumentUploadItem from './verification/DocumentUploadItem';
import TrustScorePopup from './verification/TrustScorePopup';

interface DocumentType {
  id: string;
  name: string;
  required: boolean;
  trustScoreValue: number;
  uploaded: boolean;
  fileName?: string;
  verified?: boolean;
}

interface VerificationFormProps {
  onTrustScoreUpdate?: (newScore: number) => void;
}

const VerificationForm: React.FC<VerificationFormProps> = ({ onTrustScoreUpdate }) => {
  const { toast } = useToast();
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  
  const [documents, setDocuments] = useState<DocumentType[]>([
    { id: 'business-registration', name: 'Business Registration Certificate', required: true, trustScoreValue: 1.5, uploaded: false },
    { id: 'tax-certificate', name: 'Tax Registration Certificate', required: true, trustScoreValue: 1.2, uploaded: false },
    { id: 'identity-proof', name: 'Identity Proof (Aadhar/PAN)', required: true, trustScoreValue: 0.8, uploaded: false },
    { id: 'address-proof', name: 'Business Address Proof', required: false, trustScoreValue: 0.5, uploaded: false },
    { id: 'quality-certifications', name: 'Quality/Sustainability Certifications', required: false, trustScoreValue: 1.0, uploaded: false }
  ]);
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [trustScoreGained, setTrustScoreGained] = useState(0);
  const [showTrustScorePopup, setShowTrustScorePopup] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  
  const handleFileInputClick = (documentId: string) => {
    if (fileInputRefs.current[documentId]) {
      fileInputRefs.current[documentId]?.click();
    }
  };
  
  const handleFileChange = async (documentId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const document = documents.find(doc => doc.id === documentId);
      
      setIsAiProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedDocuments = documents.map(doc => {
        if (doc.id === documentId) {
          if (!doc.uploaded) {
            const newTrustScore = doc.trustScoreValue;
            const updatedScore = trustScoreGained + newTrustScore;
            setTrustScoreGained(updatedScore);
            
            // Notify parent component
            if (onTrustScoreUpdate) {
              onTrustScoreUpdate(updatedScore);
            }
            
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
  
  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
        <VerificationHeader trustScoreGained={trustScoreGained} />
        
        <div className="space-y-3">
          {documents.map((doc) => (
            <DocumentUploadItem
              key={doc.id}
              document={doc}
              isAiProcessing={isAiProcessing}
              onFileInputClick={handleFileInputClick}
              onFileChange={handleFileChange}
              fileInputRef={{
                current: fileInputRefs.current[doc.id] || null
              }}
            />
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

      <TrustScorePopup 
        show={showTrustScorePopup} 
        trustScoreGained={trustScoreGained} 
      />
    </form>
  );
};

export default VerificationForm;
