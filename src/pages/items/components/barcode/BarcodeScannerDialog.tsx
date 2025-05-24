
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import IdleView from "./IdleView";
import EnhancedScannerView from "./EnhancedScannerView";
import { useBarcodeScanner } from "../../hooks/useBarcodeScanner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface BarcodeScannerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBarcodeDetected: (barcode: string) => void;
}

const BarcodeScannerDialog: React.FC<BarcodeScannerDialogProps> = ({
  isOpen,
  onClose,
  onBarcodeDetected,
}) => {
  const [view, setView] = useState<"idle" | "scanning">("idle");
  const [scannerSettings, setScannerSettings] = useState({
    format: "all",
    resolution: "hd",
    frequency: "normal"
  });

  const {
    isScanning,
    setIsScanning,
    barcodeResult,
    scanFeedback,
    scanProgress,
    scannerRef,
    scanLineRef,
    startScanner,
    stopScanner,
    resetScanner,
    scanStatus
  } = useBarcodeScanner(onBarcodeDetected);

  // Reset to idle view when dialog closes
  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      setView("idle");
    }
  }, [isOpen, stopScanner]);

  const handleStartScanner = () => {
    setView("scanning");
    setIsScanning(true);
    
    // Apply custom scanner settings
    const options = {
      format: scannerSettings.format,
      resolution: scannerSettings.resolution,
      frequency: scannerSettings.frequency === "high" ? 15 : 
                scannerSettings.frequency === "low" ? 5 : 10
    };
    
    startScanner(options);
  };

  const handleStopScanner = () => {
    stopScanner();
    setView("idle");
  };
  
  const handleSettingsChange = (key: string, value: string) => {
    setScannerSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {view === "idle" ? "🚀 Enhanced Barcode Scanner" : "🔍 AI-Powered Scanning"}
          </DialogTitle>
        </DialogHeader>

        <motion.div
          layout
          className="relative rounded-lg overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {view === "idle" ? (
            <>
              <IdleView onStartScanner={handleStartScanner} />
              
              {/* Enhanced scanner settings */}
              <div className="mt-4 p-4 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-lg space-y-3 border border-indigo-100">
                <h3 className="font-medium text-sm text-gray-700 flex items-center gap-2">
                  ⚙️ Advanced Scanner Settings
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="format-select" className="text-xs font-medium">📊 Barcode Format</Label>
                    <Select 
                      value={scannerSettings.format} 
                      onValueChange={(value) => handleSettingsChange('format', value)}
                    >
                      <SelectTrigger id="format-select" className="h-8 text-xs bg-white border-indigo-200">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">🔄 All Formats</SelectItem>
                        <SelectItem value="ean">📦 EAN / UPC</SelectItem>
                        <SelectItem value="code128">🏷️ Code 128</SelectItem>
                        <SelectItem value="qrcode">📱 QR Code</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="resolution-select" className="text-xs font-medium">📹 Resolution</Label>
                    <Select 
                      value={scannerSettings.resolution} 
                      onValueChange={(value) => handleSettingsChange('resolution', value)}
                    >
                      <SelectTrigger id="resolution-select" className="h-8 text-xs bg-white border-indigo-200">
                        <SelectValue placeholder="Select resolution" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sd">📺 Standard (480p)</SelectItem>
                        <SelectItem value="hd">🎥 High (720p)</SelectItem>
                        <SelectItem value="fullhd">✨ Full HD (1080p)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1 col-span-2">
                    <Label htmlFor="frequency-select" className="text-xs font-medium">⚡ Scan Frequency</Label>
                    <Select 
                      value={scannerSettings.frequency} 
                      onValueChange={(value) => handleSettingsChange('frequency', value)}
                    >
                      <SelectTrigger id="frequency-select" className="h-8 text-xs bg-white border-indigo-200">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">🔋 Low (Battery Saving)</SelectItem>
                        <SelectItem value="normal">⚖️ Normal</SelectItem>
                        <SelectItem value="high">🚀 High (Better Detection)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <EnhancedScannerView
              scannerRef={scannerRef}
              scanLineRef={scanLineRef}
              scanFeedback={scanFeedback}
              scanProgress={scanProgress}
              onStopScanner={handleStopScanner}
              onResetScanner={resetScanner}
              barcodeResult={barcodeResult}
              scanStatus={scanStatus}
            />
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeScannerDialog;
