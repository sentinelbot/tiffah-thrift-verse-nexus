
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { processScan } from '@/utils/scannerUtils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ShoppingBag, AlertCircle, Receipt, Truck } from 'lucide-react';
import { printOrderReceipt } from '@/services/printNodeService';
import BarcodeScanner from './BarcodeScanner';
import { formatDateTime } from '@/utils/formatters';

const OrderScanner = () => {
  const { user } = useAuth();
  const [scannedOrder, setScannedOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const handleScanSuccess = async (code: string) => {
    if (!user) {
      setError('You must be logged in to scan orders');
      return;
    }

    setIsLoading(true);
    setError(null);
    setScannedOrder(null);

    try {
      // Record the scan
      await processScan(code, 'order', user.id);

      // Find the order in the database
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customer_id (
            id,
            name,
            email
          ),
          items:order_items (
            id,
            product_id,
            quantity,
            price,
            product:product_id (
              id,
              name,
              price,
              image_url
            )
          )
        `)
        .eq('order_number', code)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Transform data to match Order type
        const transformedOrder = {
          id: data.id,
          orderNumber: data.order_number,
          customer: data.customer,
          items: data.items.map((item: any) => ({
            productId: item.product_id,
            product: item.product,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: data.total_amount,
          status: data.status,
          paymentInfo: data.payment_info,
          shippingInfo: data.shipping_info,
          deliveryInfo: data.delivery_info,
          orderDate: new Date(data.created_at),
          notes: data.notes,
          history: data.status_history
        };

        setScannedOrder(transformedOrder);
        toast.success(`Order found: ${data.order_number}`);
      } else {
        setError('No order found with this code');
        toast.error('No order found with this code');
      }
    } catch (err: any) {
      console.error('Error scanning order:', err);
      setError(err.message || 'An error occurred while scanning');
      toast.error('Error scanning order');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanError = (error: any) => {
    console.error('Scan error:', error);
    setError('Error accessing camera: ' + error.message);
    toast.error('Error accessing camera');
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-500">Processing</Badge>;
      case 'ready':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500">Ready</Badge>;
      case 'outForDelivery':
        return <Badge variant="outline" className="bg-purple-500/20 text-purple-500">Out for Delivery</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-500/20 text-red-500">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handlePrintReceipt = async () => {
    if (!scannedOrder || !user) return;
    
    setIsPrinting(true);
    try {
      const success = await printOrderReceipt(scannedOrder, undefined, user.id);
      if (success) {
        toast.success('Receipt printed successfully');
      } else {
        toast.error('Failed to print receipt');
      }
    } catch (error) {
      console.error('Error printing receipt:', error);
      toast.error('Error printing receipt');
    } finally {
      setIsPrinting(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!scannedOrder || !user) return;
    
    setIsLoading(true);
    try {
      // Update the order status in the database
      const { error } = await supabase
        .from('orders')
        .update({
          status: newStatus,
          status_history: [
            ...(scannedOrder.history || []),
            {
              timestamp: new Date().toISOString(),
              status: newStatus,
              updatedBy: user.id
            }
          ]
        })
        .eq('id', scannedOrder.id);
        
      if (error) throw error;
      
      // Update local state
      setScannedOrder({
        ...scannedOrder,
        status: newStatus,
        history: [
          ...(scannedOrder.history || []),
          {
            timestamp: new Date().toISOString(),
            status: newStatus,
            updatedBy: user.id
          }
        ]
      });
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err: any) {
      console.error('Error updating order status:', err);
      toast.error('Error updating order status');
    } finally {
      setIsLoading(false);
    }
  };

  const getNextStatusOptions = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending':
        return ['processing'];
      case 'processing':
        return ['ready'];
      case 'ready':
        return ['outForDelivery'];
      case 'outForDelivery':
        return ['delivered'];
      default:
        return [];
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'ready': return 'Ready';
      case 'outForDelivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <BarcodeScanner
            onScanSuccess={handleScanSuccess}
            onScanError={handleScanError}
            scannerTitle="Scan Order Barcode"
          />
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {scannedOrder && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Order #{scannedOrder.orderNumber}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">
                    {formatDateTime(scannedOrder.orderDate)}
                  </p>
                </div>
                <div className="text-right">
                  <div>{getOrderStatusBadge(scannedOrder.status)}</div>
                  <p className="text-muted-foreground text-sm mt-1">
                    {scannedOrder.items.length} item(s), KSh {scannedOrder.totalAmount}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Customer</h4>
                  <p>{scannedOrder.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{scannedOrder.customer.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Payment</h4>
                  <p className="capitalize">{scannedOrder.paymentInfo.method}</p>
                  <p className="text-sm text-muted-foreground capitalize">{scannedOrder.paymentInfo.status}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Items</h4>
                <div className="border rounded-md divide-y">
                  {scannedOrder.items.map((item: any, index: number) => (
                    <div key={index} className="p-3 flex items-center gap-3">
                      <div className="bg-muted h-10 w-10 rounded-md flex items-center justify-center shrink-0">
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="h-full w-full object-cover rounded-md"
                          />
                        ) : (
                          <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × KSh {item.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">KSh {item.quantity * item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={handlePrintReceipt}
                  disabled={isPrinting}
                >
                  <Receipt className="h-4 w-4" />
                  {isPrinting ? 'Printing...' : 'Print Receipt'}
                </Button>
                
                {getNextStatusOptions(scannedOrder.status).map((status) => (
                  <Button
                    key={status}
                    variant="default"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleUpdateStatus(status)}
                    disabled={isLoading}
                  >
                    {status === 'outForDelivery' ? (
                      <Truck className="h-4 w-4" />
                    ) : (
                      <ShoppingBag className="h-4 w-4" />
                    )}
                    Mark as {getStatusLabel(status)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderScanner;
