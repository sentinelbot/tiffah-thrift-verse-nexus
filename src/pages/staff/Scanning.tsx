
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ScanBarcode, Package, ShoppingBag, Truck, History, 
  AlertCircle, Check, X, ChevronDown, ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const Scanning = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('history');
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);
  const [scanType, setScanType] = useState('product');
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Determine which tabs to show based on user role
  const showProductTab = user?.role === 'admin' || user?.role === 'productManager';
  const showOrderTab = user?.role === 'admin' || user?.role === 'orderPreparer';
  const showDeliveryTab = user?.role === 'admin' || user?.role === 'deliveryStaff';

  useEffect(() => {
    // Set default tab based on user role
    if (user?.role === 'productManager' && showProductTab) {
      setActiveTab('product');
    } else if (user?.role === 'orderPreparer' && showOrderTab) {
      setActiveTab('order');
    } else if (user?.role === 'deliveryStaff' && showDeliveryTab) {
      setActiveTab('delivery');
    } else {
      setActiveTab('history');
    }
    
    // Load initial scan history
    loadScanHistory();
  }, [user]);

  const loadScanHistory = async () => {
    // This would fetch from API in a real implementation
    setScanHistory([
      {
        id: '1',
        barcode: 'TTS-PROD-001',
        scanType: 'product',
        timestamp: new Date().toISOString(),
        result: 'Vintage Denim Jacket'
      },
      {
        id: '2',
        barcode: 'TTS-ORDER-123',
        scanType: 'order',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        result: 'Order #TTS-20230101-1234'
      }
    ]);
  };

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
    toast.info(`Scanning for ${scanType}...`);
    
    // Simulate a scan after a short delay
    setTimeout(() => {
      let barcode;
      switch (scanType) {
        case 'product':
          barcode = 'TTS-PROD-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
          break;
        case 'order':
          barcode = 'TTS-ORDER-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
          break;
        case 'delivery':
          barcode = 'TTS-DEL-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
          break;
        default:
          barcode = 'TTS-UNKNOWN-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      }

      setLastScan(barcode);
      setIsScanning(false);
      
      // Create a new scan history entry
      const newScanHistory = [
        {
          id: Date.now().toString(),
          barcode,
          scanType,
          timestamp: new Date().toISOString(),
          result: `${scanType.charAt(0).toUpperCase() + scanType.slice(1)} item found`
        },
        ...scanHistory
      ];
      
      setScanHistory(newScanHistory);
      toast.success(`Successfully scanned: ${barcode}`);
    }, 2000);
  };

  const cancelScanning = () => {
    setIsScanning(false);
    toast.info('Scanning cancelled');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Barcode Scanning</h1>
          <p className="text-muted-foreground">Scan barcodes for products, orders, and deliveries</p>
        </div>
        
        {isScanning ? (
          <Button variant="destructive" onClick={cancelScanning}>
            Cancel Scanning
          </Button>
        ) : (
          <Button onClick={startScanning}>
            <ScanBarcode className="mr-2 h-4 w-4" />
            Start Scanning
          </Button>
        )}
      </div>

      {hasPermission === false && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Camera Access Denied</AlertTitle>
          <AlertDescription>
            Please enable camera access in your browser settings to use the barcode scanner.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="mb-6">
          <TabsList className="grid grid-cols-4">
            {showProductTab && (
              <TabsTrigger value="product">
                <Package className="h-4 w-4 mr-2" />
                Products
              </TabsTrigger>
            )}
            {showOrderTab && (
              <TabsTrigger value="order">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Orders
              </TabsTrigger>
            )}
            {showDeliveryTab && (
              <TabsTrigger value="delivery">
                <Truck className="h-4 w-4 mr-2" />
                Deliveries
              </TabsTrigger>
            )}
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>
        </div>

        {showProductTab && (
          <TabsContent value="product">
            <Card>
              <CardHeader>
                <CardTitle>Product Scanning</CardTitle>
                <CardDescription>
                  Scan product barcodes to view or update product information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select 
                    value={scanType} 
                    onValueChange={(value) => setScanType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select scan action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">View Product</SelectItem>
                      <SelectItem value="inventory">Update Inventory</SelectItem>
                      <SelectItem value="location">Update Location</SelectItem>
                      <SelectItem value="price">Update Price</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {isScanning ? (
                    <div className="p-12 border rounded-lg flex flex-col items-center justify-center">
                      <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-center">Scanning for product barcode...</p>
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
                          <h3 className="font-medium">Barcode Scanned</h3>
                          <p className="text-sm text-muted-foreground">{lastScan}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1" onClick={() => navigate(`/staff/products/${lastScan}`)}>
                          View Product
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => setLastScan(null)}>
                          Scan Again
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 border rounded-lg flex flex-col items-center justify-center">
                      <ScanBarcode className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-center">
                        Click "Start Scanning" to begin scanning product barcodes
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
          </TabsContent>
        )}
        
        {showOrderTab && (
          <TabsContent value="order">
            <Card>
              <CardHeader>
                <CardTitle>Order Scanning</CardTitle>
                <CardDescription>
                  Scan order barcodes to view or update order information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select 
                    value={scanType} 
                    onValueChange={(value) => setScanType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select scan action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="order">View Order</SelectItem>
                      <SelectItem value="process">Process Order</SelectItem>
                      <SelectItem value="package">Package Order</SelectItem>
                      <SelectItem value="status">Update Status</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {isScanning ? (
                    <div className="p-12 border rounded-lg flex flex-col items-center justify-center">
                      <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-center">Scanning for order barcode...</p>
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
                          <h3 className="font-medium">Order Barcode Scanned</h3>
                          <p className="text-sm text-muted-foreground">{lastScan}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1" onClick={() => navigate(`/staff/orders/${lastScan}`)}>
                          View Order
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => setLastScan(null)}>
                          Scan Again
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 border rounded-lg flex flex-col items-center justify-center">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-center">
                        Click "Start Scanning" to begin scanning order barcodes
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
          </TabsContent>
        )}
        
        {showDeliveryTab && (
          <TabsContent value="delivery">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Scanning</CardTitle>
                <CardDescription>
                  Scan delivery barcodes for pickup, delivery, and confirmation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select 
                    value={scanType} 
                    onValueChange={(value) => setScanType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select scan action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pickup">Pickup Confirmation</SelectItem>
                      <SelectItem value="delivery">Delivery Confirmation</SelectItem>
                      <SelectItem value="verify">ID Verification</SelectItem>
                      <SelectItem value="return">Process Return</SelectItem>
                    </SelectContent>
                  </Select>
                  
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
                          <h3 className="font-medium">Delivery Barcode Scanned</h3>
                          <p className="text-sm text-muted-foreground">{lastScan}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1" onClick={() => navigate(`/staff/deliveries/${lastScan}`)}>
                          Process Delivery
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
          </TabsContent>
        )}
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Scan History</CardTitle>
              <CardDescription>
                View your recent barcode scans
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scanHistory.length === 0 ? (
                <div className="p-12 border rounded-lg flex flex-col items-center justify-center">
                  <History className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-center">
                    No scan history yet
                  </p>
                  <Button 
                    className="mt-6"
                    onClick={startScanning}
                  >
                    Start Scanning
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {scanHistory.map((scan) => (
                    <Collapsible
                      key={scan.id}
                      open={scan.id === isOpen}
                      onOpenChange={() => setIsOpen(scan.id === isOpen ? false : scan.id)}
                      className="border rounded-md overflow-hidden"
                    >
                      <div className="p-4 flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            {scan.scanType === 'product' && <Package className="h-4 w-4 mr-2 text-primary" />}
                            {scan.scanType === 'order' && <ShoppingBag className="h-4 w-4 mr-2 text-primary" />}
                            {scan.scanType === 'delivery' && <Truck className="h-4 w-4 mr-2 text-primary" />}
                            <span className="font-medium">{scan.barcode}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(scan.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            {scan.id === isOpen ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent>
                        <div className="p-4 pt-0 border-t">
                          <dl className="space-y-2">
                            <div className="flex justify-between">
                              <dt className="text-sm font-medium text-muted-foreground">Type:</dt>
                              <dd className="text-sm">
                                {scan.scanType.charAt(0).toUpperCase() + scan.scanType.slice(1)} Scan
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm font-medium text-muted-foreground">Result:</dt>
                              <dd className="text-sm">{scan.result}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm font-medium text-muted-foreground">Timestamp:</dt>
                              <dd className="text-sm">{new Date(scan.timestamp).toLocaleString()}</dd>
                            </div>
                          </dl>
                          <div className="mt-4 flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setLastScan(scan.barcode);
                                setScanType(scan.scanType);
                                setActiveTab(scan.scanType);
                              }}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Scanning;
