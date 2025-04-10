
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BarcodeScanner from './BarcodeScanner';
import { processProductScan, isOnline } from '@/utils/scannerUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ProductScanResult {
  id: string;
  name: string;
  price: number;
  status: string;
}

const ProductScanner: React.FC = () => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<ProductScanResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const handleScan = async (code: string) => {
    if (!user) {
      toast.error('You must be logged in to scan products');
      return;
    }

    setIsProcessing(true);
    setScanError(null);
    
    try {
      const online = isOnline();
      const result = await processProductScan(code, user.id, user.role, online);
      
      if (result.status === 'success' && result.result) {
        setScanResult(result.result);
        toast.success('Product scanned successfully');
      } else if (result.status === 'pending-sync') {
        toast.info('Scan saved for later synchronization');
        setScanResult({
          id: 'pending',
          name: `Product with barcode ${code}`,
          price: 0,
          status: 'pending-sync'
        });
      } else {
        throw new Error('Failed to process scan');
      }
    } catch (error) {
      console.error('Scan error:', error);
      setScanError(error.message || 'Failed to process scan');
      toast.error('Error scanning product');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleError = (error: any) => {
    setScanError(`Scanner error: ${error.message || 'Unknown error'}`);
    toast.error('Scanner error');
  };

  const clearResult = () => {
    setScanResult(null);
    setScanError(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Scanner</CardTitle>
        </CardHeader>
        <CardContent>
          <BarcodeScanner 
            onScanSuccess={handleScan}
            onScanError={handleError}
            scannerTitle="Scan Product Barcode"
          />
        </CardContent>
      </Card>

      {isProcessing && (
        <Card>
          <CardContent className="flex items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <p>Processing scan...</p>
          </CardContent>
        </Card>
      )}

      {scanResult && !isProcessing && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Scan Result</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearResult}>
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Product:</span>
                <span>{scanResult.name}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-semibold">ID:</span>
                <span className="font-mono">{scanResult.id}</span>
              </div>
              
              {scanResult.status !== 'pending-sync' && (
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Price:</span>
                  <span>KSh {scanResult.price.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <span className="font-semibold">Status:</span>
                <Badge variant={scanResult.status === 'available' ? 'secondary' : 'default'}>
                  {scanResult.status === 'pending-sync' ? 'Pending Sync' : scanResult.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {scanError && !isProcessing && (
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-destructive">Scan Error</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearResult}>
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p>{scanError}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setScanError(null)}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductScanner;
