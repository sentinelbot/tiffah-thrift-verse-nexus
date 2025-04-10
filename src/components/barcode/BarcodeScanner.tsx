
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Camera, XCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { initScanner, stopScanner } from '@/utils/scannerUtils';
import './scanner.css';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  scannerTitle?: string;
  scannerInstructions?: string;
}

const BarcodeScanner = ({ 
  onScan, 
  scannerTitle = 'Scan Barcode',
  scannerInstructions = 'Position the barcode in the camera view to scan'
}: BarcodeScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  
  const startScanner = async () => {
    try {
      setIsScanning(true);
      
      // We'll initialize the scanner when user clicks the button
      if (scannerRef.current) {
        await initScanner('scannerViewport', (result) => {
          if (result.code) {
            handleCodeDetected(result.code);
          }
        });
      }
    } catch (error) {
      console.error('Failed to start scanner:', error);
      toast.error('Failed to start scanner. Please check camera permissions.');
      setIsScanning(false);
    }
  };
  
  const stopScanningProcess = () => {
    if (isScanning) {
      stopScanner();
      setIsScanning(false);
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopScanningProcess();
    };
  }, []);
  
  const handleCodeDetected = (code: string) => {
    // Stop scanning after successful scan
    stopScanningProcess();
    
    // Update the last scanned code
    setLastScannedCode(code);
    
    // Call the onScan callback provided by the parent component
    onScan(code);
    
    // Show success message
    toast.success(`Barcode scanned: ${code}`);
  };
  
  const handleNewScan = () => {
    setLastScannedCode(null);
    startScanner();
  };
  
  return (
    <div className="rounded-lg border shadow-sm">
      <div className="p-4 bg-muted/50">
        <h3 className="font-medium text-lg">{scannerTitle}</h3>
        <p className="text-sm text-muted-foreground">{scannerInstructions}</p>
      </div>
      
      <Separator />
      
      <div className="p-6">
        {!isScanning && !lastScannedCode && (
          <div className="text-center">
            <Button 
              onClick={startScanner}
              className="px-6 mb-4"
            >
              <Camera className="mr-2 h-4 w-4" />
              Start Scanner
            </Button>
            <p className="text-xs text-muted-foreground">
              You'll need to grant camera permissions
            </p>
          </div>
        )}
        
        {isScanning && (
          <div className="mb-4 text-center">
            <div 
              id="scannerViewport" 
              ref={scannerRef}
              className="scanner-viewport mb-4 mx-auto"
            ></div>
            <Button
              variant="outline"
              onClick={stopScanningProcess}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Scanning
            </Button>
          </div>
        )}
        
        {lastScannedCode && (
          <div className="text-center">
            <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg mb-4">
              <p className="font-medium flex items-center justify-center text-green-800 dark:text-green-300">
                <Zap className="mr-2 h-4 w-4" />
                Scanned Code: {lastScannedCode}
              </p>
            </div>
            <Button onClick={handleNewScan}>
              <Camera className="mr-2 h-4 w-4" />
              Scan Another
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarcodeScanner;
