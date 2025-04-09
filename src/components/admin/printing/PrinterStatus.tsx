
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Printer, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { checkPrinterStatus } from '@/services/printNodeService';

// Printer configuration for the different roles
const printers = [
  {
    id: 'pm_printer_id',
    name: 'Product Label Printer',
    role: 'productManager',
    location: 'Inventory Department'
  },
  {
    id: 'op_printer_id',
    name: 'Receipt Printer',
    role: 'orderPreparer',
    location: 'Order Fulfillment'
  },
  {
    id: 'ds_printer_id',
    name: 'Shipping Label Printer',
    role: 'deliveryStaff',
    location: 'Delivery Department'
  }
];

const PrinterStatus = () => {
  const [printerStatus, setPrinterStatus] = useState<Record<string, boolean | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Check status of all printers
  const checkAllPrinters = async () => {
    const refreshing = Object.keys(printerStatus).length > 0;
    if (refreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      const statusPromises = printers.map(async (printer) => {
        const status = await checkPrinterStatus(printer.id);
        return { id: printer.id, status };
      });
      
      const results = await Promise.all(statusPromises);
      
      const newStatus: Record<string, boolean> = {};
      results.forEach(result => {
        newStatus[result.id] = result.status;
      });
      
      setPrinterStatus(newStatus);
    } catch (error) {
      console.error('Error checking printer status:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  // Check printer status on component mount
  useEffect(() => {
    checkAllPrinters();
    
    // Set up interval to check printer status every 60 seconds
    const interval = setInterval(checkAllPrinters, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Printer Status</CardTitle>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={checkAllPrinters} 
          disabled={isLoading || isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {isLoading ? (
            // Loading skeleton
            <>
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-5 w-40" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-5 w-40" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-5 w-40" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            </>
          ) : (
            // Printer status list
            printers.map((printer) => (
              <div key={printer.id} className="flex items-center justify-between p-2 rounded-md border">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${
                    printerStatus[printer.id] 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    <Printer className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{printer.name}</p>
                    <p className="text-xs text-muted-foreground">{printer.location}</p>
                  </div>
                </div>
                <Badge 
                  variant={printerStatus[printer.id] ? "default" : "destructive"}
                  className={`flex items-center gap-1 ${
                    printerStatus[printer.id] ? 'bg-green-500' : ''
                  }`}
                >
                  {printerStatus[printer.id] ? (
                    <>
                      <Check className="h-3 w-3" />
                      Online
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3" />
                      Offline
                    </>
                  )}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PrinterStatus;
