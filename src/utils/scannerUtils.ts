
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
  Quagga.init(config as any, (err) => {
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

// Added missing functions for BarcodeScanner
export const initScanner = (containerId: string, callbacks: { onDetected: (result: any) => void, onError: (error: any) => void }) => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Scanner container not found:', containerId);
    return () => {};
  }

  try {
    const scanner = initBarcodeScanner(
      container, 
      (barcode) => {
        callbacks.onDetected({ codeResult: { code: barcode } });
      }
    );
    
    return () => {
      if (scanner && scanner.stop) {
        scanner.stop();
      }
    };
  } catch (error) {
    callbacks.onError(error);
    return () => {};
  }
};

// Check if device is online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Sync offline scans
export const syncScans = async (): Promise<{ synced: number }> => {
  // In a real app, this would retrieve locally stored scans and send them to the server
  console.log('Syncing offline scans...');
  
  // Placeholder implementation
  // This would normally get data from IndexedDB or localStorage
  const pendingScans = localStorage.getItem('pendingScans') 
    ? JSON.parse(localStorage.getItem('pendingScans') || '[]') 
    : [];
  
  if (pendingScans.length === 0) {
    return { synced: 0 };
  }
  
  // Clear pending scans
  localStorage.setItem('pendingScans', JSON.stringify([]));
  
  return { synced: pendingScans.length };
};

// Process product scans
export const processProductScan = async (
  code: string, 
  userId: string, 
  userRole: string, 
  isOnlineStatus: boolean
): Promise<{ status: string; result?: any }> => {
  console.log(`Processing product scan: ${code}`);
  
  if (!isOnlineStatus) {
    // Store scan for later sync
    const pendingScans = localStorage.getItem('pendingScans')
      ? JSON.parse(localStorage.getItem('pendingScans') || '[]')
      : [];
    
    pendingScans.push({
      type: 'product',
      code,
      userId,
      userRole,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('pendingScans', JSON.stringify(pendingScans));
    return { status: 'pending-sync' };
  }
  
  // In a real app, this would make an API call to validate the product barcode
  // For demo purposes, simulate a successful scan
  return { 
    status: 'success',
    result: {
      id: `PROD-${code}`,
      name: `Sample Product ${code}`,
      price: 29.99,
      status: 'available'
    }
  };
};

// Process order scans
export const processOrderScan = async (
  code: string, 
  userId: string, 
  userRole: string, 
  isOnlineStatus: boolean
): Promise<{ status: string; result?: any }> => {
  console.log(`Processing order scan: ${code}`);
  
  if (!isOnlineStatus) {
    // Store scan for later sync
    const pendingScans = localStorage.getItem('pendingScans')
      ? JSON.parse(localStorage.getItem('pendingScans') || '[]')
      : [];
    
    pendingScans.push({
      type: 'order',
      code,
      userId,
      userRole,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('pendingScans', JSON.stringify(pendingScans));
    return { status: 'pending-sync' };
  }
  
  // In a real app, this would make an API call to validate the order barcode
  // For demo purposes, simulate a successful scan
  return { 
    status: 'success',
    result: {
      id: `ORD-${code}`,
      orderNumber: `TTS-20250410-${code}`,
      status: 'processing',
      items: [
        { id: 'item1', name: 'Vintage Denim Jacket', quantity: 1 },
        { id: 'item2', name: 'Leather Bag', quantity: 1 }
      ]
    }
  };
};

// Process delivery scans
export const processDeliveryScan = async (
  code: string, 
  userId: string, 
  userRole: string, 
  isOnlineStatus: boolean
): Promise<{ status: string; result?: any }> => {
  console.log(`Processing delivery scan: ${code}`);
  
  if (!isOnlineStatus) {
    // Store scan for later sync
    const pendingScans = localStorage.getItem('pendingScans')
      ? JSON.parse(localStorage.getItem('pendingScans') || '[]')
      : [];
    
    pendingScans.push({
      type: 'delivery',
      code,
      userId,
      userRole,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('pendingScans', JSON.stringify(pendingScans));
    return { status: 'pending-sync' };
  }
  
  // In a real app, this would make an API call to validate the delivery barcode
  // For demo purposes, simulate a successful scan
  return { 
    status: 'success',
    result: {
      id: `DEL-${code}`,
      orderNumber: `TTS-20250410-${code}`,
      status: 'outForDelivery',
      deliveryTime: new Date().toISOString()
    }
  };
};
