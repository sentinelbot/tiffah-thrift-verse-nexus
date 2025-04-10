
import { useState } from 'react';
import BarcodeScanner from './BarcodeScanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { processProductScan, isOnline } from '@/utils/scannerUtils';
import { toast } from 'sonner';

interface ProductScannerProps {
  onBack?: () => void;
  onScanComplete?: (productId: string) => void;
}

const ProductScanner = ({ onBack, onScanComplete }: ProductScannerProps) => {
  const [scannedProduct, setScannedProduct] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleScan = async (code: string) => {
    setIsProcessing(true);
    
    try {
      // Process the product scan (in a real app, this would look up the product in the database)
      const success = await processProductScan(code);
      
      if (success) {
        setScannedProduct(code);
        if (onScanComplete) {
          onScanComplete(code);
        }
      } else {
        toast.error("Failed to process product scan");
      }
    } catch (error) {
      console.error("Error processing product scan:", error);
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
          <CardTitle>Product Scanner</CardTitle>
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
          scannerTitle="Scan Product Barcode"
          scannerInstructions="Position the product barcode in the camera view to scan"
        />
        
        {isProcessing && (
          <div className="mt-4 text-center">
            <p>Processing scan...</p>
          </div>
        )}
        
        {scannedProduct && !isProcessing && (
          <div className="mt-4">
            <h3 className="font-medium">Product Details</h3>
            <p className="text-sm text-muted-foreground">
              Product ID: {scannedProduct}
            </p>
            {/* In a real app, you would display more product details here */}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductScanner;
