import Quagga from "@ericblade/quagga2";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Local storage key for pending scans
const PENDING_SCANS_KEY = 'tiffah_pending_scans';

// Check online status
export const isOnline = (): boolean => {
  return typeof navigator !== 'undefined' && navigator.onLine;
};

// Initialize scanner
export interface ScannerOptions {
  onDetected?: (result: any) => void;
  onError?: (error: any) => void;
  onProcessed?: (result: any) => void;
}

export const initScanner = (containerId: string, options: ScannerOptions): (() => void) => {
  const container = document.getElementById(containerId);
  
  if (!container) {
    console.error(`Container with id ${containerId} not found`);
    if (options.onError) {
      options.onError(new Error(`Container with id ${containerId} not found`));
    }
    return () => {};
  }
  
  try {
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: container,
        constraints: {
          facingMode: "environment",
          width: 640,
          height: 480,
        },
      },
      locator: {
        patchSize: "medium",
        halfSample: true,
      },
      numOfWorkers: navigator.hardwareConcurrency || 4,
      decoder: {
        readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader", "code_93_reader", "upc_reader"],
      },
      locate: true,
    }, (err) => {
      if (err) {
        console.error("Error initializing Quagga", err);
        if (options.onError) {
          options.onError(err);
        }
        return;
      }
      
      console.log("Quagga initialized successfully");
      
      // Start the scanner
      Quagga.start();
      
      // Set up event listeners
      if (options.onDetected) {
        Quagga.onDetected(options.onDetected);
      }
      
      if (options.onProcessed) {
        Quagga.onProcessed((result) => {
          // Draw the result on the canvas if available
          if (result && result.codeResult && Quagga.canvas.ctx.overlay) {
            const canvas = Quagga.canvas.dom.overlay;
            
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            // Draw a border around the detected barcode
            if (result.boxes) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              
              const drawingCanvas = document.querySelector('#barcode-scanner-container canvas.drawingBuffer');
              if (drawingCanvas) {
                // Set the canvas size to match the drawing buffer
                canvas.width = drawingCanvas.width;
                canvas.height = drawingCanvas.height;
              }
              
              result.boxes.filter(box => box !== result.box).forEach(box => {
                Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, ctx, { color: 'green', lineWidth: 2 });
              });
            }
            
            if (result.box) {
              Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, ctx, { color: '#00F', lineWidth: 2 });
            }
            
            if (result.codeResult && result.codeResult.code) {
              Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, ctx, { color: 'red', lineWidth: 3 });
            }
          }
          
          if (options.onProcessed) {
            options.onProcessed(result);
          }
        });
      }
    });
    
    // Return a function to stop the scanner
    return () => {
      try {
        Quagga.stop();
      } catch (error) {
        console.error("Error stopping Quagga", error);
      }
    };
  } catch (error) {
    console.error("Error initializing scanner", error);
    if (options.onError) {
      options.onError(error);
    }
    return () => {};
  }
};

// Queue scans for offline mode
interface PendingScan {
  barcode: string;
  scan_type: string;
  scanned_by: string;
  device_info: string;
  timestamp: number;
}

// Get pending scans from local storage
const getPendingScans = (): PendingScan[] => {
  try {
    const pendingScansString = localStorage.getItem(PENDING_SCANS_KEY);
    return pendingScansString ? JSON.parse(pendingScansString) : [];
  } catch (error) {
    console.error('Error retrieving pending scans', error);
    return [];
  }
};

// Add a scan to the pending queue
const addPendingScan = (scan: PendingScan): void => {
  try {
    const pendingScans = getPendingScans();
    pendingScans.push(scan);
    localStorage.setItem(PENDING_SCANS_KEY, JSON.stringify(pendingScans));
  } catch (error) {
    console.error('Error adding pending scan', error);
  }
};

// Clear the pending scans from local storage
const clearPendingScans = (): void => {
  localStorage.removeItem(PENDING_SCANS_KEY);
};

// Process a product scan
export const processProductScan = async (
  barcode: string,
  userId: string,
  role: string,
  online: boolean
): Promise<{ status: string; result?: any }> => {
  try {
    // Always log the scan
    const deviceInfo = navigator.userAgent;
    
    // If offline, queue the scan for later
    if (!online) {
      const pendingScan: PendingScan = {
        barcode,
        scan_type: 'product',
        scanned_by: userId,
        device_info: deviceInfo,
        timestamp: Date.now()
      };
      
      addPendingScan(pendingScan);
      
      return { status: 'pending-sync' };
    }
    
    // If online, process immediately
    // First save the scan history
    try {
      await supabase
        .from('scan_history')
        .insert([{
          barcode,
          scan_type: 'product',
          scanned_by: userId,
          device_info: deviceInfo
        }]);
    } catch (error) {
      console.error('Error logging scan history:', error);
      // Continue even if logging fails
    }
    
    // Then fetch the product information
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('barcode', barcode)
      .single();
    
    if (error) {
      throw new Error(`Product not found: ${error.message}`);
    }
    
    return {
      status: 'success',
      result: {
        id: product.id,
        name: product.name,
        price: product.price,
        status: product.status
      }
    };
  } catch (error) {
    console.error('Error processing product scan:', error);
    throw error;
  }
};

// Process an order scan
export const processOrderScan = async (
  orderNumber: string,
  userId: string,
  role: string,
  online: boolean
): Promise<{ status: string; result?: any }> => {
  try {
    // Always log the scan
    const deviceInfo = navigator.userAgent;
    
    // If offline, queue the scan for later
    if (!online) {
      const pendingScan: PendingScan = {
        barcode: orderNumber,
        scan_type: 'order',
        scanned_by: userId,
        device_info: deviceInfo,
        timestamp: Date.now()
      };
      
      addPendingScan(pendingScan);
      
      return { status: 'pending-sync' };
    }
    
    // If online, process immediately
    // First save the scan history
    try {
      await supabase
        .from('scan_history')
        .insert([{
          barcode: orderNumber,
          scan_type: 'order',
          scanned_by: userId,
          device_info: deviceInfo
        }]);
    } catch (error) {
      console.error('Error logging scan history:', error);
      // Continue even if logging fails
    }
    
    // Then fetch the order information
    // Simulated data - in a real application we would fetch from the database
    // In this simulation we're using a simple prefix check
    let orderItems = [];
    
    // If the scan is a valid order (starts with TTS-) then fetch order details
    if (orderNumber.startsWith('TTS-')) {
      // Fetch order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber)
        .single();
      
      if (orderError) {
        throw new Error(`Order not found: ${orderError.message}`);
      }
      
      // Fetch order items
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);
      
      if (itemsError) {
        console.error('Error fetching order items:', itemsError);
        // Continue with empty items
      } else {
        orderItems = items.map(item => ({
          id: item.id,
          name: `Product #${item.product_id}`, // In a real app, we'd join with the products table
          quantity: item.quantity
        }));
      }
      
      return {
        status: 'success',
        result: {
          id: order.id,
          orderNumber: order.order_number,
          status: order.status,
          items: orderItems
        }
      };
    } else {
      throw new Error('Invalid order format');
    }
  } catch (error) {
    console.error('Error processing order scan:', error);
    throw error;
  }
};

// Process a delivery scan
export const processDeliveryScan = async (
  orderNumber: string,
  userId: string,
  role: string,
  online: boolean
): Promise<{ status: string; result?: any }> => {
  try {
    // Always log the scan
    const deviceInfo = navigator.userAgent;
    
    // If offline, queue the scan for later
    if (!online) {
      const pendingScan: PendingScan = {
        barcode: orderNumber,
        scan_type: 'delivery',
        scanned_by: userId,
        device_info: deviceInfo,
        timestamp: Date.now()
      };
      
      addPendingScan(pendingScan);
      
      return { status: 'pending-sync' };
    }
    
    // If online, process immediately
    // First save the scan history
    try {
      await supabase
        .from('scan_history')
        .insert([{
          barcode: orderNumber,
          scan_type: 'delivery',
          scanned_by: userId,
          device_info: deviceInfo
        }]);
    } catch (error) {
      console.error('Error logging scan history:', error);
      // Continue even if logging fails
    }
    
    // Then fetch the order information
    // Simulated data - in a real application we would fetch from the database
    
    // If the scan is a valid order (starts with TTS-) then fetch order details
    if (orderNumber.startsWith('TTS-')) {
      // Fetch order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber)
        .single();
        
      if (orderError) {
        throw new Error(`Order not found: ${orderError.message}`);
      }
      
      // Fetch delivery info
      const { data: delivery, error: deliveryError } = await supabase
        .from('delivery_info')
        .select('*')
        .eq('order_id', order.id)
        .single();
      
      // The delivery info may not exist yet
      const estimatedDelivery = delivery?.estimated_delivery || null;
      
      return {
        status: 'success',
        result: {
          id: order.id,
          orderNumber: order.order_number,
          status: order.status,
          deliveryTime: estimatedDelivery
        }
      };
    } else {
      throw new Error('Invalid order format');
    }
  } catch (error) {
    console.error('Error processing delivery scan:', error);
    throw error;
  }
};

// Synchronize pending scans
export const syncScans = async (): Promise<{synced: number, failed: number}> => {
  if (!isOnline()) {
    return { synced: 0, failed: 0 };
  }
  
  try {
    const pendingScans = getPendingScans();
    
    if (pendingScans.length === 0) {
      return { synced: 0, failed: 0 };
    }
    
    console.log(`Syncing ${pendingScans.length} pending scans...`);
    
    let synced = 0;
    let failed = 0;
    
    // Process in batches for better performance
    const batchSize = 10;
    for (let i = 0; i < pendingScans.length; i += batchSize) {
      const batch = pendingScans.slice(i, i + batchSize);
      
      try {
        // Send scans to the server
        const { error } = await supabase
          .from('scan_history')
          .insert(batch.map(scan => ({
            barcode: scan.barcode,
            scan_type: scan.scan_type,
            scanned_by: scan.scanned_by,
            device_info: scan.device_info,
            created_at: new Date(scan.timestamp).toISOString()
          })));
        
        if (error) {
          console.error('Error syncing scans batch:', error);
          failed += batch.length;
        } else {
          synced += batch.length;
        }
      } catch (error) {
        console.error('Error in sync batch processing:', error);
        failed += batch.length;
      }
    }
    
    // Clear all synced scans if we've processed them all successfully
    if (failed === 0) {
      clearPendingScans();
    } else {
      // Only keep the failed scans
      const remaining = pendingScans.slice(synced);
      localStorage.setItem(PENDING_SCANS_KEY, JSON.stringify(remaining));
    }
    
    return { synced, failed };
  } catch (error) {
    console.error('Error in syncScans:', error);
    return { synced: 0, failed: 0 };
  }
};
