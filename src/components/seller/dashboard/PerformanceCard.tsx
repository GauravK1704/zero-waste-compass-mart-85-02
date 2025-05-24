
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TrendingUp, Award, Target, Upload, FileText, Image, Bot, Shield, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface PerformanceCardProps {
  trustScore?: number;
  verified?: boolean;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({ trustScore = 3.2, verified = false }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [aiTrustScore, setAiTrustScore] = useState(trustScore);
  const [documentsVerified, setDocumentsVerified] = useState<string[]>([]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type', {
          description: 'Please select an image, PDF, or text file'
        });
        return;
      }

      // Validate file size (max 10MB for documents)
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
      
      // Simulate AI document verification process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate AI analysis results
      const aiConfidence = Math.random() * 0.3 + 0.7; // 70-100% confidence
      const trustIncrease = calculateTrustScoreIncrease(documentType);
      const newTrustScore = Math.min(5.0, aiTrustScore + trustIncrease);
      
      if (aiConfidence > 0.8) {
        setAiTrustScore(newTrustScore);
        setDocumentsVerified(prev => [...prev, documentType]);
        
        toast.success('AI Verification Successful', {
          description: `${documentType} verified with ${(aiConfidence * 100).toFixed(1)}% confidence. Trust score increased by +${trustIncrease.toFixed(1)}`
        });
      } else {
        toast.warning('Verification Needs Review', {
          description: `${documentType} requires manual review. AI confidence: ${(aiConfidence * 100).toFixed(1)}%`
        });
      }
      
      setSelectedFile(null);
      setUploadDialogOpen(false);
      
      // Reset the input
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

  const getTrustScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 3.5) return 'text-blue-600';
    if (score >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrustScoreBadge = (score: number) => {
    if (score >= 4.5) return { text: 'Excellent', color: 'bg-green-100 text-green-800 border-green-200' };
    if (score >= 3.5) return { text: 'Good', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    if (score >= 2.5) return { text: 'Fair', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    return { text: 'Needs Improvement', color: 'bg-red-100 text-red-800 border-red-200' };
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            AI Trust Score
          </span>
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
                  <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`text-3xl font-bold ${getTrustScoreColor(aiTrustScore)}`}>
              {aiTrustScore.toFixed(1)}/5.0
            </span>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <Badge className={getTrustScoreBadge(aiTrustScore).color}>
                {getTrustScoreBadge(aiTrustScore).text}
              </Badge>
            </div>
          </div>
          {documentsVerified.length > 0 && (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              {documentsVerified.length} docs verified
            </Badge>
          )}
        </div>
        
        <Progress value={(aiTrustScore / 5) * 100} className="h-3" />
        
        {documentsVerified.length > 0 && (
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
        )}
        
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

        <div className="pt-2 border-t border-purple-100">
          <div className="flex items-center gap-2 text-sm text-purple-700">
            <Target className="h-4 w-4" />
            <span>
              {aiTrustScore >= 4.5 
                ? 'Excellent trust score! You have maximum seller benefits.' 
                : `Upload ${Math.ceil((4.5 - aiTrustScore) / 0.8)} more documents to reach excellent status`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceCard;
