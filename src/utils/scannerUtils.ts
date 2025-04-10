
import Quagga from '@ericblade/quagga2';

// Initialize the scanner configuration
export const initBarcodeScanner = (scannerElement: HTMLElement, onDetect: (barcode: string) => void, scannerConfig = {}) => {
  const defaultConfig = {
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: scannerElement,
      constraints: {
        width: { min: 640 },
        height: { min: 480 },
        facingMode: "environment",
        aspectRatio: { min: 1, max: 2 }
      },
    },
    locator: {
      patchSize: "medium",
      halfSample: true
    },
    numOfWorkers: 2,
    frequency: 10,
    decoder: {
      readers: [
        "code_128_reader",
        "ean_reader",
        "ean_8_reader",
        "code_39_reader",
        "code_39_vin_reader",
        "codabar_reader",
        "upc_reader",
        "upc_e_reader",
        "i2of5_reader"
      ],
      debug: {
        showCanvas: true,
        showPatches: true,
        showFoundPatches: true,
        showSkeleton: true,
        showLabels: true,
        showPatchLabels: true,
        showRemainingPatchLabels: true,
        boxFromPatches: {
          showTransformed: true,
          showTransformedBox: true,
          showBB: true
        }
      }
    },
    locate: true
  };

  // Merge default config with provided overrides
  const config = { ...defaultConfig, ...scannerConfig };

  // Initialize the scanner
  Quagga.init(config, (err) => {
    if (err) {
      console.error("Error initializing barcode scanner:", err);
      return;
    }

    // Start the scanner once initialized
    Quagga.start();

    // Listen for detected barcodes
    Quagga.onDetected((result) => {
      const barcode = result.codeResult.code;
      if (barcode) {
        // Play a beep sound if available
        const beep = new Audio('/sounds/beep.mp3');
        beep.play().catch(err => console.log('Error playing beep:', err));
        
        // Call the provided callback with the detected barcode
        onDetect(barcode);
      }
    });
  });

  // Return a stop function for cleanup
  return {
    stop: () => {
      try {
        Quagga.stop();
      } catch (err) {
        console.error("Error stopping barcode scanner:", err);
      }
    }
  };
};

// Get ideal camera constraints
export const getIdealCameraSettings = (element: HTMLElement) => {
  if (!element) return {};
  
  const viewWidth = element instanceof HTMLElement ? element.clientWidth : 640;
  const viewHeight = element instanceof HTMLElement ? element.clientHeight : 480;

  return {
    width: { min: viewWidth },
    height: { min: viewHeight },
    facingMode: "environment",
    aspectRatio: { min: 1, max: 2 }
  };
};

// Check camera availability and permissions
export const checkCameraAvailability = async (): Promise<boolean> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasCamera = devices.some(device => device.kind === 'videoinput');
    
    if (!hasCamera) {
      return false;
    }
    
    // Try to get camera access
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    
    // Stop all tracks to release the camera
    stream.getTracks().forEach(track => track.stop());
    
    return true;
  } catch (error) {
    console.error('Camera access denied or camera not available:', error);
    return false;
  }
};

// Generate a unique identifier for the scan
export const generateScanId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};
