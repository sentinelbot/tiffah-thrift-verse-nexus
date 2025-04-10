
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanBarcode, Truck, Check, X } from 'lucide-react';

const DeliveryScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const startScanning = async () => {
    // Check for camera permission
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
    } catch (error) {
      console.error('Camera permission error:', error);
      setHasPermission(false);
      toast.error('Camera access denied. Please enable camera permissions.');
      return;
    }

    setIsScanning(true);
    toast.info('Scanning for deliveries...');
    
    // Simulate a scan after a short delay
    setTimeout(() => {
      const barcode = 'TTS-DEL-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      setLastScan(barcode);
      setIsScanning(false);
      toast.success(`Successfully scanned: ${barcode}`);
    }, 2000);
  };

  const cancelScanning = () => {
    setIsScanning(false);
    toast.info('Scanning cancelled');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Scanner</CardTitle>
        <CardDescription>
          Scan delivery barcodes to process pickups and deliveries
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isScanning ? (
            <div className="p-12 border rounded-lg flex flex-col items-center justify-center">
              <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-center">Scanning for delivery barcode...</p>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Position the barcode in the center of the camera frame
              </p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={cancelScanning}
              >
                Cancel
              </Button>
            </div>
          ) : lastScan ? (
            <div className="p-6 border rounded-lg">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-4">
                  <Check className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">Delivery Scanned</h3>
                  <p className="text-sm text-muted-foreground">{lastScan}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">
                  Confirm Delivery
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setLastScan(null)}>
                  Scan Again
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-12 border rounded-lg flex flex-col items-center justify-center">
              <Truck className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-center">
                Click "Start Scanning" to begin scanning delivery barcodes
              </p>
              <Button 
                className="mt-6"
                onClick={startScanning}
              >
                Start Scanning
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryScanner;
