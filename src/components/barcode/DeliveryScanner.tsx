
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BarcodeScanner from './BarcodeScanner';
import { processDeliveryScan, isOnline } from '@/utils/scannerUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Camera, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface DeliveryScanResult {
  id: string;
  orderNumber: string;
  status: string;
  deliveryTime?: string;
}

const DeliveryScanner: React.FC = () => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<DeliveryScanResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [showProofCapture, setShowProofCapture] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState<{lat: number, lng: number} | null>(null);

  const handleScan = async (code: string) => {
    if (!user) {
      toast.error('You must be logged in to scan deliveries');
      return;
    }

    setIsProcessing(true);
    setScanError(null);
    
    try {
      const online = isOnline();
      const result = await processDeliveryScan(code, user.id, user.role, online);
      
      if (result.status === 'success' && result.result) {
        setScanResult(result.result);
        toast.success('Delivery scanned successfully');
        
        // Try to get current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setDeliveryLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
            },
            (error) => {
              console.warn('Geolocation error:', error);
              toast.warning('Could not get location for delivery');
            }
          );
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
      toast.error('Error scanning delivery');
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
    setDeliveryNotes('');
    setShowProofCapture(false);
    setDeliveryLocation(null);
  };

  const captureDeliveryProof = () => {
    setShowProofCapture(true);
  };

  const completeDelivery = () => {
    // In a real app, you would upload the proof photo, notes, and location
    toast.success('Delivery confirmed successfully');
    clearResult();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Delivery Scanner</CardTitle>
        </CardHeader>
        <CardContent>
          <BarcodeScanner 
            onScanSuccess={handleScan}
            onScanError={handleError}
            scannerTitle="Scan Order for Delivery"
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
              <CardTitle>Delivery Information</CardTitle>
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
              
              {scanResult.deliveryTime && (
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Delivery Time:</span>
                  <span>{new Date(scanResult.deliveryTime).toLocaleString()}</span>
                </div>
              )}
              
              {scanResult.status !== 'pending-sync' && (
                <>
                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="delivery-notes">Delivery Notes</Label>
                      <Textarea 
                        id="delivery-notes"
                        placeholder="Add notes about this delivery..."
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Proof of Delivery</Label>
                        {!showProofCapture && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={captureDeliveryProof}
                          >
                            <Camera className="h-4 w-4 mr-1" />
                            Capture Photo
                          </Button>
                        )}
                      </div>
                      
                      {showProofCapture && (
                        <div className="border rounded-md p-6 bg-black/5 flex flex-col items-center justify-center">
                          <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Camera would activate here to capture proof of delivery
                          </p>
                          <Button 
                            variant="default" 
                            size="sm"
                            className="mt-4"
                          >
                            Take Photo
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {deliveryLocation && (
                      <div className="space-y-2">
                        <Label>Delivery Location</Label>
                        <div className="p-3 border rounded-md flex items-center">
                          <MapPin className="h-5 w-5 mr-2 text-primary" />
                          <span className="text-sm">
                            Location captured: {deliveryLocation.lat.toFixed(6)}, {deliveryLocation.lng.toFixed(6)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button onClick={completeDelivery}>
                      Confirm Delivery
                    </Button>
                  </div>
                </>
              )}
              
              {scanResult.status === 'pending-sync' && (
                <div className="py-4 text-center text-muted-foreground">
                  <p>Delivery details will be available once synchronized</p>
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

export default DeliveryScanner;
