
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Product } from '@/types';
import { OrderItem, ShippingInfo, PaymentInfo, Order } from '@/types/order';
import { toast } from 'sonner';

interface TiffahDB extends DBSchema {
  products: {
    key: string;
    value: Product;
    indexes: {
      'by-category': string;
      'by-status': string;
    };
  };
  carts: {
    key: string;
    value: {
      id: string;
      userId: string;
      items: {
        product: Product;
        quantity: number;
        reservedUntil: Date;
      }[];
      lastUpdated: Date;
    };
  };
  orders: {
    key: string;
    value: Order;
    indexes: {
      'by-status': string;
    };
  };
  sync_queue: {
    key: string;
    value: {
      id: string;
      url: string;
      method: string;
      body: any;
      headers: Record<string, string>;
      timestamp: number;
      type: 'cart' | 'order' | 'product' | 'user' | 'other';
      retries: number;
    };
    indexes: {
      'by-timestamp': number;
      'by-type': string;
    };
  };
  user_preferences: {
    key: string;
    value: {
      userId: string;
      theme: 'light' | 'dark';
      notifications: boolean;
      lastSyncTimestamp: number;
    };
  };
}

// Database name and version
const DB_NAME = 'tiffah-offline-db';
const DB_VERSION = 1;

// Initialize database
const initDB = async (): Promise<IDBPDatabase<TiffahDB>> => {
  return openDB<TiffahDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Products store
      if (!db.objectStoreNames.contains('products')) {
        const productStore = db.createObjectStore('products', { keyPath: 'id' });
        productStore.createIndex('by-category', 'category');
        productStore.createIndex('by-status', 'status');
      }

      // Carts store
      if (!db.objectStoreNames.contains('carts')) {
        db.createObjectStore('carts', { keyPath: 'id' });
      }

      // Orders store
      if (!db.objectStoreNames.contains('orders')) {
        const orderStore = db.createObjectStore('orders', { keyPath: 'id' });
        orderStore.createIndex('by-status', 'status');
      }

      // Sync queue store
      if (!db.objectStoreNames.contains('sync_queue')) {
        const syncStore = db.createObjectStore('sync_queue', { keyPath: 'id' });
        syncStore.createIndex('by-timestamp', 'timestamp');
        syncStore.createIndex('by-type', 'type');
      }

      // User preferences store
      if (!db.objectStoreNames.contains('user_preferences')) {
        db.createObjectStore('user_preferences', { keyPath: 'userId' });
      }
    },
  });
};

// Connectivity state
let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
const listeners: ((online: boolean) => void)[] = [];

// Register online/offline event listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    isOnline = true;
    notifyListeners();
    syncQueuedRequests().catch(console.error);
  });

  window.addEventListener('offline', () => {
    isOnline = false;
    notifyListeners();
  });
}

// Notify all listeners of connectivity changes
const notifyListeners = () => {
  listeners.forEach(listener => listener(isOnline));
};

// Listen for connectivity changes
export const onConnectivityChange = (callback: (online: boolean) => void) => {
  listeners.push(callback);
  callback(isOnline);

  return () => {
    const index = listeners.indexOf(callback);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };
};

// Get current online status
export const getOnlineStatus = () => isOnline;

// Products operations
export const saveProductsOffline = async (products: Product[]) => {
  const db = await initDB();
  const tx = db.transaction('products', 'readwrite');
  
  await Promise.all(
    products.map(product => tx.store.put(product))
  );
  
  await tx.done;
};

export const getOfflineProducts = async (): Promise<Product[]> => {
  const db = await initDB();
  return db.getAll('products');
};

export const getOfflineProductById = async (id: string): Promise<Product | undefined> => {
  const db = await initDB();
  return db.get('products', id);
};

export const getOfflineProductsByCategory = async (category: string): Promise<Product[]> => {
  const db = await initDB();
  const index = db.transaction('products', 'readonly').store.index('by-category');
  return index.getAll(category);
};

// Cart operations
export const saveCartOffline = async (cart: any) => {
  const db = await initDB();
  await db.put('carts', cart);
};

export const getOfflineCart = async (userId: string): Promise<any | undefined> => {
  const db = await initDB();
  const carts = await db.getAll('carts');
  return carts.find(cart => cart.userId === userId);
};

// Orders operations
export const saveOrderOffline = async (order: Order) => {
  const db = await initDB();
  await db.put('orders', order);
  
  // If offline, queue for sync
  if (!isOnline) {
    await addToSyncQueue({
      url: '/api/orders',
      method: 'POST',
      body: JSON.stringify(order),
      headers: { 'Content-Type': 'application/json' },
      type: 'order'
    });
    
    toast.info('You are offline. Your order will be synchronized when you are back online.', {
      duration: 5000
    });
  }
};

export const getOfflineOrders = async (userId: string): Promise<Order[]> => {
  const db = await initDB();
  const orders = await db.getAll('orders');
  return orders.filter(order => order.customer.id === userId);
};

// Sync queue operations
export const addToSyncQueue = async ({
  url,
  method,
  body,
  headers = {},
  type = 'other'
}: {
  url: string;
  method: string;
  body: any;
  headers?: Record<string, string>;
  type?: 'cart' | 'order' | 'product' | 'user' | 'other';
}) => {
  const db = await initDB();
  
  const id = `sync_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  
  await db.add('sync_queue', {
    id,
    url,
    method,
    body,
    headers,
    timestamp: Date.now(),
    type,
    retries: 0
  });
};

export const getPendingSyncRequests = async () => {
  const db = await initDB();
  return db.getAll('sync_queue');
};

export const removeSyncRequest = async (id: string) => {
  const db = await initDB();
  await db.delete('sync_queue', id);
};

export const syncQueuedRequests = async () => {
  if (!isOnline) return { synced: 0, failed: 0 };
  
  const pendingRequests = await getPendingSyncRequests();
  if (pendingRequests.length === 0) return { synced: 0, failed: 0 };
  
  let synced = 0;
  let failed = 0;
  
  for (const request of pendingRequests) {
    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body
      });
      
      if (response.ok) {
        await removeSyncRequest(request.id);
        synced++;
      } else {
        // Increment retry count on failure
        request.retries++;
        if (request.retries < 5) {
          const db = await initDB();
          await db.put('sync_queue', request);
        } else {
          // Remove after max retries
          await removeSyncRequest(request.id);
        }
        failed++;
      }
    } catch (error) {
      failed++;
    }
  }
  
  if (synced > 0) {
    toast.success(`Successfully synchronized ${synced} pending ${synced === 1 ? 'request' : 'requests'}`);
  }
  
  return { synced, failed };
};

// User preferences
export const saveUserPreferences = async (preferences: any) => {
  const db = await initDB();
  await db.put('user_preferences', preferences);
};

export const getUserPreferences = async (userId: string) => {
  const db = await initDB();
  return db.get('user_preferences', userId) || {
    userId,
    theme: 'dark',
    notifications: true,
    lastSyncTimestamp: 0
  };
};

// Initialize the database
export const initializeOfflineService = async () => {
  await initDB();
  
  // Register service worker
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/serviceWorker.js');
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    } catch (err) {
      console.log('ServiceWorker registration failed: ', err);
    }
  }
  
  // Try to sync on startup
  if (isOnline) {
    await syncQueuedRequests();
  }
};
