
import { useEffect, useRef, useState } from 'react';
import Quagga from '@ericblade/quagga2';
import { toast } from 'sonner';
import './scanner.css';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  scannerTitle?: string;
  scannerInstructions?: string;
}

const BarcodeScanner = ({ onScan, scannerTitle = "Barcode Scanner", scannerInstructions = "Position the barcode in the camera view" }: BarcodeScannerProps) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [scanning, setScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scanError, setScanError] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const [cameraCount, setCameraCount] = useState(0);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  
  // Success audio
  const playSuccessBeep = () => {
    const audio = new Audio('/sounds/beep.mp3');
    audio.play();
  };
  
  // Initialize the barcode scanner
  useEffect(() => {
    if (!scannerRef.current) return;
    
    const startScanner = async () => {
      try {
        // Get available cameras
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setCameras(videoDevices);
        setCameraCount(videoDevices.length);
        
        // Set default camera (back camera if available)
        const backCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        );
        
        const defaultCamera = backCamera || (videoDevices.length > 0 ? videoDevices[0] : null);
        setSelectedCamera(defaultCamera?.deviceId || null);
        
        if (!defaultCamera) {
          console.error('No cameras found');
          return;
        }
        
        setScanning(true);
        setScanSuccess(false);
        setScanError(false);
        
        Quagga.init({
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: scannerRef.current,
            constraints: {
              width: 480,
              height: 320,
              facingMode: "environment",
              deviceId: defaultCamera.deviceId
            },
          },
          decoder: {
            readers: [
              "code_128_reader",
              "ean_reader",
              "code_39_reader",
              "code_93_reader",
              "upc_reader",
              "upc_e_reader"
            ],
            debug: {
              drawBoundingBox: true,
              showFrequency: true,
              drawScanline: true,
              showPattern: true
            },
            multiple: false
          },
        }, (err) => {
          if (err) {
            console.error("Error initializing Quagga:", err);
            if (err.name === 'NotAllowedError') {
              setPermissionError(true);
            } else {
              setScanError(true);
            }
            return;
          }
          Quagga.start();
        });
        
        // Set up result handler
        Quagga.onDetected((result) => {
          if (result.codeResult.code) {
            // Visual feedback
            setScanSuccess(true);
            
            // Sound feedback
            playSuccessBeep();
            
            // Stop scanning
            Quagga.stop();
            setScanning(false);
            
            // Send the code back
            onScan(result.codeResult.code);
            
            // Reset after 1 second
            setTimeout(() => {
              setScanSuccess(false);
            }, 1000);
          }
        });
      } catch (error) {
        console.error("Error setting up scanner:", error);
        setScanError(true);
        toast.error("Failed to initialize camera");
      }
    };
    
    startScanner();
    
    // Cleanup
    return () => {
      if (Quagga) {
        Quagga.stop();
      }
      setScanning(false);
    };
  }, [onScan]);
  
  // Handle camera switching
  const switchCamera = async (deviceId: string) => {
    if (scanning) {
      Quagga.stop();
    }
    
    setSelectedCamera(deviceId);
    
    try {
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            width: 480,
            height: 320,
            deviceId: deviceId
          },
        },
        decoder: {
          readers: [
            "code_128_reader",
            "ean_reader",
            "code_39_reader",
            "code_93_reader",
            "upc_reader",
            "upc_e_reader"
          ],
          debug: {
            drawBoundingBox: true,
            showFrequency: true,
            drawScanline: true,
            showPattern: true
          },
          multiple: false
        },
      }, (err) => {
        if (err) {
          console.error("Error initializing Quagga:", err);
          setScanError(true);
          return;
        }
        Quagga.start();
        setScanning(true);
      });
    } catch (error) {
      console.error("Error switching camera:", error);
      setScanError(true);
    }
  };
  
  const restartScanner = () => {
    setScanError(false);
    setPermissionError(false);
    if (scanning) {
      Quagga.stop();
    }
    
    if (selectedCamera) {
      switchCamera(selectedCamera);
    } else if (cameras.length > 0) {
      switchCamera(cameras[0].deviceId);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h3 className="font-medium text-lg">{scannerTitle}</h3>
        <p className="text-sm text-muted-foreground">{scannerInstructions}</p>
      </div>
      
      <div 
        ref={scannerRef} 
        className={`scanner-viewport ${scanSuccess ? 'scan-success' : ''} ${scanError ? 'scan-error' : ''}`}
      />
      
      {permissionError && (
        <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-md">
          <p className="text-sm text-red-800 dark:text-red-200">
            Camera access was denied. Please allow camera access in your browser settings and try again.
          </p>
          <button 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md text-sm"
            onClick={restartScanner}
          >
            Try Again
          </button>
        </div>
      )}
      
      {scanError && !permissionError && (
        <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-md">
          <p className="text-sm text-red-800 dark:text-red-200">
            Failed to initialize the barcode scanner. Please check your camera and try again.
          </p>
          <button 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md text-sm"
            onClick={restartScanner}
          >
            Try Again
          </button>
        </div>
      )}
      
      {cameraCount > 1 && (
        <div className="mt-2">
          <label className="text-sm font-medium">Select Camera:</label>
          <select 
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm dark:bg-zinc-800 dark:border-zinc-700"
            value={selectedCamera || ''}
            onChange={(e) => switchCamera(e.target.value)}
          >
            {cameras.map((camera, index) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
