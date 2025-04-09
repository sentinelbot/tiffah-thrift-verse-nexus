
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Camera,
  ScanBarcode,
  X,
  Check,
  Keyboard,
  RefreshCw
} from 'lucide-react';
import { initScanner, syncScans, isOnline } from '@/utils/scannerUtils';
import { toast } from 'sonner';
import './scanner.css';

interface BarcodeScannerProps {
  onScanSuccess: (code: string) => void;
  onScanError?: (error: any) => void;
  scannerTitle?: string;
  showManualEntry?: boolean;
  showSyncButton?: boolean;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScanSuccess,
  onScanError,
  scannerTitle = 'Scan Barcode',
  showManualEntry = true,
  showSyncButton = true
}) => {
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [networkStatus, setNetworkStatus] = useState(isOnline());
  const scannerRef = useRef<() => void | null>(null);
  const scannerContainerId = 'barcode-scanner-container';

  useEffect(() => {
    const handleNetworkChange = () => {
      setNetworkStatus(isOnline());
      if (isOnline()) {
        toast.info('Back online. You can now sync your scans.');
      } else {
        toast.info('You are offline. Scans will be saved locally.');
      }
    };

    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);

    return () => {
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
    };
  }, []);

  useEffect(() => {
    if (isScannerActive) {
      // Initialize the scanner when active
      scannerRef.current = initScanner(scannerContainerId, {
        onDetected: (result) => {
          if (result && result.codeResult && result.codeResult.code) {
            handleScanSuccess(result.codeResult.code);
          }
        },
        onError: (error) => {
          handleScanError(error);
        }
      });
    }

    return () => {
      // Clean up the scanner when component unmounts or scanner is deactivated
      if (scannerRef.current) {
        scannerRef.current();
        scannerRef.current = null;
      }
    };
  }, [isScannerActive]);

  const handleScanSuccess = (code: string) => {
    // Stop the scanner after successful scan
    setIsScannerActive(false);
    if (scannerRef.current) {
      scannerRef.current();
      scannerRef.current = null;
    }
    
    // Call the success callback
    onScanSuccess(code);
  };

  const handleScanError = (error: any) => {
    setCameraError(`Camera error: ${error.message || 'Unknown error'}`);
    if (onScanError) {
      onScanError(error);
    }
  };

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      handleScanSuccess(manualCode.trim());
    } else {
      toast.error('Please enter a valid code');
    }
  };

  const handleSync = async () => {
    if (!networkStatus) {
      toast.error('Cannot sync while offline');
      return;
    }
    
    setIsSyncing(true);
    try {
      const result = await syncScans();
      if (result.synced > 0) {
        toast.success(`Successfully synced ${result.synced} scans`);
      } else {
        toast.info('No pending scans to sync');
      }
    } catch (error) {
      toast.error('Failed to sync scans');
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="scanner-component">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{scannerTitle}</h2>
        <div className="flex space-x-2">
          {showManualEntry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setIsManualEntry(!isManualEntry);
                setIsScannerActive(false);
                if (scannerRef.current) {
                  scannerRef.current();
                  scannerRef.current = null;
                }
              }}
            >
              {isManualEntry ? <Camera className="mr-1" /> : <Keyboard className="mr-1" />}
              {isManualEntry ? 'Use Camera' : 'Manual Entry'}
            </Button>
          )}
          
          {showSyncButton && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSync} 
              disabled={isSyncing || !networkStatus}
            >
              <RefreshCw className={`mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
              Sync Scans
            </Button>
          )}
        </div>
      </div>
      
      {/* Network status indicator */}
      <div className={`network-status mb-4 p-2 text-center text-sm rounded-md ${networkStatus ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'}`}>
        {networkStatus ? 'Online: Scans will be processed immediately' : 'Offline: Scans will be saved locally and synced when online'}
      </div>

      {isManualEntry ? (
        <div className="flex flex-col space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter barcode manually"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
              className="flex-1"
            />
            <Button onClick={handleManualSubmit}>
              <Check className="mr-1" />
              Submit
            </Button>
          </div>
        </div>
      ) : (
        <div className="scanner-container">
          {!isScannerActive ? (
            <div className="flex flex-col items-center justify-center h-64 bg-black/80 rounded-lg">
              <Button 
                size="lg" 
                onClick={() => {
                  setIsScannerActive(true);
                  setCameraError(null);
                }}
              >
                <ScanBarcode className="mr-2 h-6 w-6" />
                Start Camera
              </Button>
              {cameraError && (
                <div className="mt-4 p-2 bg-red-500/20 text-red-500 rounded-md text-sm">
                  {cameraError}
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <div 
                id={scannerContainerId} 
                className="scanner-view h-64 overflow-hidden rounded-lg relative"
              >
                <div className="scanner-guide">
                  <div className="guide-corner top-left"></div>
                  <div className="guide-corner top-right"></div>
                  <div className="guide-corner bottom-left"></div>
                  <div className="guide-corner bottom-right"></div>
                </div>
              </div>
              <Button 
                variant="destructive" 
                size="icon" 
                className="absolute top-2 right-2"
                onClick={() => {
                  setIsScannerActive(false);
                  if (scannerRef.current) {
                    scannerRef.current();
                    scannerRef.current = null;
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
