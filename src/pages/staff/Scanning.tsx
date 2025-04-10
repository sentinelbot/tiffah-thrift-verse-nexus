
import React, { useState, useRef, useEffect } from 'react';
import StaffLayout from '@/components/layout/StaffLayout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Barcode, 
  Camera, 
  Package as PackageIcon, 
  ShoppingCart, 
  Truck, 
  ArrowRight, 
  X, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  Pin,
  Undo,
  RotateCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

// Import Quagga for barcode scanning
// Note: In a production app, we'd use @ericblade/quagga2 for better performance
// import Quagga from '@ericblade/quagga2';

// Mock scan history for demonstration
const mockScanHistory = [
  {
    id: 'scan-001',
    barcode: 'TTS-PROD-001234',
    scan_type: 'product',
    scan_time: '2025-04-09T14:32:15',
    location: 'Warehouse',
    result: 'Vintage Denim Jacket',
    status: 'success'
  },
  {
    id: 'scan-002',
    barcode: 'TTS-ORD-005678',
    scan_type: 'order',
    scan_time: '2025-04-09T14:15:30',
    location: 'Packaging Area',
    result: 'Order #TTS-20250409-1234',
    status: 'success'
  },
  {
    id: 'scan-003',
    barcode: 'TTS-DEL-009012',
    scan_type: 'delivery',
    scan_time: '2025-04-09T13:45:10',
    location: 'Loading Bay',
    result: 'Delivery #TRK-12345',
    status: 'success'
  },
  {
    id: 'scan-004',
    barcode: 'TTS-PROD-002345',
    scan_type: 'product',
    scan_time: '2025-04-09T13:20:05',
    location: 'Warehouse',
    result: 'Leather Crossbody Bag',
    status: 'success'
  },
  {
    id: 'scan-005',
    barcode: 'INVALID-BARCODE',
    scan_type: 'unknown',
    scan_time: '2025-04-09T12:55:30',
    location: 'Warehouse',
    result: 'Invalid barcode format',
    status: 'error'
  }
];

// Mock products for barcode scanning
const mockProducts = [
  {
    id: 'prod-001',
    barcode: 'TTS-PROD-001234',
    name: 'Vintage Denim Jacket',
    category: 'Jackets',
    price: 2500,
    size: 'M',
    brand: 'Levi\'s',
    status: 'available',
    location: 'Warehouse A2-14'
  },
  {
    id: 'prod-002',
    barcode: 'TTS-PROD-002345',
    name: 'Floral Summer Dress',
    category: 'Dresses',
    price: 1800,
    size: 'S',
    brand: 'Zara',
    status: 'available',
    location: 'Warehouse B1-07'
  }
];

// Mock orders for barcode scanning
const mockOrders = [
  {
    id: 'order-001',
    barcode: 'TTS-ORD-005678',
    orderNumber: 'TTS-20250409-1234',
    customer: 'Jane Smith',
    status: 'processing',
    items: 2,
    totalAmount: 4300
  },
  {
    id: 'order-002',
    barcode: 'TTS-ORD-006789',
    orderNumber: 'TTS-20250409-1235',
    customer: 'Michael Brown',
    status: 'ready',
    items: 1,
    totalAmount: 3200
  }
];

// Mock deliveries for barcode scanning
const mockDeliveries = [
  {
    id: 'del-001',
    barcode: 'TTS-DEL-009012',
    trackingId: 'TRK-12345',
    orderNumber: 'TTS-20250409-1234',
    customer: 'Jane Smith',
    status: 'intransit',
    address: '123 Main St, Nairobi'
  },
  {
    id: 'del-002',
    barcode: 'TTS-DEL-010123',
    trackingId: 'TRK-12346',
    orderNumber: 'TTS-20250409-1235',
    customer: 'Michael Brown',
    status: 'ready',
    address: '456 Oak Ave, Nairobi'
  }
];

const StaffScanningPage: React.FC = () => {
  const { user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState(mockScanHistory);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanType, setScanType] = useState<string>('auto');
  const [manualBarcode, setManualBarcode] = useState('');
  const [scanNote, setScanNote] = useState('');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [pendingScans, setPendingScans] = useState<any[]>([]);
  const [showScanResult, setShowScanResult] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // In a real application, we would initialize the barcode scanner here
  useEffect(() => {
    // Quagga initialization would go here
    
    return () => {
      // Cleanup Quagga when component unmounts
    };
  }, []);
  
  const startScanning = () => {
    setIsScanning(true);
    setScanResult(null);
    
    // In a real app, we would start Quagga here
    // For demo, we'll simulate a scan after a short delay
    setTimeout(() => {
      handleSuccessfulScan();
    }, 2000);
  };
  
  const stopScanning = () => {
    setIsScanning(false);
    // In a real app, we would stop Quagga here
  };
  
  const handleSuccessfulScan = () => {
    stopScanning();
    playBeepSound();
    
    // Simulate a random scan result based on the scan type
    let result: any;
    
    if (scanType === 'product' || scanType === 'auto') {
      result = mockProducts[Math.floor(Math.random() * mockProducts.length)];
      result.type = 'product';
    } else if (scanType === 'order') {
      result = mockOrders[Math.floor(Math.random() * mockOrders.length)];
      result.type = 'order';
    } else if (scanType === 'delivery') {
      result = mockDeliveries[Math.floor(Math.random() * mockDeliveries.length)];
      result.type = 'delivery';
    }
    
    // Record the scan in history
    const newScan = {
      id: `scan-${Math.floor(Math.random() * 1000000)}`,
      barcode: result.barcode,
      scan_type: result.type,
      scan_time: new Date().toISOString(),
      location: isOfflineMode ? 'Offline' : 'Warehouse',
      result: result.type === 'product' ? result.name : 
              result.type === 'order' ? `Order #${result.orderNumber}` : 
              `Delivery #${result.trackingId}`,
      status: 'success'
    };
    
    if (isOfflineMode) {
      // Store in pending scans for later sync
      setPendingScans([newScan, ...pendingScans]);
    } else {
      // Add to scan history
      setScanHistory([newScan, ...scanHistory]);
    }
    
    setScanResult(result);
    setShowScanResult(true);
    
    toast.success(`Successfully scanned ${result.type}: ${result.barcode}`);
  };
  
  const handleManualScan = () => {
    if (!manualBarcode.trim()) {
      toast.error('Please enter a barcode');
      return;
    }
    
    // Simulate processing
    setIsScanning(true);
    
    setTimeout(() => {
      setIsScanning(false);
      
      // Check if the barcode matches any known format
      if (manualBarcode.startsWith('TTS-PROD')) {
        // Product barcode
        const product = mockProducts.find(p => p.barcode === manualBarcode);
        if (product) {
          setScanResult({ ...product, type: 'product' });
          addToScanHistory(manualBarcode, 'product', product.name, 'success');
        } else {
          setScanResult({ type: 'product', barcode: manualBarcode, status: 'not_found' });
          addToScanHistory(manualBarcode, 'product', 'Product not found', 'error');
        }
      } else if (manualBarcode.startsWith('TTS-ORD')) {
        // Order barcode
        const order = mockOrders.find(o => o.barcode === manualBarcode);
        if (order) {
          setScanResult({ ...order, type: 'order' });
          addToScanHistory(manualBarcode, 'order', `Order #${order.orderNumber}`, 'success');
        } else {
          setScanResult({ type: 'order', barcode: manualBarcode, status: 'not_found' });
          addToScanHistory(manualBarcode, 'order', 'Order not found', 'error');
        }
      } else if (manualBarcode.startsWith('TTS-DEL')) {
        // Delivery barcode
        const delivery = mockDeliveries.find(d => d.barcode === manualBarcode);
        if (delivery) {
          setScanResult({ ...delivery, type: 'delivery' });
          addToScanHistory(manualBarcode, 'delivery', `Delivery #${delivery.trackingId}`, 'success');
        } else {
          setScanResult({ type: 'delivery', barcode: manualBarcode, status: 'not_found' });
          addToScanHistory(manualBarcode, 'delivery', 'Delivery not found', 'error');
        }
      } else {
        // Unknown barcode format
        setScanResult({ type: 'unknown', barcode: manualBarcode, status: 'invalid_format' });
        addToScanHistory(manualBarcode, 'unknown', 'Invalid barcode format', 'error');
      }
      
      setShowScanResult(true);
      setManualBarcode('');
      playBeepSound();
    }, 1000);
  };
  
  const addToScanHistory = (barcode: string, type: string, result: string, status: string) => {
    const newScan = {
      id: `scan-${Math.floor(Math.random() * 1000000)}`,
      barcode: barcode,
      scan_type: type,
      scan_time: new Date().toISOString(),
      location: isOfflineMode ? 'Offline' : 'Warehouse',
      result: result,
      status: status
    };
    
    if (isOfflineMode) {
      setPendingScans([newScan, ...pendingScans]);
    } else {
      setScanHistory([newScan, ...scanHistory]);
    }
  };
  
  const playBeepSound = () => {
    // Play beep sound for scan feedback
    const audio = new Audio('/sounds/beep.mp3');
    audio.play().catch(e => console.log('Error playing sound:', e));
  };
  
  const handleSyncPendingScans = () => {
    if (pendingScans.length === 0) {
      toast.info('No pending scans to sync');
      return;
    }
    
    setIsSyncing(true);
    
    // Simulate syncing with server
    setTimeout(() => {
      // Add all pending scans to history
      setScanHistory([...pendingScans, ...scanHistory]);
      setPendingScans([]);
      setIsSyncing(false);
      
      toast.success(`Successfully synced ${pendingScans.length} scan(s)`);
    }, 2000);
  };
  
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy HH:mm:ss');
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'success':
        return <Badge className="bg-green-500">Success</Badge>;
      case 'error':
        return <Badge className="bg-red-500">Error</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getScanTypeIcon = (type: string) => {
    switch(type) {
      case 'product':
        return <PackageIcon className="h-4 w-4" />;
      case 'order':
        return <ShoppingCart className="h-4 w-4" />;
      case 'delivery':
        return <Truck className="h-4 w-4" />;
      default:
        return <Barcode className="h-4 w-4" />;
    }
  };
  
  const getScanResult = () => {
    if (!scanResult) return null;
    
    switch(scanResult.type) {
      case 'product':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <PackageIcon className="h-5 w-5" />
                  Product: {scanResult.name || 'Unknown Product'}
                </h3>
                <p className="text-sm text-muted-foreground">Barcode: {scanResult.barcode}</p>
              </div>
              {scanResult.status === 'not_found' ? (
                <Badge className="bg-red-500">Not Found</Badge>
              ) : scanResult.status === 'invalid_format' ? (
                <Badge className="bg-red-500">Invalid Format</Badge>
              ) : (
                <Badge className={scanResult.status === 'available' ? 'bg-green-500' : 'bg-amber-500'}>
                  {scanResult.status || 'Available'}
                </Badge>
              )}
            </div>
            
            {scanResult.status !== 'not_found' && scanResult.status !== 'invalid_format' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p>{scanResult.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p>KSh {scanResult.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Size</p>
                    <p>{scanResult.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Brand</p>
                    <p>{scanResult.brand}</p>
                  </div>
                </div>
                
                <div className="bg-primary/10 p-3 rounded-md flex items-center gap-2">
                  <Pin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm">{scanResult.location}</p>
                  </div>
                </div>
              </>
            )}
            
            {(scanResult.status === 'not_found' || scanResult.status === 'invalid_format') && (
              <div className="bg-red-500/10 p-3 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm">
                    {scanResult.status === 'not_found' ? 
                      'Product not found in the database.' : 
                      'Invalid barcode format.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'order':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Order: {scanResult.orderNumber || 'Unknown Order'}
                </h3>
                <p className="text-sm text-muted-foreground">Barcode: {scanResult.barcode}</p>
              </div>
              {scanResult.status === 'not_found' ? (
                <Badge className="bg-red-500">Not Found</Badge>
              ) : scanResult.status === 'invalid_format' ? (
                <Badge className="bg-red-500">Invalid Format</Badge>
              ) : (
                <Badge className={
                  scanResult.status === 'processing' ? 'bg-blue-500' : 
                  scanResult.status === 'ready' ? 'bg-green-500' : 
                  'bg-amber-500'
                }>
                  {scanResult.status || 'Processing'}
                </Badge>
              )}
            </div>
            
            {scanResult.status !== 'not_found' && scanResult.status !== 'invalid_format' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p>{scanResult.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p>KSh {scanResult.totalAmount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Items</p>
                    <p>{scanResult.items} item(s)</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="capitalize">{scanResult.status}</p>
                  </div>
                </div>
                
                <div className="flex justify-between gap-2">
                  <Button variant="outline" className="flex-1">View Order Details</Button>
                  <Button className="flex-1">
                    {scanResult.status === 'processing' ? 'Mark as Ready' : 
                     scanResult.status === 'ready' ? 'Mark as Delivered' : 
                     'Update Status'}
                  </Button>
                </div>
              </>
            )}
            
            {(scanResult.status === 'not_found' || scanResult.status === 'invalid_format') && (
              <div className="bg-red-500/10 p-3 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm">
                    {scanResult.status === 'not_found' ? 
                      'Order not found in the database.' : 
                      'Invalid barcode format.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'delivery':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Delivery: {scanResult.trackingId || 'Unknown Delivery'}
                </h3>
                <p className="text-sm text-muted-foreground">Barcode: {scanResult.barcode}</p>
              </div>
              {scanResult.status === 'not_found' ? (
                <Badge className="bg-red-500">Not Found</Badge>
              ) : scanResult.status === 'invalid_format' ? (
                <Badge className="bg-red-500">Invalid Format</Badge>
              ) : (
                <Badge className={
                  scanResult.status === 'ready' ? 'bg-blue-500' : 
                  scanResult.status === 'intransit' ? 'bg-purple-500' : 
                  scanResult.status === 'delivered' ? 'bg-green-500' : 
                  'bg-amber-500'
                }>
                  {scanResult.status === 'intransit' ? 'In Transit' : scanResult.status || 'Ready'}
                </Badge>
              )}
            </div>
            
            {scanResult.status !== 'not_found' && scanResult.status !== 'invalid_format' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Number</p>
                    <p>{scanResult.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p>{scanResult.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="capitalize">
                      {scanResult.status === 'intransit' ? 'In Transit' : scanResult.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p>{scanResult.address}</p>
                  </div>
                </div>
                
                <div className="flex justify-between gap-2">
                  <Button variant="outline" className="flex-1">View Delivery Details</Button>
                  <Button className="flex-1">
                    {scanResult.status === 'ready' ? 'Start Delivery' : 
                     scanResult.status === 'intransit' ? 'Complete Delivery' : 
                     'Update Status'}
                  </Button>
                </div>
              </>
            )}
            
            {(scanResult.status === 'not_found' || scanResult.status === 'invalid_format') && (
              <div className="bg-red-500/10 p-3 rounded-md flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-sm">
                    {scanResult.status === 'not_found' ? 
                      'Delivery not found in the database.' : 
                      'Invalid barcode format.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'unknown':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Unknown Barcode
                </h3>
                <p className="text-sm text-muted-foreground">Barcode: {scanResult.barcode}</p>
              </div>
              <Badge className="bg-red-500">Invalid Format</Badge>
            </div>
            
            <div className="bg-red-500/10 p-3 rounded-md flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm">
                  This barcode format is not recognized. Please ensure you are scanning a valid 
                  Tiffah Thrift Store barcode.
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Add Note</Label>
              <Textarea 
                placeholder="Add a note about this scan..." 
                value={scanNote}
                onChange={(e) => setScanNote(e.target.value)}
              />
              <Button 
                className="w-full" 
                disabled={!scanNote.trim()} 
                onClick={() => {
                  toast.success('Note saved');
                  setScanNote('');
                }}
              >
                Save Note
              </Button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex flex-col items-center justify-center py-6">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">Unknown Result</h3>
            <p className="text-sm text-muted-foreground text-center mt-1">
              There was an error processing this scan. Please try again.
            </p>
          </div>
        );
    }
  };
  
  return (
    <StaffLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Barcode Scanner</h1>
            <p className="text-muted-foreground">Scan product, order, and delivery barcodes</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <Label htmlFor="offline-mode">Offline Mode</Label>
              <input
                type="checkbox"
                id="offline-mode"
                checked={isOfflineMode}
                onChange={() => setIsOfflineMode(!isOfflineMode)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>
            {isOfflineMode && pendingScans.length > 0 && (
              <Button 
                variant="outline" 
                onClick={handleSyncPendingScans}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RotateCw className="h-4 w-4 mr-2" />
                    Sync ({pendingScans.length})
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Barcode Scanner</CardTitle>
                <CardDescription>
                  {isOfflineMode ? 
                    'Currently in offline mode. Scans will be synced later.' : 
                    'Scan a barcode to identify products, orders, or deliveries'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup 
                  defaultValue="auto" 
                  className="flex space-x-2"
                  value={scanType}
                  onValueChange={setScanType}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="auto" id="auto" />
                    <Label htmlFor="auto">Auto-detect</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="product" id="product" />
                    <Label htmlFor="product">Product</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="order" id="order" />
                    <Label htmlFor="order">Order</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery">Delivery</Label>
                  </div>
                </RadioGroup>
                
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="Enter barcode manually" 
                    value={manualBarcode}
                    onChange={(e) => setManualBarcode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleManualScan()}
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleManualScan}
                    disabled={isScanning || !manualBarcode.trim()}
                  >
                    {isScanning ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Barcode className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <div className="relative">
                  <div 
                    className="rounded-md overflow-hidden bg-black aspect-video flex items-center justify-center"
                    onClick={startScanning}
                  >
                    {isScanning ? (
                      <video 
                        ref={videoRef}
                        autoPlay 
                        playsInline 
                        muted
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Camera className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-white">Click to start scanning</p>
                      </div>
                    )}
                  </div>
                  
                  {isScanning && (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3/4 h-px bg-red-500 animate-pulse"></div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={stopScanning}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
                
                <Dialog open={showScanResult} onOpenChange={setShowScanResult}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Scan Result</DialogTitle>
                      <DialogDescription>
                        Successfully scanned barcode at {new Date().toLocaleTimeString()}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4">
                      {getScanResult()}
                    </div>
                    
                    <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                      <Button variant="secondary" onClick={() => setShowScanResult(false)}>
                        Close
                      </Button>
                      <Button onClick={() => {
                        setShowScanResult(false);
                        startScanning();
                      }}>
                        <Barcode className="h-4 w-4 mr-2" />
                        Scan Another
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => toast.success('Scanner settings saved')}>
                    Scanner Settings
                  </Button>
                  <Button onClick={startScanning} disabled={isScanning}>
                    {isScanning ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Barcode className="h-4 w-4 mr-2" />
                        Start Scanning
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {isOfflineMode && pendingScans.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    Pending Scans 
                    <Badge className="ml-2">{pendingScans.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-yellow-500/10 p-3 rounded-md mb-3 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Offline Mode Active</p>
                      <p className="text-sm">
                        You have {pendingScans.length} scan(s) that need to be synced. Connect to 
                        the internet and click "Sync" to upload them.
                      </p>
                    </div>
                  </div>
                  
                  <ScrollArea className="h-40">
                    <div className="space-y-2">
                      {pendingScans.map((scan) => (
                        <div key={scan.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                          <div className="flex items-center gap-2">
                            {getScanTypeIcon(scan.scan_type)}
                            <div>
                              <p className="text-sm font-medium">{scan.barcode}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDateTime(scan.scan_time)}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-yellow-500">Pending</Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={handleSyncPendingScans}
                    disabled={isSyncing}
                  >
                    {isSyncing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Syncing {pendingScans.length} scan(s)...
                      </>
                    ) : (
                      <>
                        <RotateCw className="h-4 w-4 mr-2" />
                        Sync {pendingScans.length} scan(s)
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
          
          <div>
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>Recent Scans</CardTitle>
                <CardDescription>History of your recent scans</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow overflow-hidden">
                {isOfflineMode && pendingScans.length > 0 && (
                  <div className="bg-yellow-500/10 p-2 rounded-md mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <p className="text-xs">
                      You have {pendingScans.length} pending scan(s) not shown here.
                    </p>
                  </div>
                )}
                
                <ScrollArea className="h-[calc(100vh-370px)]">
                  <div className="space-y-2 pr-4">
                    {scanHistory.length > 0 ? (
                      scanHistory.map((scan) => (
                        <div 
                          key={scan.id} 
                          className={`flex justify-between items-start p-3 rounded-md ${
                            scan.status === 'error' ? 'bg-red-500/10' : 'bg-muted/30'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              {getScanTypeIcon(scan.scan_type)}
                              <p className="font-medium text-sm">{scan.result}</p>
                              {getStatusBadge(scan.status)}
                            </div>
                            <div className="flex flex-col mt-1">
                              <p className="text-xs text-muted-foreground">
                                {scan.barcode}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDateTime(scan.scan_time)}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <Barcode className="h-10 w-10 text-muted-foreground mb-2" />
                        <h3 className="text-lg font-medium">No Scan History</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mt-1">
                          Your recent scan history will appear here after you scan barcodes.
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t">
                <Button variant="ghost" className="w-full" onClick={() => toast.success('Scan history exported')}>
                  Export Scan History
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
};

export default StaffScanningPage;
