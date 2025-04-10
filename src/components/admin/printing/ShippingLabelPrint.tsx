
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Printer, Download, CheckCircle, MapPin, Phone, UserCircle, Building } from 'lucide-react';
import { Order } from '@/types/order';
import { formatDate } from '@/utils/dateUtils';
import { toast } from 'sonner';

interface ShippingLabelPrintProps {
  order: Order;
}

const ShippingLabelPrint: React.FC<ShippingLabelPrintProps> = ({ order }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isPrintSuccess, setIsPrintSuccess] = useState(false);
  
  const handlePrint = () => {
    setIsPrinting(true);
    
    // Simulate print job
    setTimeout(() => {
      setIsPrinting(false);
      setIsPrintSuccess(true);
      
      // Reset success state after a delay
      setTimeout(() => {
        setIsPrintSuccess(false);
      }, 3000);
      
      toast.success('Shipping label printed successfully');
    }, 2000);
  };
  
  const handleDownload = () => {
    toast.success('Shipping label downloaded successfully');
  };

  // Mock shipping info for the demo
  const shippingInfo = {
    fullName: order.customer?.name || 'John Doe',
    address: '123 Main Street',
    city: 'Nairobi',
    postalCode: '00100',
    country: 'Kenya',
    phone: '+254 712 345 678',
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MapPin className="mr-2 h-4 w-4" />
          Print Label
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Print Shipping Label</DialogTitle>
          <DialogDescription>
            Print or download a shipping label for order #{order.orderNumber}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 border rounded-md overflow-hidden">
          <div className="p-6">
            <div className="border border-dashed border-2 p-6 space-y-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-bold">Tiffah Thrift Store</h3>
                  <p className="text-sm text-muted-foreground">456 Warehouse Avenue</p>
                  <p className="text-sm text-muted-foreground">Nairobi, 00100, Kenya</p>
                  <p className="text-sm text-muted-foreground">+254 712 345 678</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Order #: {order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">Date: {formatDate(order.createdAt)}</p>
                  <p className="text-sm text-muted-foreground">Items: {order.items.length}</p>
                </div>
              </div>
              
              <div className="border-t border-dashed pt-4">
                <div className="flex flex-col space-y-1">
                  <h3 className="text-sm font-medium">SHIP TO:</h3>
                  <div className="flex items-start gap-2">
                    <UserCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <p className="text-lg font-bold">{shippingInfo.fullName}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p>{shippingInfo.address}</p>
                      <p>{shippingInfo.city}, {shippingInfo.postalCode}</p>
                      <p>{shippingInfo.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p>{shippingInfo.phone}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-dashed pt-4 text-center">
                <h3 className="text-lg font-bold">SHIPPING METHOD</h3>
                <p className="text-xl mt-1">Standard Delivery</p>
                <p className="text-sm text-muted-foreground mt-1">Est. Delivery: {formatDate(new Date(Date.now() + 86400000 * 2))}</p>
              </div>
              
              <div className="mt-4 flex flex-col items-center">
                <div className="border border-black p-2 w-48 text-center">
                  <p className="text-xs">BARCODE AREA</p>
                  <div className="h-20 flex items-center justify-center">
                    <p className="font-mono">{order.orderNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button onClick={handlePrint} disabled={isPrinting || isPrintSuccess}>
            {isPrinting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                Printing...
              </>
            ) : isPrintSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Printed!
              </>
            ) : (
              <>
                <Printer className="mr-2 h-4 w-4" />
                Print Label
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShippingLabelPrint;
