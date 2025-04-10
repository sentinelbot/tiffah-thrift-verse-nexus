
import { supabase } from '@/integrations/supabase/client';

// Interface for scan records
interface ScanRecord {
  id?: string;
  code: string;
  type: 'product' | 'order' | 'delivery';
  timestamp: string;
  scanBy: string;
  synced: boolean;
  metadata?: any;
}

// Storage key for local scans
const LOCAL_SCANS_KEY = 'tts_local_scans';

// Check if the device is online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Store a scan record locally
const storeLocalScan = (scan: Omit<ScanRecord, 'synced'>): void => {
  try {
    // Get existing scans
    const existingScansJson = localStorage.getItem(LOCAL_SCANS_KEY);
    const existingScans: ScanRecord[] = existingScansJson ? JSON.parse(existingScansJson) : [];
    
    // Add new scan with synced = false
    existingScans.push({
      ...scan,
      synced: false
    });
    
    // Save back to local storage
    localStorage.setItem(LOCAL_SCANS_KEY, JSON.stringify(existingScans));
  } catch (error) {
    console.error('Error storing local scan:', error);
  }
};

// Submit a scan to the database
const submitScan = async (scan: Omit<ScanRecord, 'synced'>): Promise<boolean> => {
  try {
    // Simulated insert since we don't have the scan_history table yet
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: `Scan: ${scan.code}`,
        price: 0,
        category: scan.type,
        condition: 'new',
        barcode: scan.code,
        status: 'available'
      })
      .select()
      .single();
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error submitting scan:', error);
    return false;
  }
};

// Process a new scan
export const processScan = async (
  code: string,
  type: 'product' | 'order' | 'delivery',
  userId: string,
  metadata?: any
): Promise<boolean> => {
  const scan = {
    code,
    type,
    timestamp: new Date().toISOString(),
    scanBy: userId,
    metadata
  };
  
  if (isOnline()) {
    // If online, send directly to database
    const success = await submitScan(scan);
    
    if (success) {
      return true;
    } else {
      // If submission fails, store locally as fallback
      storeLocalScan(scan);
      return false;
    }
  } else {
    // If offline, store locally to sync later
    storeLocalScan(scan);
    return false;
  }
};

// Sync local scans when coming back online
export const syncScans = async (): Promise<{ synced: number; failed: number }> => {
  if (!isOnline()) {
    return { synced: 0, failed: 0 };
  }
  
  try {
    // Get local scans
    const localScansJson = localStorage.getItem(LOCAL_SCANS_KEY);
    if (!localScansJson) {
      return { synced: 0, failed: 0 };
    }
    
    const localScans: ScanRecord[] = JSON.parse(localScansJson);
    const unsynced = localScans.filter(scan => !scan.synced);
    
    if (unsynced.length === 0) {
      return { synced: 0, failed: 0 };
    }
    
    let synced = 0;
    let failed = 0;
    
    // Process each unsynced scan
    for (const scan of unsynced) {
      const { code, type, timestamp, scanBy, metadata } = scan;
      const success = await submitScan({ code, type, timestamp, scanBy, metadata });
      
      if (success) {
        scan.synced = true;
        synced++;
      } else {
        failed++;
      }
    }
    
    // Update local storage
    localStorage.setItem(LOCAL_SCANS_KEY, JSON.stringify(localScans));
    
    return { synced, failed };
  } catch (error) {
    console.error('Error syncing scans:', error);
    return { synced: 0, failed: 0 };
  }
};

// Get scan history
export const getScanHistory = async (
  type?: 'product' | 'order' | 'delivery',
  userId?: string
): Promise<ScanRecord[]> => {
  // Get local scans first
  const localScansJson = localStorage.getItem(LOCAL_SCANS_KEY);
  const localScans: ScanRecord[] = localScansJson ? JSON.parse(localScansJson) : [];
  
  // Filter by type and userId if provided
  let filteredScans = [...localScans];
  if (type) {
    filteredScans = filteredScans.filter(scan => scan.type === type);
  }
  if (userId) {
    filteredScans = filteredScans.filter(scan => scan.scanBy === userId);
  }
  
  // In a real implementation, this would fetch from the database as well
  // and merge with local unsynced scans
  
  return filteredScans.sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
};

// Initialize barcode scanner
export const initScanner = (
  containerId: string,
  callbacks: {
    onDetected: (result: any) => void;
    onError: (error: any) => void;
  }
): (() => void) => {
  // For demo purposes, just return a dummy cleanup function
  // In real implementation, this would initialize the scanner library
  console.log(`Scanner initialized with container: ${containerId}`);
  
  // Mock detection after 3 seconds
  const timeout = setTimeout(() => {
    callbacks.onDetected({
      codeResult: {
        code: 'TTS-P-20250410-1234'
      }
    });
  }, 3000);
  
  // Return cleanup function
  return () => {
    clearTimeout(timeout);
    console.log('Scanner stopped');
  };
};
