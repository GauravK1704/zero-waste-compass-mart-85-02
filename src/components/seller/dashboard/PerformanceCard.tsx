
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TrendingUp, Award, Target, Upload, FileText, Image } from 'lucide-react';
import { toast } from 'sonner';

const PerformanceCard = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

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

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large', {
          description: 'Please select a file smaller than 5MB'
        });
        return;
      }

      setSelectedFile(file);
      toast.success('File selected', {
        description: `${file.name} is ready to upload`
      });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('No file selected', {
        description: 'Please select a file to upload'
      });
      return;
    }

    setIsUploading(true);

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('File uploaded successfully', {
        description: `${selectedFile.name} has been uploaded and processed`
      });
      
      setSelectedFile(null);
      setUploadDialogOpen(false);
      
      // Reset the input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      toast.error('Upload failed', {
        description: 'There was an error uploading your file. Please try again.'
      });
    } finally {
      setIsUploading(false);
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
    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            Performance Score
          </span>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-purple-600 border-purple-200 hover:bg-purple-50">
                <Upload className="h-4 w-4 mr-1" />
                Browse
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Upload Performance Document</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file-upload">Select File</Label>
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
                      Supports: Images, PDF, Text (Max 5MB)
                    </p>
                  </div>
                </div>

                {selectedFile && (
                  <div className="bg-green-50 p-3 rounded-md border border-green-200">
                    <div className="flex items-center gap-2">
                      {getFileIcon(selectedFile)}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">{selectedFile.name}</p>
                        <p className="text-xs text-green-600">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    className="flex-1"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>

                <div className="text-xs text-gray-500">
                  <p>Supported file types:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Images: JPEG, PNG, GIF</li>
                    <li>Documents: PDF, TXT</li>
                    <li>Maximum file size: 5MB</li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-purple-700">87%</span>
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <TrendingUp className="h-3 w-3 mr-1" />
            +5% this week
          </Badge>
        </div>
        
        <Progress value={87} className="h-2" />
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Quality Score</span>
            <span className="font-medium">92%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Delivery Rate</span>
            <span className="font-medium">95%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Response Time</span>
            <span className="font-medium">98%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Customer Satisfaction</span>
            <span className="font-medium">89%</span>
          </div>
        </div>

        <div className="pt-2 border-t border-purple-100">
          <div className="flex items-center gap-2 text-sm text-purple-700">
            <Target className="h-4 w-4" />
            <span>Next target: 90% overall score</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceCard;
