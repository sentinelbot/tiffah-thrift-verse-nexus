
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
import { Printer, Download, CheckCircle } from 'lucide-react';
import { Order } from '@/types/order';
import { formatDate } from '@/utils/dateUtils';
import { toast } from 'sonner';

interface OrderReceiptPrintProps {
  order: Order;
}

const OrderReceiptPrint: React.FC<OrderReceiptPrintProps> = ({ order }) => {
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
      
      toast.success('Receipt printed successfully');
    }, 2000);
  };
  
  const handleDownload = () => {
    toast.success('Receipt downloaded successfully');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Printer className="mr-2 h-4 w-4" />
          Print Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Print Order Receipt</DialogTitle>
          <DialogDescription>
            Print or download a receipt for order #{order.orderNumber}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 border rounded-md overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold">Tiffah Thrift Store</h2>
              <p className="text-sm text-muted-foreground">123 Fashion Street, Nairobi, Kenya</p>
              <p className="text-sm text-muted-foreground">+254 712 345 678 | info@tiffahthrift.com</p>
            </div>
            
            <div className="border-t border-b py-4">
              <div className="flex justify-between text-sm">
                <div>
                  <p className="font-bold">Receipt</p>
                  <p>Order #{order.orderNumber}</p>
                  <p>Date: {formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">Customer</p>
                  <p>{order.customer?.name || 'Customer'}</p>
                  <p>{order.customer?.email || 'customer@example.com'}</p>
                </div>
              </div>
            </div>
            
            <div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Item</th>
                    <th className="py-2 text-center">Qty</th>
                    <th className="py-2 text-right">Price</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2">{item.product?.title || 'Product'}</td>
                      <td className="py-2 text-center">{item.quantity}</td>
                      <td className="py-2 text-right">KSh {item.price.toLocaleString()}</td>
                      <td className="py-2 text-right">KSh {(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2} className="pt-2"></td>
                    <td className="pt-2 text-right font-medium">Subtotal:</td>
                    <td className="pt-2 text-right">KSh {order.totalAmount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan={2}></td>
                    <td className="text-right font-medium">Tax:</td>
                    <td className="text-right">KSh 0.00</td>
                  </tr>
                  <tr>
                    <td colSpan={2}></td>
                    <td className="text-right font-bold">Total:</td>
                    <td className="text-right font-bold">KSh {order.totalAmount.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="text-center text-sm space-y-2">
              <p>Payment Method: {order.paymentMethod}</p>
              <p>Payment Status: {order.paymentStatus}</p>
              {order.paymentTransactionId && (
                <p>Transaction ID: {order.paymentTransactionId}</p>
              )}
              <p className="pt-4 text-muted-foreground">Thank you for shopping with Tiffah Thrift Store!</p>
              <p className="text-xs text-muted-foreground">Printed on {new Date().toLocaleString()}</p>
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
                Print Receipt
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderReceiptPrint;
