
import Quagga from '@ericblade/quagga2';
import { openDB } from 'idb';
import { supabase } from '@/integrations/supabase/client';

// Check if we're online
export const isOnline = (): boolean => {
  return typeof navigator !== 'undefined' && navigator.onLine;
};

// Initialize the barcode scanner
export const initScanner = (containerId: string, options: {
  onDetected: (result: any) => void;
  onError?: (error: any) => void;
}): (() => void) => {
  const container = document.getElementById(containerId);
  
  if (!container) {
    if (options.onError) {
      options.onError(new Error(`Container with ID "${containerId}" not found`));
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
          width: { min: 640 },
          height: { min: 480 },
          facingMode: "environment", // use rear camera on mobile
          aspectRatio: { min: 1, max: 2 }
        },
      },
      locator: {
        patchSize: "medium",
        halfSample: true
      },
      numOfWorkers: 4,
      decoder: {
        readers: [
          "code_128_reader",
          "ean_reader",
          "code_39_reader",
          "code_93_reader"
        ]
      },
      locate: true
    }, (err) => {
      if (err) {
        console.error("Error initializing Quagga:", err);
        if (options.onError) {
          options.onError(err);
        }
        return;
      }
      
      Quagga.start();
      console.log("Quagga started");
      
      // Listen for barcode detection
      Quagga.onDetected((result) => {
        if (result && result.codeResult && result.codeResult.code) {
          console.log("Barcode detected:", result.codeResult.code);
          options.onDetected(result);
        }
      });
      
      // Optional: Process each frame for debugging
      Quagga.onProcessed((result) => {
        const drawingCanvas = Quagga.canvas.dom.overlay;
        const drawingContext = drawingCanvas.getContext("2d");
        
        if (result) {
          if (result.boxes) {
            drawingContext?.clearRect(
              0,
              0,
              parseInt(drawingCanvas.getAttribute("width") || "0"),
              parseInt(drawingCanvas.getAttribute("height") || "0")
            );
            
            result.boxes.filter((box) => box !== result.box).forEach((box) => {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingContext, {
                color: "green",
                lineWidth: 2
              });
            });
          }
          
          if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingContext, {
              color: "#00F",
              lineWidth: 2
            });
          }
          
          if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(
              result.line,
              { x: "x", y: "y" },
              drawingContext,
              { color: "red", lineWidth: 3 }
            );
          }
        }
      });
    });
    
    // Return function to clean up/stop the scanner
    return () => {
      try {
        Quagga.stop();
        console.log("Quagga stopped");
      } catch (error) {
        console.error("Error stopping Quagga:", error);
      }
    };
  } catch (error) {
    console.error("Error setting up scanner:", error);
    if (options.onError) {
      options.onError(error);
    }
    return () => {};
  }
};

// IDB setup for offline scan storage
const dbPromise = openDB('tiffah-store', 1, {
  upgrade(db) {
    db.createObjectStore('pending-scans', { keyPath: 'id', autoIncrement: true });
  },
});

// Process product scan
export const processProductScan = async (
  barcode: string, 
  userId: string,
  userRole: string,
  online: boolean
): Promise<{
  status: 'success' | 'error' | 'pending-sync';
  result?: any;
  error?: string;
}> => {
  // If offline, store scan locally
  if (!online) {
    const db = await dbPromise;
    await db.add('pending-scans', {
      type: 'product',
      barcode,
      userId,
      userRole,
      timestamp: new Date().toISOString(),
    });
    
    return { status: 'pending-sync' };
  }
  
  try {
    // Process online - query the database
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, status')
      .eq('barcode', barcode)
      .single();
    
    if (error) throw error;
    
    // Record scan in scan history
    await supabase
      .from('scan_history')
      .insert({
        barcode,
        scan_type: 'product',
        scanned_by: userId,
        scan_result: 'success',
      });
    
    return {
      status: 'success',
      result: data
    };
  } catch (error) {
    console.error('Error processing product scan:', error);
    return {
      status: 'error',
      error: error.message || 'Failed to process scan'
    };
  }
};

// Process order scan
export const processOrderScan = async (
  orderNumber: string,
  userId: string,
  userRole: string,
  online: boolean
): Promise<{
  status: 'success' | 'error' | 'pending-sync';
  result?: any;
  error?: string;
}> => {
  // If offline, store scan locally
  if (!online) {
    const db = await dbPromise;
    await db.add('pending-scans', {
      type: 'order',
      orderNumber,
      userId,
      userRole,
      timestamp: new Date().toISOString(),
    });
    
    return { status: 'pending-sync' };
  }
  
  try {
    // Process online - query the database
    const { data: order, error } = await supabase
      .from('orders')
      .select('id, order_number, status')
      .eq('order_number', orderNumber)
      .single();
    
    if (error) throw error;
    
    // Get order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        id,
        product_id,
        quantity,
        products(name)
      `)
      .eq('order_id', order.id);
    
    if (itemsError) throw itemsError;
    
    // Format items for response
    const formattedItems = items.map(item => ({
      id: item.id,
      productId: item.product_id,
      name: item.products.name,
      quantity: item.quantity
    }));
    
    // Record scan in scan history
    await supabase
      .from('scan_history')
      .insert({
        barcode: orderNumber,
        scan_type: 'order',
        scanned_by: userId,
        scan_result: 'success',
      });
    
    return {
      status: 'success',
      result: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        items: formattedItems
      }
    };
  } catch (error) {
    console.error('Error processing order scan:', error);
    return {
      status: 'error',
      error: error.message || 'Failed to process scan'
    };
  }
};

// Sync pending scans
export const syncScans = async (): Promise<{ synced: number; failed: number }> => {
  if (!isOnline()) {
    throw new Error('Cannot sync while offline');
  }
  
  const db = await dbPromise;
  const pendingScans = await db.getAll('pending-scans');
  
  if (pendingScans.length === 0) {
    return { synced: 0, failed: 0 };
  }
  
  let synced = 0;
  let failed = 0;
  
  // Process each pending scan
  for (const scan of pendingScans) {
    try {
      if (scan.type === 'product') {
        await processProductScan(scan.barcode, scan.userId, scan.userRole, true);
      } else if (scan.type === 'order') {
        await processOrderScan(scan.orderNumber, scan.userId, scan.userRole, true);
      }
      
      // Remove from pending queue
      await db.delete('pending-scans', scan.id);
      synced++;
    } catch (error) {
      console.error('Failed to sync scan:', scan, error);
      failed++;
    }
  }
  
  return { synced, failed };
};
