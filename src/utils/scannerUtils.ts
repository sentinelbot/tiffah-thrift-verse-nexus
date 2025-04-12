
import { v4 as uuidv4 } from 'uuid';
import Quagga from '@ericblade/quagga2';

export interface ScanResult {
  id: string;
  code: string;
  status: 'success' | 'error' | 'pending' | 'pending-sync';
  timestamp: number;
  type: string;
  userId?: string;
  result?: any;
}

// Check if the device is online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Initialize the barcode scanner
export const initScanner = (
  containerId: string,
  callbacks: {
    onDetected: (result: any) => void;
    onError: (error: any) => void;
  }
): (() => void) => {
  try {
    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: document.getElementById(containerId) as HTMLElement,
          constraints: {
            facingMode: 'environment',
            width: { min: 450 },
            height: { min: 300 },
            aspectRatio: { min: 1, max: 2 },
          },
        },
        locator: {
          patchSize: 'medium',
          halfSample: true,
        },
        numOfWorkers: 2,
        frequency: 10,
        decoder: {
          readers: ['code_128_reader', 'ean_reader', 'ean_8_reader', 'code_39_reader'],
        },
        locate: true,
      },
      (err: any) => {
        if (err) {
          console.error('Error initializing Quagga:', err);
          callbacks.onError(err);
          return;
        }
        
        Quagga.start();
      }
    );

    Quagga.onDetected((result) => {
      if (result && result.codeResult) {
        // Play a success sound
        const audio = new Audio('/beep.mp3');
        audio.play().catch(e => console.log('Audio play failed:', e));
        
        callbacks.onDetected(result);
      }
    });

    Quagga.onProcessed((result) => {
      const drawingCanvas = document.getElementById(`${containerId}_canvas`);
      if (drawingCanvas) {
        const ctx = drawingCanvas.getContext('2d');
        if (ctx && result) {
          // Draw detection result if available
          if (result.boxes) {
            ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
            result.boxes.filter((box: any) => box !== result.box).forEach((box: any) => {
              ctx.strokeStyle = 'green';
              ctx.lineWidth = 2;
              ctx.strokeRect(box.x, box.y, box.width, box.height);
            });
          }

          // Draw the detected barcode box
          if (result.box) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 4;
            ctx.strokeRect(
              result.box.x,
              result.box.y,
              result.box.width,
              result.box.height
            );
          }
        }
      }
    });

    // Return a cleanup function
    return () => {
      Quagga.stop();
    };
  } catch (error) {
    console.error('Failed to initialize scanner:', error);
    callbacks.onError(error);
    return () => {}; // Return empty cleanup function in case of error
  }
};

// Process a product scan
export const processProductScan = async (
  code: string,
  userId: string,
  userRole: string,
  online: boolean = true
): Promise<{ status: string; result?: any }> => {
  const scanId = uuidv4();
  
  try {
    if (!online) {
      // Store scan for later sync
      const offlineScan = {
        id: scanId,
        code,
        type: 'product',
        userId,
        userRole,
        timestamp: Date.now(),
        status: 'pending-sync'
      };
      
      const storedScans = JSON.parse(localStorage.getItem('offlineScans') || '[]');
      storedScans.push(offlineScan);
      localStorage.setItem('offlineScans', JSON.stringify(storedScans));
      
      return { status: 'pending-sync' };
    }
    
    // Mock API call - in a real app this would call your backend
    return new Promise((resolve) => {
      setTimeout(() => {
        // Store in scan history
        const scanResult: ScanResult = {
          id: scanId,
          code,
          type: 'product',
          status: 'success',
          timestamp: Date.now(),
          userId,
          result: {
            id: 'prod_' + Math.floor(Math.random() * 1000),
            name: 'Sample Product ' + code.substring(0, 4),
            price: Math.floor(Math.random() * 2000) + 500,
            status: 'available'
          }
        };
        
        const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
        history.unshift(scanResult);
        localStorage.setItem('scanHistory', JSON.stringify(history.slice(0, 100)));
        
        resolve({
          status: 'success',
          result: scanResult.result
        });
      }, 1000);
    });
  } catch (error) {
    console.error('Error processing product scan:', error);
    
    // Store failed scan in history
    const scanResult: ScanResult = {
      id: scanId,
      code,
      type: 'product',
      status: 'error',
      timestamp: Date.now(),
      userId
    };
    
    const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
    history.unshift(scanResult);
    localStorage.setItem('scanHistory', JSON.stringify(history.slice(0, 100)));
    
    return { status: 'error' };
  }
};

// Process an order scan
export const processOrderScan = async (
  code: string,
  userId: string,
  userRole: string,
  online: boolean = true
): Promise<{ status: string; result?: any }> => {
  const scanId = uuidv4();
  
  try {
    if (!online) {
      // Store scan for later sync
      const offlineScan = {
        id: scanId,
        code,
        type: 'order',
        userId,
        userRole,
        timestamp: Date.now(),
        status: 'pending-sync'
      };
      
      const storedScans = JSON.parse(localStorage.getItem('offlineScans') || '[]');
      storedScans.push(offlineScan);
      localStorage.setItem('offlineScans', JSON.stringify(storedScans));
      
      return { status: 'pending-sync' };
    }
    
    // Mock API call - in a real app this would call your backend
    return new Promise((resolve) => {
      setTimeout(() => {
        // Store in scan history
        const scanResult: ScanResult = {
          id: scanId,
          code,
          type: 'order',
          status: 'success',
          timestamp: Date.now(),
          userId,
          result: {
            id: 'order_' + Math.floor(Math.random() * 1000),
            orderNumber: 'TTS-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(Math.random() * 1000),
            status: 'processing',
            items: [
              {
                id: 'item_' + Math.floor(Math.random() * 100),
                name: 'Product A',
                quantity: 1
              },
              {
                id: 'item_' + Math.floor(Math.random() * 100),
                name: 'Product B',
                quantity: 2
              }
            ]
          }
        };
        
        const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
        history.unshift(scanResult);
        localStorage.setItem('scanHistory', JSON.stringify(history.slice(0, 100)));
        
        resolve({
          status: 'success',
          result: scanResult.result
        });
      }, 1000);
    });
  } catch (error) {
    console.error('Error processing order scan:', error);
    
    // Store failed scan in history
    const scanResult: ScanResult = {
      id: scanId,
      code,
      type: 'order',
      status: 'error',
      timestamp: Date.now(),
      userId
    };
    
    const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
    history.unshift(scanResult);
    localStorage.setItem('scanHistory', JSON.stringify(history.slice(0, 100)));
    
    return { status: 'error' };
  }
};

// Process a delivery scan
export const processDeliveryScan = async (
  code: string,
  userId: string,
  userRole: string,
  online: boolean = true
): Promise<{ status: string; result?: any }> => {
  const scanId = uuidv4();
  
  try {
    if (!online) {
      // Store scan for later sync
      const offlineScan = {
        id: scanId,
        code,
        type: 'delivery',
        userId,
        userRole,
        timestamp: Date.now(),
        status: 'pending-sync'
      };
      
      const storedScans = JSON.parse(localStorage.getItem('offlineScans') || '[]');
      storedScans.push(offlineScan);
      localStorage.setItem('offlineScans', JSON.stringify(storedScans));
      
      return { status: 'pending-sync' };
    }
    
    // Mock API call - in a real app this would call your backend
    return new Promise((resolve) => {
      setTimeout(() => {
        // Store in scan history
        const scanResult: ScanResult = {
          id: scanId,
          code,
          type: 'delivery',
          status: 'success',
          timestamp: Date.now(),
          userId,
          result: {
            id: 'delivery_' + Math.floor(Math.random() * 1000),
            orderNumber: 'TTS-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(Math.random() * 1000),
            status: 'outForDelivery',
            deliveryTime: new Date().toISOString()
          }
        };
        
        const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
        history.unshift(scanResult);
        localStorage.setItem('scanHistory', JSON.stringify(history.slice(0, 100)));
        
        resolve({
          status: 'success',
          result: scanResult.result
        });
      }, 1000);
    });
  } catch (error) {
    console.error('Error processing delivery scan:', error);
    
    // Store failed scan in history
    const scanResult: ScanResult = {
      id: scanId,
      code,
      type: 'delivery',
      status: 'error',
      timestamp: Date.now(),
      userId
    };
    
    const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
    history.unshift(scanResult);
    localStorage.setItem('scanHistory', JSON.stringify(history.slice(0, 100)));
    
    return { status: 'error' };
  }
};

// Sync offline scans
export const syncScans = async (): Promise<{ synced: number }> => {
  const offlineScans = JSON.parse(localStorage.getItem('offlineScans') || '[]');
  
  if (offlineScans.length === 0) {
    return { synced: 0 };
  }
  
  // In a real app, this would send the scans to your backend
  // For this demo, we'll just move them to the scan history
  const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
  
  for (const scan of offlineScans) {
    // Update the status to success
    scan.status = 'success';
    history.unshift(scan);
  }
  
  localStorage.setItem('scanHistory', JSON.stringify(history.slice(0, 100)));
  localStorage.setItem('offlineScans', '[]');
  
  return { synced: offlineScans.length };
};

// Get scan history
export const getScanHistory = (limit: number = 100): Promise<ScanResult[]> => {
  return new Promise((resolve) => {
    const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
    resolve(history.slice(0, limit));
  });
};

// Generate a barcode for products
export const generateBarcode = (): string => {
  // Generate a random 12-digit number for CODE128 format
  const randomDigits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join('');
  return 'TTS' + randomDigits;
};
