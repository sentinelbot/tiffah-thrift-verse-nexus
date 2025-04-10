
import Quagga from '@ericblade/quagga2';
import { toast } from 'sonner';

// Check if we're online
export const isOnline = (): boolean => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};

// Local storage key for offline scans
const OFFLINE_SCANS_STORAGE_KEY = 'tiffah_offline_scans';

// Interface for scan record
interface ScanRecord {
  code: string;
  type: 'product' | 'order' | 'delivery';
  timestamp: number;
  scanBy: string;
  location?: GeolocationCoordinates;
  synced: boolean;
  metadata?: Record<string, any>;
}

// Initialize scanner
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
            width: { min: 640 },
            height: { min: 480 },
            facingMode: 'environment',
            aspectRatio: { min: 1, max: 2 },
          },
        },
        locator: {
          patchSize: 'medium',
          halfSample: true,
        },
        numOfWorkers: navigator.hardwareConcurrency || 4,
        decoder: {
          readers: ['code_128_reader', 'ean_reader', 'ean_8_reader', 'code_39_reader', 'code_93_reader', 'upc_reader'],
        },
        locate: true,
      },
      function (err) {
        if (err) {
          console.error('Error initializing Quagga:', err);
          callbacks.onError(err);
          return;
        }
        
        console.log('Quagga initialized successfully');
        Quagga.start();
      }
    );

    Quagga.onDetected((result) => {
      if (result && result.codeResult) {
        // Play success sound
        const audio = new Audio('/sounds/beep.mp3');
        audio.play().catch(e => console.log('Audio playback prevented:', e));
        
        callbacks.onDetected(result);
      }
    });

    // Return cleanup function
    return () => {
      console.log('Stopping Quagga');
      Quagga.stop();
    };
  } catch (error) {
    console.error('Failed to initialize scanner:', error);
    callbacks.onError(error);
    return () => {}; // Return empty cleanup function
  }
};

// Save scan to local storage for offline use
export const saveScanOffline = (scanData: Omit<ScanRecord, 'synced'>): void => {
  try {
    const existingScans: ScanRecord[] = JSON.parse(localStorage.getItem(OFFLINE_SCANS_STORAGE_KEY) || '[]');
    const newScan: ScanRecord = {
      ...scanData,
      synced: false
    };
    
    existingScans.push(newScan);
    localStorage.setItem(OFFLINE_SCANS_STORAGE_KEY, JSON.stringify(existingScans));
    console.log('Scan saved offline:', newScan);
  } catch (error) {
    console.error('Failed to save scan offline:', error);
  }
};

// Get scans from local storage
export const getOfflineScans = (): ScanRecord[] => {
  try {
    return JSON.parse(localStorage.getItem(OFFLINE_SCANS_STORAGE_KEY) || '[]');
  } catch (error) {
    console.error('Failed to get offline scans:', error);
    return [];
  }
};

// Sync offline scans to the server
export const syncScans = async (): Promise<{ synced: number; failed: number }> => {
  if (!isOnline()) {
    return { synced: 0, failed: 0 };
  }
  
  const offlineScans = getOfflineScans();
  const unsyncedScans = offlineScans.filter(scan => !scan.synced);
  
  if (unsyncedScans.length === 0) {
    return { synced: 0, failed: 0 };
  }
  
  let synced = 0;
  let failed = 0;
  
  for (const scan of unsyncedScans) {
    try {
      // In a real implementation, this would send the scan to the server
      // For now, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mark as synced in local storage
      scan.synced = true;
      synced++;
    } catch (error) {
      console.error('Failed to sync scan:', scan, error);
      failed++;
    }
  }
  
  // Update local storage with synced status
  localStorage.setItem(OFFLINE_SCANS_STORAGE_KEY, JSON.stringify(offlineScans));
  
  return { synced, failed };
};

// Process a barcode scan
export const processScan = async (
  code: string,
  type: 'product' | 'order' | 'delivery',
  userId: string,
  metadata?: Record<string, any>
): Promise<boolean> => {
  const scanData = {
    code,
    type,
    timestamp: Date.now(),
    scanBy: userId,
    metadata
  };
  
  if (!isOnline()) {
    toast.info('You are offline. Scan saved locally and will sync when online.');
    saveScanOffline(scanData);
    return true;
  }
  
  try {
    // In a real implementation, this would send the scan to the server
    // For now, we'll just simulate success
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Also save locally for history
    saveScanOffline({...scanData, synced: true});
    return true;
  } catch (error) {
    console.error('Failed to process scan:', error);
    toast.error('Failed to process scan. Saving offline.');
    saveScanOffline(scanData);
    return false;
  }
};

// Get scan history for a specific type and user
export const getScanHistory = async (
  type?: 'product' | 'order' | 'delivery',
  userId?: string,
  limit = 20
): Promise<ScanRecord[]> => {
  // In a real implementation, this would fetch from the server
  // For now, we'll just return from local storage
  const allScans = getOfflineScans();
  
  let filteredScans = allScans;
  
  if (type) {
    filteredScans = filteredScans.filter(scan => scan.type === type);
  }
  
  if (userId) {
    filteredScans = filteredScans.filter(scan => scan.scanBy === userId);
  }
  
  // Sort by timestamp descending (newest first)
  filteredScans.sort((a, b) => b.timestamp - a.timestamp);
  
  return filteredScans.slice(0, limit);
};
