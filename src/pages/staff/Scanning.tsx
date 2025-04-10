
import React, { useState, useRef } from 'react';
import StaffLayout from '@/components/layout/StaffLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Barcode,
  Camera,
  Search,
  Package,
  ShoppingBag,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  History,
} from 'lucide-react';

const StaffScanningPage = () => {
  const [scanMode, setScanMode] = useState<string>('product');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [manualCode, setManualCode] = useState<string>('');
  const [lastScan, setLastScan] = useState<any>(null);
  const [scanHistory, setScanHistory] = useState<any[]>([
    {
      code: 'PRD-00123',
      type: 'product',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      result: 'success',
      data: {
        name: 'Vintage Denim Jacket',
        price: 2500,
        category: 'Jackets',
        status: 'available'
      }
    },
    {
      code: 'ORD-20250409-1234',
      type: 'order',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      result: 'success',
      data: {
        customer: 'Sarah Johnson',
        items: 3,
        status: 'processing'
      }
    },
    {
      code: 'PRD-00456',
      type: 'product',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      result: 'error',
      error: 'Product not found'
    }
  ]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  // Function to start camera and barcode scanning
  const startScanning = () => {
    setIsScanning(true);
    
    // In a real implementation, we would use a barcode scanning library
    // like QuaggaJS to initialize the scanner and process video frames
    
    // For demo purposes, we'll simulate a successful scan after a delay
    setTimeout(() => {
      handleSuccessfulScan();
    }, 3000);
  };
  
  // Function to stop scanning
  const stopScanning = () => {
    setIsScanning(false);
    
    // In a real implementation, we would stop the scanner and release the camera
  };
  
  // Function to handle a successful barcode scan
  const handleSuccessfulScan = () => {
    // Generate a random code based on the scan mode
    let code, scanData;
    
    switch (scanMode) {
      case 'product':
        code = `PRD-${Math.floor(10000 + Math.random() * 90000)}`;
        scanData = {
          name: 'Scanned Product',
          price: Math.floor(1000 + Math.random() * 4000),
          category: 'Scanned Category',
          status: 'available'
        };
        break;
      case 'order':
        code = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
        scanData = {
          customer: 'Scanned Customer',
          items: Math.floor(1 + Math.random() * 5),
          status: 'processing'
        };
        break;
      case 'delivery':
        code = `DEL-${Math.floor(10000 + Math.random() * 90000)}`;
        scanData = {
          address: '123 Scanned Street',
          customer: 'Scanned Customer',
          items: Math.floor(1 + Math.random() * 5)
        };
        break;
      default:
        code = `UNK-${Math.floor(10000 + Math.random() * 90000)}`;
        scanData = { type: 'unknown' };
    }
    
    const newScan = {
      code,
      type: scanMode,
      timestamp: new Date(),
      result: 'success',
      data: scanData
    };
    
    setLastScan(newScan);
    setScanHistory([newScan, ...scanHistory]);
    setIsScanning(false);
    
    toast.success(`Successfully scanned ${scanMode}: ${code}`);
  };
  
  // Function to handle a manual code entry
  const handleManualCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualCode.trim()) {
      toast.error('Please enter a barcode');
      return;
    }
    
    // Process the manually entered code
    const newScan = {
      code: manualCode,
      type: scanMode,
      timestamp: new Date(),
      result: 'success',
      data: {
        name: 'Manually Entered Item',
        note: 'This item was manually entered'
      }
    };
    
    setLastScan(newScan);
    setScanHistory([newScan, ...scanHistory]);
    setManualCode('');
    
    toast.success(`Processed manual code: ${manualCode}`);
  };
  
  // Function to format timestamp
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };
  
  // Get icon based on scan type
  const getScanTypeIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Package className="h-4 w-4" />;
      case 'order':
        return <ShoppingBag className="h-4 w-4" />;
      case 'delivery':
        return <Truck className="h-4 w-4" />;
      default:
        return <Barcode className="h-4 w-4" />;
    }
  };
  
  // Get indicator based on scan result
  const getScanResultIndicator = (result: string) => {
    switch (result) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <StaffLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold">Barcode Scanner</h1>
            
            <div className="flex items-center gap-2">
              <Select value={scanMode} onValueChange={setScanMode}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Scan Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Products</SelectItem>
                  <SelectItem value="order">Orders</SelectItem>
                  <SelectItem value="delivery">Deliveries</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant={isScanning ? "destructive" : "default"}
                onClick={isScanning ? stopScanning : startScanning}
              >
                {isScanning ? (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Stop Scan
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    Start Scan
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{isScanning ? "Scanning..." : "Scanner"}</CardTitle>
                <CardDescription>
                  {isScanning 
                    ? "Position the barcode within the scanner frame" 
                    : "Start scanning or enter a barcode manually"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Camera Preview */}
                  <div 
                    className={`relative aspect-video rounded-lg border-2 ${
                      isScanning 
                        ? 'border-primary border-dashed animate-pulse bg-black/10' 
                        : 'border-muted-foreground/20'
                    } overflow-hidden flex items-center justify-center`}
                  >
                    {isScanning ? (
                      <>
                        <video 
                          ref={videoRef}
                          className="absolute inset-0 w-full h-full object-cover"
                          autoPlay
                          playsInline
                          muted
                        ></video>
                        
                        {/* Scanner overlay with targeting rectangle */}
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="w-64 h-32 border-2 border-primary/80 rounded-lg relative">
                            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
                            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
                          </div>
                        </div>
                        
                        <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black/40 py-1">
                          Scanning for {scanMode}...
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6">
                        <Barcode className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground text-center mb-2">
                          No camera active
                        </p>
                        <p className="text-xs text-muted-foreground text-center">
                          Click "Start Scan" to activate the camera or enter a barcode manually below
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Manual Entry */}
                  <form onSubmit={handleManualCodeSubmit} className="space-y-2">
                    <Label htmlFor="manualCode">Manual Entry</Label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="manualCode"
                          placeholder={`Enter ${scanMode} barcode...`}
                          className="pl-8"
                          value={manualCode}
                          onChange={(e) => setManualCode(e.target.value)}
                          disabled={isScanning}
                        />
                      </div>
                      <Button type="submit" disabled={isScanning || !manualCode.trim()}>
                        Process
                      </Button>
                    </div>
                  </form>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Last Scan</CardTitle>
                  <CardDescription>Details of the most recent scan</CardDescription>
                </CardHeader>
                <CardContent>
                  {lastScan ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {getScanTypeIcon(lastScan.type)}
                          </div>
                          <div>
                            <p className="font-medium">{lastScan.code}</p>
                            <p className="text-xs text-muted-foreground">
                              Scanned at {formatTime(lastScan.timestamp)}
                            </p>
                          </div>
                        </div>
                        <Badge variant={lastScan.result === 'success' ? 'outline' : 'destructive'}>
                          {lastScan.result.toUpperCase()}
                        </Badge>
                      </div>
                      
                      {lastScan.result === 'success' && lastScan.data && (
                        <div className="bg-muted/40 rounded-lg p-4">
                          {lastScan.type === 'product' && (
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="font-medium">Product Name:</div>
                              <div>{lastScan.data.name}</div>
                              <div className="font-medium">Price:</div>
                              <div>KSh {lastScan.data.price}</div>
                              <div className="font-medium">Category:</div>
                              <div>{lastScan.data.category}</div>
                              <div className="font-medium">Status:</div>
                              <div>{lastScan.data.status}</div>
                            </div>
                          )}
                          
                          {lastScan.type === 'order' && (
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="font-medium">Customer:</div>
                              <div>{lastScan.data.customer}</div>
                              <div className="font-medium">Items:</div>
                              <div>{lastScan.data.items}</div>
                              <div className="font-medium">Status:</div>
                              <div>{lastScan.data.status}</div>
                            </div>
                          )}
                          
                          {lastScan.type === 'delivery' && (
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="font-medium">Address:</div>
                              <div>{lastScan.data.address}</div>
                              <div className="font-medium">Customer:</div>
                              <div>{lastScan.data.customer}</div>
                              <div className="font-medium">Items:</div>
                              <div>{lastScan.data.items}</div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {lastScan.result === 'error' && (
                        <div className="bg-destructive/10 text-destructive rounded-lg p-4">
                          <p className="font-medium">Error:</p>
                          <p>{lastScan.error}</p>
                        </div>
                      )}
                      
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Barcode className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No scan records yet</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Start scanning to see results here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Scan History</CardTitle>
                    <CardDescription>Recent barcode scans</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </CardHeader>
                <CardContent>
                  {scanHistory.length > 0 ? (
                    <div className="space-y-3">
                      {scanHistory.slice(0, 5).map((scan, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded-md transition-colors"
                        >
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            {getScanTypeIcon(scan.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center">
                              <p className="font-medium truncate text-sm flex-1">{scan.code}</p>
                              <span className="text-xs text-muted-foreground">
                                {formatTime(scan.timestamp)}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {scan.result === 'success' && scan.data 
                                ? (scan.data.name || scan.data.customer || 'Scanned item')
                                : (scan.error || 'Unknown error')
                              }
                            </p>
                          </div>
                          <div>
                            {getScanResultIndicator(scan.result)}
                          </div>
                        </div>
                      ))}
                      
                      {scanHistory.length > 5 && (
                        <Button variant="ghost" className="w-full text-xs" size="sm">
                          <History className="h-3.5 w-3.5 mr-1" />
                          View All History
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No scan history</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
};

export default StaffScanningPage;
