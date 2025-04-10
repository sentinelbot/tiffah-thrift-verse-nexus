
import { useConnectivity } from '@/hooks/use-connectivity';
import { useOfflineSync } from '@/hooks/use-offline-sync';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OfflineDeliveryNoticeProps {
  className?: string;
}

const OfflineDeliveryNotice = ({ className }: OfflineDeliveryNoticeProps) => {
  const { isOffline } = useConnectivity();
  const { pendingCount, syncNow, isSyncing } = useOfflineSync();
  
  if (!isOffline && pendingCount === 0) return null;
  
  return (
    <div className={`p-4 rounded-lg ${isOffline ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500' : 'bg-blue-500/10 border border-blue-500/20 text-blue-500'} ${className}`}>
      <div className="flex items-start gap-3">
        {isOffline ? (
          <WifiOff className="h-5 w-5 mt-0.5 flex-shrink-0" />
        ) : (
          <RefreshCw className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isSyncing ? 'animate-spin' : ''}`} />
        )}
        <div>
          <h3 className="font-medium text-base">
            {isOffline ? 'Offline Mode Active' : `${pendingCount} Pending Updates`}
          </h3>
          <p className="text-sm mt-1">
            {isOffline 
              ? "You can continue making deliveries. Changes will sync when you're back online."
              : 'You have pending delivery updates to sync.'}
          </p>
          
          {!isOffline && pendingCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20"
              onClick={syncNow}
              disabled={isSyncing}
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfflineDeliveryNotice;
