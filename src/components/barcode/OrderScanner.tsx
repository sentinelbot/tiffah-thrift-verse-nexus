
import { useState } from 'react';
import BarcodeScanner from './BarcodeScanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { processOrderScan, isOnline } from '@/utils/scannerUtils';
import { toast } from 'sonner';

interface OrderScannerProps {
  onBack?: () => void;
  onScanComplete?: (orderId: string) => void;
}

const OrderScanner = ({ onBack, onScanComplete }: OrderScannerProps) => {
  const [scannedOrder, setScannedOrder] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleScan = async (code: string) => {
    setIsProcessing(true);
    
    try {
      // Process the order scan (in a real app, this would look up the order in the database)
      const success = await processOrderScan(code);
      
      if (success) {
        setScannedOrder(code);
        if (onScanComplete) {
          onScanComplete(code);
        }
      } else {
        toast.error("Failed to process order scan");
      }
    } catch (error) {
      console.error("Error processing order scan:", error);
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
          <CardTitle>Order Scanner</CardTitle>
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
          scannerTitle="Scan Order Barcode"
          scannerInstructions="Position the order barcode in the camera view to scan"
        />
        
        {isProcessing && (
          <div className="mt-4 text-center">
            <p>Processing scan...</p>
          </div>
        )}
        
        {scannedOrder && !isProcessing && (
          <div className="mt-4">
            <h3 className="font-medium">Order Details</h3>
            <p className="text-sm text-muted-foreground">
              Order ID: {scannedOrder}
            </p>
            {/* In a real app, you would display more order details here */}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderScanner;
