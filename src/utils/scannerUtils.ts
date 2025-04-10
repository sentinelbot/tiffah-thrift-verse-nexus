
import { supabase } from "@/integrations/supabase/client";
import { generateUniqueBarcode } from "./barcodeUtils";
import { completeScanSync } from "./authUtils";

// IndexedDB database for offline scanning
let db: IDBDatabase | null = null;

// Initialize the scanner using Quagga
export const initScanner = (
  containerId: string,
  callbacks: {
    onDetected: (result: any) => void;
    onError?: (error: any) => void;
  }
): (() => void) => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container element with ID ${containerId} not found`);
    if (callbacks.onError) {
      callbacks.onError(new Error(`Container element with ID ${containerId} not found`));
    }
    return () => {};
  }

  try {
    // For testing purposes with an esm module, we need to use dynamic import
    import('@ericblade/quagga2').then((Quagga) => {
      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: container,
            constraints: {
              width: 640,
              height: 480,
              facingMode: "environment",
            },
          },
          locator: {
            patchSize: "medium",
            halfSample: true,
          },
          numOfWorkers: navigator.hardwareConcurrency || 4,
          decoder: {
            readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader"],
          },
          locate: true,
        },
        (err) => {
          if (err) {
            console.error("Error initializing Quagga:", err);
            if (callbacks.onError) {
              callbacks.onError(err);
            }
            return;
          }

          Quagga.start();

          // Success sound on detection
          const successSound = new Audio('/sounds/beep.mp3');
          
          // Add detection callback
          Quagga.onDetected((result) => {
            // Add visual feedback with animation
            container.classList.add('scan-success');
            setTimeout(() => {
              container.classList.remove('scan-success');
            }, 500);
            
            // Play success sound
            successSound.play().catch((e) => console.log('Sound play error:', e));
            
            // Call the onDetected callback
            callbacks.onDetected(result);
          });

          Quagga.onProcessed((result) => {
            const drawingCtx = Quagga.canvas.ctx.overlay;
            const drawingCanvas = Quagga.canvas.dom.overlay;

            if (result) {
              if (result.boxes) {
                drawingCtx.clearRect(
                  0,
                  0,
                  parseInt(drawingCanvas.getAttribute("width") || "0"),
                  parseInt(drawingCanvas.getAttribute("height") || "0")
                );
                result.boxes
                  .filter((box) => box !== result.box)
                  .forEach((box) => {
                    Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                      color: "green",
                      lineWidth: 2,
                    });
                  });
              }

              if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
                  color: "#ec4899",
                  lineWidth: 2,
                });
              }

              if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(
                  result.line,
                  { x: "x", y: "y" },
                  drawingCtx,
                  { color: "yellow", lineWidth: 3 }
                );
              }
            }
          });
        }
      );
    }).catch((error) => {
      console.error("Error loading Quagga:", error);
      if (callbacks.onError) {
        callbacks.onError(error);
      }
    });

    // Return a cleanup function
    return () => {
      import('@ericblade/quagga2').then((Quagga) => {
        Quagga.stop();
      }).catch(console.error);
    };
  } catch (error) {
    console.error("Error initializing scanner:", error);
    if (callbacks.onError) {
      callbacks.onError(error);
    }
    return () => {};
  }
};

// Initialize offline database
export const initOfflineDb = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(true);
      return;
    }

    const request = indexedDB.open("TiffahScanner", 1);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event);
      reject(new Error("Could not open offline database"));
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores for different scan types
      if (!db.objectStoreNames.contains("pendingScans")) {
        db.createObjectStore("pendingScans", { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(true);
    };
  });
};

// Check if online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Get device info for scanning
export const getDeviceInfo = (): string => {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  return `${platform} - ${userAgent}`;
};

// Process a product scan
export const processProductScan = async (
  barcode: string,
  userId: string,
  userRole: string,
  online: boolean
): Promise<{ status: string; result?: any }> => {
  // Record the scan
  const scanRecord = {
    barcode,
    scan_type: "product",
    scanned_by: userId,
    device_info: getDeviceInfo(),
  };

  if (!online) {
    // Store the scan for later synchronization
    await storePendingScan(scanRecord);
    return { status: "pending-sync" };
  }

  try {
    // First, record the scan in history
    await supabase.from("scan_history").insert([scanRecord]);

    // Then, look up the product
    const { data, error } = await supabase
      .from("products")
      .select("id, name, price, status, barcode")
      .eq("barcode", barcode)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      return { status: "error", result: { message: error.message } };
    }

    if (!data) {
      return { status: "error", result: { message: "Product not found" } };
    }

    return { status: "success", result: data };
  } catch (error) {
    console.error("Error processing product scan:", error);
    return { status: "error", result: { message: "Error processing scan" } };
  }
};

// Process an order scan
export const processOrderScan = async (
  orderNumber: string,
  userId: string,
  userRole: string,
  online: boolean
): Promise<{ status: string; result?: any }> => {
  // Record the scan
  const scanRecord = {
    barcode: orderNumber,
    scan_type: "order",
    scanned_by: userId,
    device_info: getDeviceInfo(),
  };

  if (!online) {
    // Store the scan for later synchronization
    await storePendingScan(scanRecord);
    return { status: "pending-sync" };
  }

  try {
    // First, record the scan in history
    await supabase.from("scan_history").insert([scanRecord]);

    // Then, look up the order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("id, order_number, status, customer_id")
      .eq("order_number", orderNumber)
      .single();

    if (orderError || !orderData) {
      console.error("Error fetching order:", orderError);
      return { 
        status: "error", 
        result: { message: orderError ? orderError.message : "Order not found" } 
      };
    }

    // Get order items
    const { data: itemsData, error: itemsError } = await supabase
      .from("order_items")
      .select(`
        id, 
        quantity, 
        price,
        products(id, name)
      `)
      .eq("order_id", orderData.id);

    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
    }

    const orderResult = {
      id: orderData.id,
      orderNumber: orderData.order_number,
      status: orderData.status,
      items: itemsData?.map(item => ({
        id: item.id,
        name: item.products?.name || "Unknown product",
        quantity: item.quantity
      })) || []
    };

    return { status: "success", result: orderResult };
  } catch (error) {
    console.error("Error processing order scan:", error);
    return { status: "error", result: { message: "Error processing scan" } };
  }
};

// Process a delivery scan
export const processDeliveryScan = async (
  orderNumber: string,
  userId: string,
  userRole: string,
  online: boolean
): Promise<{ status: string; result?: any }> => {
  // Record the scan
  const scanRecord = {
    barcode: orderNumber,
    scan_type: "delivery",
    scanned_by: userId,
    device_info: getDeviceInfo(),
  };

  if (!online) {
    // Store the scan for later synchronization
    await storePendingScan(scanRecord);
    return { status: "pending-sync" };
  }

  try {
    // First, record the scan in history
    await supabase.from("scan_history").insert([scanRecord]);

    // Then, look up the order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("id, order_number, status")
      .eq("order_number", orderNumber)
      .single();

    if (orderError || !orderData) {
      console.error("Error fetching order:", orderError);
      return { 
        status: "error", 
        result: { message: orderError ? orderError.message : "Order not found" } 
      };
    }

    // Get delivery info
    const { data: deliveryData, error: deliveryError } = await supabase
      .from("delivery_info")
      .select("*")
      .eq("order_id", orderData.id)
      .single();

    const deliveryResult = {
      id: orderData.id,
      orderNumber: orderData.order_number,
      status: orderData.status,
      deliveryTime: deliveryData?.estimated_delivery
    };

    return { status: "success", result: deliveryResult };
  } catch (error) {
    console.error("Error processing delivery scan:", error);
    return { status: "error", result: { message: "Error processing scan" } };
  }
};

// Store a scan for later synchronization
const storePendingScan = async (scanData: any): Promise<boolean> => {
  await initOfflineDb();

  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Offline database not initialized"));
      return;
    }

    const transaction = db.transaction(["pendingScans"], "readwrite");
    const store = transaction.objectStore("pendingScans");
    
    // Add timestamp to scan data
    const scan = {
      ...scanData,
      timestamp: new Date().toISOString(),
    };
    
    const request = store.add(scan);
    
    request.onsuccess = () => {
      resolve(true);
    };
    
    request.onerror = (event) => {
      console.error("Error storing pending scan:", event);
      reject(new Error("Failed to store scan"));
    };
  });
};

// Get all pending scans
const getPendingScans = async (): Promise<any[]> => {
  await initOfflineDb();

  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Offline database not initialized"));
      return;
    }

    const transaction = db.transaction(["pendingScans"], "readonly");
    const store = transaction.objectStore("pendingScans");
    const request = store.getAll();
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    request.onerror = (event) => {
      console.error("Error getting pending scans:", event);
      reject(new Error("Failed to retrieve scans"));
    };
  });
};

// Clear pending scans
const clearPendingScans = async (): Promise<boolean> => {
  await initOfflineDb();

  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error("Offline database not initialized"));
      return;
    }

    const transaction = db.transaction(["pendingScans"], "readwrite");
    const store = transaction.objectStore("pendingScans");
    const request = store.clear();
    
    request.onsuccess = () => {
      resolve(true);
    };
    
    request.onerror = (event) => {
      console.error("Error clearing pending scans:", event);
      reject(new Error("Failed to clear scans"));
    };
  });
};

// Synchronize pending scans
export const syncScans = async (): Promise<{synced: number, failed: number}> => {
  if (!isOnline()) {
    return { synced: 0, failed: 0 };
  }

  try {
    const pendingScans = await getPendingScans();
    
    if (pendingScans.length === 0) {
      return { synced: 0, failed: 0 };
    }
    
    // Format scans for insertion
    const formattedScans = pendingScans.map(scan => ({
      barcode: scan.barcode,
      scan_type: scan.scan_type,
      scanned_by: scan.scanned_by,
      device_info: scan.device_info,
      scan_time: scan.timestamp
    }));
    
    // Sync scans to server
    const result = await completeScanSync(formattedScans);
    
    // If successful, clear pending scans
    if (result.synced > 0) {
      await clearPendingScans();
    }
    
    return result;
  } catch (error) {
    console.error("Error syncing scans:", error);
    return { synced: 0, failed: 0 };
  }
};

// Function to create a new barcode
export const generateNewBarcode = (): string => {
  return generateUniqueBarcode();
};
