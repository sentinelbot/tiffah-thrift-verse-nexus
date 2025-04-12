
import { supabase } from '@/integrations/supabase/client';
import { openDB } from 'idb';
import { getBarcodeDataURL } from '@/utils/barcodeUtils';

// Define types needed for our scanner components
export interface ScanResult {
  id: string;
  code: string;
  scanType: string;
  timestamp: number;
  status: string;
  result?: any;
}

// Initialize IndexedDB for offline storage
const initDB = async () => {
  return openDB('tiffah-scan-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('pending-scans')) {
        db.createObjectStore('pending-scans', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

// Check if we're online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Initialize scanner with QuaggaJS
export const initScanner = (containerId: string, options: any): (() => void) => {
  // This would normally use QuaggaJS, but for now we'll just create a stub
  console.log(`Scanner initialized in container ${containerId} with options:`, options);
  
  // Return a cleanup function
  return () => {
    console.log('Scanner stopped');
  };
};

// Process a product scan
export const processProductScan = async (
  barcode: string,
  userId: string,
  userRole: string,
  online: boolean = navigator.onLine
) => {
  try {
    // Record the scan in history (if online) or store for later sync
    const scanData = {
      barcode,
      scan_type: 'product',
      scanned_by: userId,
      device_info: `${navigator.userAgent}`,
      location: null, // Could add geolocation here if needed
    };

    if (online) {
      // We're online - record scan immediately
      await supabase.from('scan_history').insert(scanData);

      // Look up the product
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('barcode', barcode)
        .single();

      if (error) {
        return {
          status: 'error',
          message: 'Product not found',
        };
      }

      // Special actions based on user role
      if (userRole === 'productManager') {
        // Product manager workflow - maybe verify inventory
      } else if (userRole === 'orderPreparer') {
        // Order preparer workflow - maybe mark as picked
      } else if (userRole === 'deliveryStaff') {
        // Delivery staff workflow - maybe mark as loaded
      } else if (userRole === 'admin') {
        // Admin workflow - universal access
      }

      return {
        status: 'success',
        result: {
          id: product.id,
          name: product.name,
          price: product.price,
          status: product.status,
        },
      };
    } else {
      // We're offline - store scan for later
      const db = await initDB();
      await db.add('pending-scans', {
        ...scanData,
        timestamp: new Date().toISOString(),
      });

      return {
        status: 'pending-sync',
        message: 'Scan saved for later synchronization',
      };
    }
  } catch (error) {
    console.error('Error processing scan:', error);
    return {
      status: 'error',
      message: 'Failed to process scan',
    };
  }
};

// Add processDeliveryScan function that was missing
export const processDeliveryScan = async (
  barcode: string,
  userId: string,
  userRole: string,
  online: boolean = navigator.onLine
) => {
  try {
    // Record the scan
    const scanData = {
      barcode,
      scan_type: 'delivery',
      scanned_by: userId,
      device_info: `${navigator.userAgent}`,
    };

    if (online) {
      await supabase.from('scan_history').insert(scanData);

      // Look up the order
      const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', barcode)
        .single();

      if (error) {
        return {
          status: 'error',
          message: 'Order not found',
        };
      }

      return {
        status: 'success',
        result: {
          id: order.id,
          orderNumber: order.order_number,
          status: order.status,
          deliveryTime: new Date().toISOString(),
        },
      };
    } else {
      // Store for later sync
      const db = await initDB();
      await db.add('pending-scans', {
        ...scanData,
        timestamp: new Date().toISOString(),
      });

      return {
        status: 'pending-sync',
        message: 'Delivery scan saved for later synchronization',
      };
    }
  } catch (error) {
    console.error('Error processing delivery scan:', error);
    return {
      status: 'error',
      message: 'Failed to process delivery scan',
    };
  }
};

// Process an order scan
export const processOrderScan = async (
  barcode: string,
  userId: string,
  userRole: string,
  online: boolean = navigator.onLine
) => {
  try {
    // Record the scan
    const scanData = {
      barcode,
      scan_type: 'order',
      scanned_by: userId,
      device_info: `${navigator.userAgent}`,
    };

    if (online) {
      await supabase.from('scan_history').insert(scanData);

      // Look up the order
      const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', barcode)
        .single();

      if (error) {
        return {
          status: 'error',
          message: 'Order not found',
        };
      }

      // Mock items for testing OrderScanner
      const mockItems = [
        { id: '1', name: 'Vintage T-shirt', quantity: 1 },
        { id: '2', name: 'Denim Jacket', quantity: 1 }
      ];

      // Role-specific actions
      if (userRole === 'orderPreparer') {
        // Order preparer might update status to 'processing'
      } else if (userRole === 'deliveryStaff') {
        // Delivery staff might update to 'out for delivery'
      }

      return {
        status: 'success',
        result: {
          id: order.id,
          orderNumber: order.order_number,
          status: order.status,
          customerId: order.customer_id,
          items: mockItems  // Add mock items for now
        },
      };
    } else {
      // Store for later sync
      const db = await initDB();
      await db.add('pending-scans', {
        ...scanData,
        timestamp: new Date().toISOString(),
      });

      return {
        status: 'pending-sync',
        message: 'Order scan saved for later synchronization',
      };
    }
  } catch (error) {
    console.error('Error processing order scan:', error);
    return {
      status: 'error',
      message: 'Failed to process order scan',
    };
  }
};

// Synchronize pending scans when coming back online
export const syncScans = async () => {
  try {
    const db = await initDB();
    const pendingScans = await db.getAll('pending-scans');

    if (pendingScans.length === 0) {
      return { synced: 0 };
    }

    // Prepare the data for bulk processing
    const scansForSync = pendingScans.map(({ id, ...scan }) => scan);

    // Send to server for processing
    const { data, error } = await supabase.functions.invoke('process-pending-scans', {
      body: { scans: scansForSync },
    });

    if (error) {
      throw new Error(error.message);
    }

    // Clear successfully synced scans
    const tx = db.transaction('pending-scans', 'readwrite');
    for (const scan of pendingScans) {
      await tx.store.delete(scan.id);
    }
    await tx.done;

    return { synced: pendingScans.length, result: data };
  } catch (error) {
    console.error('Error syncing pending scans:', error);
    return { synced: 0, error: error.message };
  }
};

// Generate a barcode data URL for display
export const generateBarcodeScanURL = (barcode: string): string => {
  return getBarcodeDataURL(barcode);
};

// Get scan history
export const getScanHistory = async (limit: number = 100): Promise<ScanResult[]> => {
  try {
    const { data, error } = await supabase
      .from('scan_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      code: item.barcode,
      scanType: item.scan_type,
      timestamp: new Date(item.created_at).getTime(),
      status: item.scan_result || 'success'
    }));
  } catch (error) {
    console.error('Error fetching scan history:', error);
    return [];
  }
};
