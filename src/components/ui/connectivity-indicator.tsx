
import { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { getOnlineStatus, onConnectivityChange } from '@/services/offlineService';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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
  const [syncPercentage, setSyncPercentage] = useState(0);
  const [connectionSpeed, setConnectionSpeed] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Function to measure connection speed (very simplified)
  const measureConnectionSpeed = () => {
    if (!isOnline) {
      setConnectionSpeed(null);
      return;
    }
    
    const startTime = Date.now();
    // Load a small image to measure speed
    const img = new Image();
    img.onload = () => {
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000; // seconds
      const imageSize = 5; // assuming 5KB image size
      const speed = (imageSize / duration) * 8; // Speed in Kbps
      setConnectionSpeed(speed);
    };
    img.onerror = () => {
      setConnectionSpeed(null);
    };
    
    // Use a 1x1 pixel transparent image
    img.src = `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7?_=${Date.now()}`;
  };
  
  useEffect(() => {
    // When status changes, show the indicator and then hide after 3 seconds
    if (!isOnline) {
      setVisible(true);
      setSyncPercentage(0);
    } else {
      // If we come back online, show briefly then hide
      setVisible(true);
      // Simulate sync progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTimeout(() => {
            if (!showDetails) {
              setVisible(false);
            }
          }, 1000);
        }
        setSyncPercentage(progress);
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, [isOnline, showDetails]);
  
  useEffect(() => {
    // Measure connection speed periodically
    if (isOnline) {
      measureConnectionSpeed();
      const interval = setInterval(measureConnectionSpeed, 30000); // every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isOnline]);
  
  useEffect(() => {
    return onConnectivityChange(setIsOnline);
  }, []);
  
  if (!visible && isOnline && !showDetails) return null;
  
  const getConnectionQuality = () => {
    if (!connectionSpeed) return null;
    if (connectionSpeed < 200) return "Poor";
    if (connectionSpeed < 500) return "Fair";
    if (connectionSpeed < 1000) return "Good";
    return "Excellent";
  };
  
  const getConnectionColor = () => {
    if (!connectionSpeed) return "text-yellow-500";
    if (connectionSpeed < 200) return "text-red-500";
    if (connectionSpeed < 500) return "text-yellow-500";
    if (connectionSpeed < 1000) return "text-green-400";
    return "text-green-500";
  };
  
  return (
    <Popover open={showDetails} onOpenChange={setShowDetails}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium shadow-lg transition-opacity cursor-pointer",
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
              {syncPercentage < 100 && (
                <span className="text-xs ml-1">Syncing... {Math.round(syncPercentage)}%</span>
              )}
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              {showText && <span>Offline Mode</span>}
            </>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-semibold mb-1">
            {isOnline ? 'Online Mode' : 'Offline Mode'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isOnline 
              ? 'Your device is connected to the internet.' 
              : 'You\'re currently working offline. Changes will sync when connection is restored.'}
          </p>
        </div>
        
        {isOnline && (
          <div className="p-4 space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Connection Quality:</span>
                <span className={`text-sm font-medium ${getConnectionColor()}`}>
                  {getConnectionQuality() || 'Measuring...'}
                </span>
              </div>
              {connectionSpeed && (
                <Progress 
                  value={Math.min(100, (connectionSpeed / 10))} 
                  className="h-2" 
                />
              )}
            </div>
            
            {syncPercentage < 100 ? (
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Data Synchronization:</span>
                  <span className="text-sm font-medium">{Math.round(syncPercentage)}%</span>
                </div>
                <Progress value={syncPercentage} className="h-2" />
              </div>
            ) : (
              <div className="text-sm text-green-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                All data synchronized
              </div>
            )}
          </div>
        )}
        
        {!isOnline && (
          <div className="p-4 space-y-3">
            <div className="text-sm text-muted-foreground">
              While offline, you can still:
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Browse products already loaded</li>
                <li>View cached order information</li>
                <li>Create offline orders (will sync later)</li>
                <li>Process items with previously scanned barcodes</li>
              </ul>
            </div>
          </div>
        )}
        
        <div className="p-4 pt-0 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowDetails(false)}
          >
            Close
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
