
import { useState } from 'react';
import BarcodeScanner from './BarcodeScanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { processDeliveryScan, isOnline } from '@/utils/scannerUtils';
import { toast } from 'sonner';

interface DeliveryScannerProps {
  onBack?: () => void;
  onScan?: (code: string) => void;
  onScanComplete?: (deliveryId: string) => void;
}

const DeliveryScanner = ({ onBack, onScan, onScanComplete }: DeliveryScannerProps) => {
  const [scannedDelivery, setScannedDelivery] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleScan = async (code: string) => {
    setIsProcessing(true);
    
    try {
      // Process the delivery scan (in a real app, this would update delivery status in the database)
      const success = await processDeliveryScan(code);
      
      if (success) {
        setScannedDelivery(code);
        if (onScan) {
          onScan(code);
        }
        if (onScanComplete) {
          onScanComplete(code);
        }
      } else {
        toast.error("Failed to process delivery scan");
      }
    } catch (error) {
      console.error("Error processing delivery scan:", error);
      toast.error("An error occurred while processing the scan");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const isOffline = !isOnline();
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          {onBack && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack} 
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <CardTitle>Delivery Scanner</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {isOffline && (
          <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-md mb-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              You're currently offline. Scans will be saved and synchronized when you're back online.
            </p>
          </div>
        )}
        
        <BarcodeScanner 
          onScan={handleScan} 
          scannerTitle="Scan Delivery Barcode"
          scannerInstructions="Position the delivery barcode in the camera view to scan"
        />
        
        {isProcessing && (
          <div className="mt-4 text-center">
            <p>Processing scan...</p>
          </div>
        )}
        
        {scannedDelivery && !isProcessing && (
          <div className="mt-4">
            <h3 className="font-medium">Delivery Details</h3>
            <p className="text-sm text-muted-foreground">
              Delivery ID: {scannedDelivery}
            </p>
            {/* In a real app, you would display more delivery details here */}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveryScanner;
