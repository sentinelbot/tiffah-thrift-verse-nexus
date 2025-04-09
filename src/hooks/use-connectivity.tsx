
import { useState, useEffect } from 'react';
import { getOnlineStatus, onConnectivityChange } from '@/services/offlineService';

export function useConnectivity() {
  const [isOnline, setIsOnline] = useState(getOnlineStatus);
  
  useEffect(() => {
    return onConnectivityChange(setIsOnline);
  }, []);
  
  return {
    isOnline,
    isOffline: !isOnline
  };
}
