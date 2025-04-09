
import { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { getOnlineStatus, onConnectivityChange } from '@/services/offlineService';
import { cn } from '@/lib/utils';

interface ConnectivityIndicatorProps {
  showText?: boolean;
  className?: string;
}

export const ConnectivityIndicator = ({
  showText = true,
  className
}: ConnectivityIndicatorProps) => {
  const [isOnline, setIsOnline] = useState(getOnlineStatus());
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // When status changes, show the indicator and then hide after 3 seconds
    if (!isOnline) {
      setVisible(true);
    } else {
      // If we come back online, show briefly then hide
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);
  
  useEffect(() => {
    return onConnectivityChange(setIsOnline);
  }, []);
  
  if (!visible && isOnline) return null;
  
  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium shadow-lg transition-opacity",
        isOnline 
          ? "bg-green-500/20 text-green-500 border border-green-500/30" 
          : "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30",
        className
      )}
    >
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4" />
          {showText && <span>Online</span>}
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          {showText && <span>Offline Mode</span>}
        </>
      )}
    </div>
  );
};
