
import Quagga from 'quagga';
import { generateUniqueBarcode } from './barcodeUtils';
import { toast } from 'sonner';
import { openDB, DBSchema } from 'idb';

// Define the interfaces for scan results
export interface ScanResult {
  id: string;
  code: string;
  timestamp: number;
  scanType: 'product' | 'order' | 'delivery';
  userId: string;
  userRole: string;
  status: 'success' | 'failed' | 'pending-sync';
  result?: any;
  notes?: string;
}

// Define the interface for IndexedDB
interface ScanDatabase extends DBSchema {
  scans: {
    key: string;
    value: ScanResult;
    indexes: {
      'by-timestamp': number;
      'by-status': string;
    };
  };
}

// Initialize the IndexedDB database
const initDB = async () => {
  return openDB<ScanDatabase>('tiffah-scan-db', 1, {
    upgrade(db) {
      const scanStore = db.createObjectStore('scans', { keyPath: 'id' });
      scanStore.createIndex('by-timestamp', 'timestamp');
      scanStore.createIndex('by-status', 'status');
    },
  });
};

// Configure scanner
export const initScanner = (containerId: string, callbacks: {
  onDetected: (result: any) => void;
  onError?: (error: any) => void;
}) => {
  const constraints = {
    width: { min: 640 },
    height: { min: 480 },
    facingMode: "environment",
    aspectRatio: { min: 1, max: 2 }
  };

  Quagga.init({
    inputStream: {
      type: "LiveStream",
      constraints,
      target: document.querySelector(`#${containerId}`)!,
      area: { // Define scan area to the center 80% of the viewport
        top: "10%",    
        right: "10%",  
        left: "10%",   
        bottom: "10%"  
      }
    },
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
        drawBoundingBox: true,
        showFrequency: true,
        drawScanline: true,
        showPattern: true
      },
      multiple: false
    },
    locator: {
      patchSize: "medium",
      halfSample: true
    },
  }, function(err) {
    if (err) {
      console.error("Error initializing Quagga:", err);
      if (callbacks.onError) {
        callbacks.onError(err);
      }
      return;
    }
    
    // Start the scanner
    Quagga.start();
  });

  // When a barcode is detected
  Quagga.onDetected((result) => {
    // Play a success sound
    playSuccessSound();
    
    // Flash the screen green briefly to indicate success
    const scanArea = document.querySelector(`#${containerId}`);
    if (scanArea) {
      scanArea.classList.add('scan-success');
      setTimeout(() => {
        scanArea.classList.remove('scan-success');
      }, 500);
    }
    
    // Call the detection callback
    callbacks.onDetected(result);
  });

  // Cleanup function
  return () => {
    Quagga.stop();
  };
};

// Play a success sound
export const playSuccessSound = () => {
  const audio = new Audio('/sounds/beep.mp3');
  audio.play().catch(e => console.warn('Could not play audio:', e));
};

// Store scan in IndexedDB
export const storeScan = async (scanResult: Omit<ScanResult, 'id'>): Promise<ScanResult> => {
  const db = await initDB();
  const id = generateUniqueBarcode();
  const scan: ScanResult = {
    id,
    ...scanResult
  };
  await db.add('scans', scan);
  return scan;
};

// Get all pending scans
export const getPendingScans = async (): Promise<ScanResult[]> => {
  const db = await initDB();
  return db.getAllFromIndex('scans', 'by-status', 'pending-sync');
};

// Sync scans with the server
export const syncScans = async () => {
  const pendingScans = await getPendingScans();
  
  if (pendingScans.length === 0) {
    return { synced: 0 };
  }
  
  try {
    // In a real implementation, we would upload to the server here
    // For now, just mark them as success
    const db = await initDB();
    const tx = db.transaction('scans', 'readwrite');
    
    for (const scan of pendingScans) {
      scan.status = 'success';
      await tx.store.put(scan);
    }
    
    await tx.done;
    
    toast.success(`Successfully synced ${pendingScans.length} scans`);
    return { synced: pendingScans.length };
  } catch (error) {
    console.error('Error syncing scans:', error);
    toast.error('Failed to sync scans');
    return { synced: 0, error };
  }
};

// Process a product scan
export const processProductScan = async (
  code: string, 
  userId: string, 
  userRole: string, 
  isOnline: boolean
): Promise<ScanResult> => {
  try {
    if (isOnline) {
      // In a real implementation, we would fetch product data from the server
      // For demonstration, we'll simulate a product lookup
      const mockProductData = {
        id: `prod-${Math.floor(Math.random() * 1000)}`,
        name: `Product for barcode ${code}`,
        price: Math.floor(Math.random() * 5000) + 500,
        status: 'available'
      };
      
      const scanResult = await storeScan({
        code,
        timestamp: Date.now(),
        scanType: 'product',
        userId,
        userRole,
        status: 'success',
        result: mockProductData
      });
      
      return scanResult;
    } else {
      // Store for later sync
      const scanResult = await storeScan({
        code,
        timestamp: Date.now(),
        scanType: 'product',
        userId,
        userRole,
        status: 'pending-sync'
      });
      
      return scanResult;
    }
  } catch (error) {
    console.error('Error processing product scan:', error);
    
    const scanResult = await storeScan({
      code,
      timestamp: Date.now(),
      scanType: 'product',
      userId,
      userRole,
      status: 'failed',
      notes: error.message
    });
    
    throw error;
  }
};

// Process an order scan
export const processOrderScan = async (
  code: string, 
  userId: string, 
  userRole: string, 
  isOnline: boolean
): Promise<ScanResult> => {
  try {
    if (isOnline) {
      // In a real implementation, we would fetch order data from the server
      // For demonstration, we'll simulate an order lookup
      const mockOrderData = {
        id: `order-${Math.floor(Math.random() * 1000)}`,
        orderNumber: code,
        status: 'processing',
        items: [
          { id: 'item1', name: 'T-Shirt', quantity: 1 },
          { id: 'item2', name: 'Jeans', quantity: 1 }
        ]
      };
      
      const scanResult = await storeScan({
        code,
        timestamp: Date.now(),
        scanType: 'order',
        userId,
        userRole,
        status: 'success',
        result: mockOrderData
      });
      
      return scanResult;
    } else {
      // Store for later sync
      const scanResult = await storeScan({
        code,
        timestamp: Date.now(),
        scanType: 'order',
        userId,
        userRole,
        status: 'pending-sync'
      });
      
      return scanResult;
    }
  } catch (error) {
    console.error('Error processing order scan:', error);
    
    const scanResult = await storeScan({
      code,
      timestamp: Date.now(),
      scanType: 'order',
      userId,
      userRole,
      status: 'failed',
      notes: error.message
    });
    
    throw error;
  }
};

// Process a delivery scan
export const processDeliveryScan = async (
  code: string, 
  userId: string, 
  userRole: string, 
  isOnline: boolean
): Promise<ScanResult> => {
  try {
    if (isOnline) {
      // In a real implementation, we would fetch delivery data from the server
      // For demonstration, we'll simulate a delivery confirmation
      const mockDeliveryData = {
        id: `delivery-${Math.floor(Math.random() * 1000)}`,
        orderNumber: code,
        status: 'delivered',
        deliveryTime: new Date().toISOString()
      };
      
      const scanResult = await storeScan({
        code,
        timestamp: Date.now(),
        scanType: 'delivery',
        userId,
        userRole,
        status: 'success',
        result: mockDeliveryData
      });
      
      return scanResult;
    } else {
      // Store for later sync
      const scanResult = await storeScan({
        code,
        timestamp: Date.now(),
        scanType: 'delivery',
        userId,
        userRole,
        status: 'pending-sync'
      });
      
      return scanResult;
    }
  } catch (error) {
    console.error('Error processing delivery scan:', error);
    
    const scanResult = await storeScan({
      code,
      timestamp: Date.now(),
      scanType: 'delivery',
      userId,
      userRole,
      status: 'failed',
      notes: error.message
    });
    
    throw error;
  }
};

// Get scan history
export const getScanHistory = async (limit: number = 50): Promise<ScanResult[]> => {
  const db = await initDB();
  const index = db.transaction('scans').store.index('by-timestamp');
  return index.getAll(null, limit);
};

// Check if the browser is online
export const isOnline = (): boolean => {
  return navigator.onLine;
};
