
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Flashlight, Camera, ZoomIn, ZoomOut, ImagePlus, Sparkles } from 'lucide-react';
import { toggleTorch } from './scannerUtils';
import { motion } from 'framer-motion';
import ScannerControls from './ScannerControls';
import ScanProgressBar from './ScanProgressBar';
import ScanFeedback from './ScanFeedback';
import { toast } from 'sonner';

interface EnhancedScannerViewProps {
  scannerRef: React.RefObject<HTMLDivElement>;
  scanLineRef: React.RefObject<HTMLDivElement>;
  scanFeedback: string;
  scanProgress: number;
  onStopScanner: () => void;
  onResetScanner: () => void;
  barcodeResult: string | null;
  scanStatus?: 'idle' | 'scanning' | 'success' | 'error';
}

const EnhancedScannerView: React.FC<EnhancedScannerViewProps> = ({
  scannerRef,
  scanLineRef,
  scanFeedback,
  scanProgress,
  onStopScanner,
  onResetScanner,
  barcodeResult,
  scanStatus = 'scanning'
}) => {
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [currentCamera, setCurrentCamera] = useState('environment');
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);
  const particlesRef = useRef<number>(0);

  // Create particle effect on successful scan
  useEffect(() => {
    if (barcodeResult) {
      createParticles();
    }
  }, [barcodeResult]);

  const createParticles = () => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: particlesRef.current++,
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    
    setParticles(newParticles);
    
    // Clear particles after animation
    setTimeout(() => {
      setParticles([]);
    }, 1500);
  };

  // Check for multiple cameras on component mount
  useEffect(() => {
    const checkCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setHasMultipleCameras(videoDevices.length > 1);
      } catch (error) {
        console.error('Error checking for cameras:', error);
      }
    };
    
    checkCameras();
  }, []);

  const handleTorchToggle = async () => {
    const newStatus = !torchEnabled;
    const success = await toggleTorch(newStatus);
    if (success) {
      setTorchEnabled(newStatus);
      toast.success(newStatus ? "Flashlight turned on" : "Flashlight turned off");
    } else if (newStatus) {
      toast.error("Flashlight not supported on this device");
    }
  };

  const handleSwitchCamera = () => {
    const newCamera = currentCamera === 'environment' ? 'user' : 'environment';
    setCurrentCamera(newCamera);
    toast.success(`Switched to ${newCamera === 'environment' ? 'back' : 'front'} camera`);
    onResetScanner();
  };

  const handleZoomIn = () => {
    if (zoomLevel < 5) {
      const newZoom = parseFloat((zoomLevel + 0.5).toFixed(1));
      setZoomLevel(newZoom);
      toast.success(`Zoom level: ${newZoom}x`);
    }
  };

  const handleZoomOut = () => {
    if (zoomLevel > 1) {
      const newZoom = parseFloat((zoomLevel - 0.5).toFixed(1));
      setZoomLevel(newZoom);
      toast.success(`Zoom level: ${newZoom}x`);
    }
  };

  const handleCaptureImage = () => {
    toast.success("Image captured");
  };

  const getFeedbackStatus = () => {
    if (barcodeResult) return 'success';
    if (scanStatus === 'error') return 'error';
    if (scanProgress > 70) return 'warning';
    return 'processing';
  };

  return (
    <motion.div 
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}
    >
      <div 
        ref={scannerRef} 
        id="scanner"
        className="w-full h-full relative"
      >
        {/* Scanner grid overlay */}
        <div className="scanner-grid" />
        
        {/* Holographic scanning effect */}
        <div className="holographic-overlay" />
      </div>
      
      {/* Enhanced scan target overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-2/3 h-1/3">
          {/* Scan corners with animation */}
          <div className="scan-corners">
            <div className="scan-corner"></div>
            <div className="scan-corner"></div>
            <div className="scan-corner"></div>
            <div className="scan-corner"></div>
          </div>
          
          {/* Central scanning area */}
          <div className="absolute inset-0 border-2 border-indigo-400/70 rounded-md">
            {/* Corner indicators with glow */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-indigo-500 rounded-tl-md animate-pulse shadow-lg shadow-indigo-500/50"></div>
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-indigo-500 rounded-tr-md animate-pulse shadow-lg shadow-indigo-500/50"></div>
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-indigo-500 rounded-bl-md animate-pulse shadow-lg shadow-indigo-500/50"></div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-indigo-500 rounded-br-md animate-pulse shadow-lg shadow-indigo-500/50"></div>
          </div>
        </div>
        
        {/* Enhanced scan line with particle trail */}
        <div 
          ref={scanLineRef}
          className="scan-line"
        />
      </div>

      {/* Particle effects */}
      {particles.length > 0 && (
        <div className="scan-particles">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="particle"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>
      )}
      
      {/* Success glow effect */}
      {barcodeResult && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg animate-pulse" />
          <div className="absolute inset-0 border-2 border-green-500/50 rounded-lg animate-ping" />
        </motion.div>
      )}
      
      {/* Zoom level indicator with enhanced styling */}
      {zoomLevel > 1 && (
        <motion.div 
          className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white font-medium border border-white/20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Sparkles className="inline w-3 h-3 mr-1" />
          {zoomLevel}x
        </motion.div>
      )}
      
      {/* Enhanced scanner controls */}
      <ScannerControls
        onStopScanner={onStopScanner}
        onResetScanner={onResetScanner}
        onToggleTorch={handleTorchToggle}
        onSwitchCamera={handleSwitchCamera}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onCaptureImage={handleCaptureImage}
        isDetected={!!barcodeResult}
        torchEnabled={torchEnabled}
        zoomLevel={zoomLevel}
        maxZoom={5}
        hasMultipleCameras={hasMultipleCameras}
      />
      
      {/* Enhanced progress bar */}
      <ScanProgressBar 
        progress={scanProgress} 
        showPercentage={scanProgress > 10 && scanProgress < 100} 
        indeterminate={scanProgress < 10}
        status={scanStatus}
      />
      
      {/* Enhanced status indicator */}
      <ScanFeedback 
        message={scanFeedback} 
        status={getFeedbackStatus()}
      />
    </motion.div>
  );
};

export default EnhancedScannerView;
