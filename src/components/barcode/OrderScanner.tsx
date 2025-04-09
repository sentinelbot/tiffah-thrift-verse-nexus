
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BarcodeScanner from './BarcodeScanner';
import { processOrderScan, isOnline } from '@/utils/scannerUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Check, X } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
}

interface OrderScanResult {
  id: string;
  orderNumber: string;
  status: string;
  items?: OrderItem[];
}

const OrderScanner: React.FC = () => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<OrderScanResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [verifiedItems, setVerifiedItems] = useState<Record<string, boolean>>({});

  const handleScan = async (code: string) => {
    if (!user) {
      toast.error('You must be logged in to scan orders');
      return;
    }

    setIsProcessing(true);
    setScanError(null);
    setVerifiedItems({});
    
    try {
      const online = isOnline();
      const result = await processOrderScan(code, user.id, user.role, online);
      
      if (result.status === 'success' && result.result) {
        setScanResult(result.result);
        toast.success('Order scanned successfully');
        
        // Initialize verification status for all items
        if (result.result.items) {
          const initialVerification: Record<string, boolean> = {};
          result.result.items.forEach(item => {
            initialVerification[item.id] = false;
          });
          setVerifiedItems(initialVerification);
        }
      } else if (result.status === 'pending-sync') {
        toast.info('Scan saved for later synchronization');
        setScanResult({
          id: 'pending',
          orderNumber: code,
          status: 'pending-sync'
        });
      } else {
        throw new Error('Failed to process scan');
      }
    } catch (error) {
      console.error('Scan error:', error);
      setScanError(error.message || 'Failed to process scan');
      toast.error('Error scanning order');
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
    setVerifiedItems({});
  };

  const toggleItemVerification = (itemId: string) => {
    setVerifiedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const allItemsVerified = scanResult?.items 
    ? scanResult.items.every(item => verifiedItems[item.id]) 
    : false;

  const completeOrderVerification = () => {
    toast.success('Order verification completed');
    // In a real app, you would send this to the backend
    clearResult();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Scanner</CardTitle>
        </CardHeader>
        <CardContent>
          <BarcodeScanner 
            onScanSuccess={handleScan}
            onScanError={handleError}
            scannerTitle="Scan Order Barcode"
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
              <CardTitle>Order Information</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearResult}>
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Order Number:</span>
                <span className="font-mono">{scanResult.orderNumber}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="font-semibold">Status:</span>
                <Badge>{scanResult.status}</Badge>
              </div>
              
              {scanResult.items && scanResult.status !== 'pending-sync' && (
                <>
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Items to Verify</h3>
                    <div className="space-y-2">
                      {scanResult.items.map(item => (
                        <div 
                          key={item.id}
                          className={`flex items-center justify-between p-3 rounded-md border ${
                            verifiedItems[item.id] ? 'bg-green-500/10 border-green-500' : 'bg-card border-border'
                          }`}
                        >
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              Qty: {item.quantity}
                            </span>
                          </div>
                          <Button 
                            variant={verifiedItems[item.id] ? "success" : "outline"}
                            size="sm"
                            onClick={() => toggleItemVerification(item.id)}
                          >
                            {verifiedItems[item.id] ? (
                              <>
                                <Check className="h-4 w-4 mr-1" />
                                Verified
                              </>
                            ) : (
                              'Verify'
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button 
                      disabled={!allItemsVerified}
                      onClick={completeOrderVerification}
                    >
                      Complete Verification
                    </Button>
                  </div>
                </>
              )}
              
              {scanResult.status === 'pending-sync' && (
                <div className="py-4 text-center text-muted-foreground">
                  <p>Order details will be available once synchronized</p>
                </div>
              )}
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

export default OrderScanner;
