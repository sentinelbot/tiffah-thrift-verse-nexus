
import { useState, useEffect } from 'react';
import { 
  getPendingSyncRequests, 
  syncQueuedRequests 
} from '@/services/offlineService';
import { useConnectivity } from './use-connectivity';

export function useOfflineSync() {
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<{synced: number, failed: number} | null>(null);
  const { isOnline } = useConnectivity();
  
  // Check for pending sync requests
  const checkPendingRequests = async () => {
    const requests = await getPendingSyncRequests();
    setPendingCount(requests.length);
    return requests.length;
  };
  
  // Sync pending requests
  const syncRequests = async () => {
    if (!isOnline || isSyncing) return;
    
    setIsSyncing(true);
    try {
      const result = await syncQueuedRequests();
      setLastSyncResult(result);
      await checkPendingRequests();
    } catch (error) {
      console.error('Error syncing requests:', error);
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Check pending requests on mount and when online status changes
  useEffect(() => {
    checkPendingRequests();
    
    // Set up interval to check pending requests every 30 seconds
    const interval = setInterval(checkPendingRequests, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Attempt to sync when coming back online
  useEffect(() => {
    if (isOnline) {
      syncRequests();
    }
  }, [isOnline]);
  
  return {
    pendingCount,
    isSyncing,
    lastSyncResult,
    syncNow: syncRequests,
    checkPending: checkPendingRequests
  };
}
