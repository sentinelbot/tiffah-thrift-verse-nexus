
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { processScan } from '@/utils/scannerUtils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Truck, AlertCircle, MapPin, Camera, Check } from 'lucide-react';
import BarcodeScanner from './BarcodeScanner';
import { printShippingLabel } from '@/services/printNodeService';
import { formatDateTime } from '@/utils/formatters';
import { Order } from '@/types/order';

const DeliveryScanner = () => {
  const { user } = useAuth();
  const [scannedOrder, setScannedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [recipientName, setRecipientName] = useState('');

  const handleScanSuccess = async (code: string) => {
    if (!user) {
      setError('You must be logged in to scan deliveries');
      return;
    }

    setIsLoading(true);
    setError(null);
    setScannedOrder(null);

    try {
      // Record the scan
      await processScan(code, 'delivery', user.id);

      // For demo purposes, create a mock order
      // In a real implementation, this would fetch from the database
      const mockOrder: Order = {
        id: 'ord-' + Date.now(),
        orderNumber: code,
        customer: {
          id: 'cust-1',
          name: 'John Doe',
          email: 'john@example.com'
        },
        items: [
          {
            productId: 'prod-1',
            product: {
              id: 'prod-1',
              name: 'Vintage T-Shirt',
              price: 1200,
              imageUrl: 'https://placehold.co/100x100'
            },
            quantity: 1,
            price: 1200
          },
          {
            productId: 'prod-2',
            product: {
              id: 'prod-2',
              name: 'Denim Jeans',
              price: 2500,
              imageUrl: 'https://placehold.co/100x100'
            },
            quantity: 1,
            price: 2500
          }
        ],
        totalAmount: 3700,
        status: 'ready',
        paymentInfo: {
          method: 'mpesa',
          status: 'completed',
          transactionId: 'MPE1234567',
          amount: 3700
        },
        shippingInfo: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '+254700000000',
          address: '123 Main St',
          city: 'Nairobi',
          state: 'Nairobi',
          postalCode: '00100',
          country: 'Kenya',
          shippingMethod: 'standard'
        },
        deliveryInfo: {},
        orderDate: new Date(),
        history: [
          {
            timestamp: new Date(),
            status: 'pending',
            note: 'Order created',
            updatedBy: user.id
          },
          {
            timestamp: new Date(Date.now() - 3600000),
            status: 'processing',
            note: 'Order processing',
            updatedBy: user.id
          },
          {
            timestamp: new Date(Date.now() - 1800000),
            status: 'ready',
            note: 'Order ready for delivery',
            updatedBy: user.id
          }
        ]
      };

      // Pre-fill recipient name if available
      if (mockOrder.shippingInfo?.fullName) {
        setRecipientName(mockOrder.shippingInfo.fullName);
      }

      setScannedOrder(mockOrder);
      toast.success(`Delivery found: ${code}`);
    } catch (err: any) {
      console.error('Error scanning delivery:', err);
      setError(err.message || 'An error occurred while scanning');
      toast.error('Error scanning delivery');
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

  const handlePrintShippingLabel = async () => {
    if (!scannedOrder || !user) return;
    
    setIsPrinting(true);
    try {
      const success = await printShippingLabel(scannedOrder.id, user.id);
      if (success) {
        toast.success('Shipping label printed successfully');
      } else {
        toast.error('Failed to print shipping label');
      }
    } catch (error) {
      console.error('Error printing shipping label:', error);
      toast.error('Error printing shipping label');
    } finally {
      setIsPrinting(false);
    }
  };

  const handlePickup = async () => {
    if (!scannedOrder || !user) return;
    
    setIsLoading(true);
    try {
      // Update local state to simulate database update
      const updatedOrder = {
        ...scannedOrder,
        status: 'outForDelivery',
        deliveryInfo: {
          ...scannedOrder.deliveryInfo,
          pickedUpBy: user.id,
          pickedUpAt: new Date().toISOString()
        },
        history: [
          ...scannedOrder.history,
          {
            timestamp: new Date(),
            status: 'outForDelivery',
            note: 'Picked up for delivery',
            updatedBy: user.id
          }
        ]
      };
      
      setScannedOrder(updatedOrder);
      toast.success('Order marked as out for delivery');
    } catch (err: any) {
      console.error('Error updating order status:', err);
      toast.error('Error updating order status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeliveryComplete = async () => {
    if (!scannedOrder || !user || !recipientName) return;
    
    setIsLoading(true);
    setIsDeliveryDialogOpen(false);
    
    try {
      // Update local state to simulate database update
      const updatedOrder = {
        ...scannedOrder,
        status: 'delivered',
        deliveryInfo: {
          ...scannedOrder.deliveryInfo,
          deliveredBy: user.id,
          deliveredAt: new Date().toISOString(),
          recipientName: recipientName,
          notes: deliveryNotes
        },
        history: [
          ...scannedOrder.history,
          {
            timestamp: new Date(),
            status: 'delivered',
            note: `Delivered to ${recipientName}${deliveryNotes ? `: ${deliveryNotes}` : ''}`,
            updatedBy: user.id
          }
        ]
      };
      
      setScannedOrder(updatedOrder);
      toast.success('Order marked as delivered');
      
      // Reset delivery notes
      setDeliveryNotes('');
    } catch (err: any) {
      console.error('Error marking as delivered:', err);
      toast.error('Error marking as delivered');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <BarcodeScanner
            onScanSuccess={handleScanSuccess}
            onScanError={handleScanError}
            scannerTitle="Scan Delivery Barcode"
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
                    <Truck className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Delivery #{scannedOrder.orderNumber}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">
                    Order Date: {formatDateTime(scannedOrder.orderDate)}
                  </p>
                </div>
                <div className="text-right">
                  <div>{getOrderStatusBadge(scannedOrder.status)}</div>
                  <p className="text-muted-foreground text-sm mt-1">
                    Total: KSh {scannedOrder.totalAmount}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Delivery Address
                </h4>
                <div className="bg-muted p-3 rounded-md">
                  <p className="font-medium">{scannedOrder.shippingInfo?.fullName}</p>
                  <p>{scannedOrder.shippingInfo?.address}</p>
                  <p>
                    {scannedOrder.shippingInfo?.city}, {scannedOrder.shippingInfo?.state} {scannedOrder.shippingInfo?.postalCode}
                  </p>
                  <p>{scannedOrder.shippingInfo?.country}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Phone: {scannedOrder.shippingInfo?.phone}
                  </p>
                  {scannedOrder.shippingInfo?.specialInstructions && (
                    <div className="mt-2 border-t pt-2">
                      <p className="text-sm font-medium">Special Instructions:</p>
                      <p className="text-sm">{scannedOrder.shippingInfo.specialInstructions}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 space-y-3">
                {scannedOrder.status === 'ready' && (
                  <Button 
                    variant="default" 
                    className="w-full gap-2"
                    onClick={handlePickup}
                    disabled={isLoading}
                  >
                    <Truck className="h-4 w-4" />
                    Pick Up for Delivery
                  </Button>
                )}
                
                {scannedOrder.status === 'outForDelivery' && (
                  <Button 
                    variant="default" 
                    className="w-full gap-2"
                    onClick={() => setIsDeliveryDialogOpen(true)}
                    disabled={isLoading}
                  >
                    <Check className="h-4 w-4" />
                    Mark as Delivered
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={handlePrintShippingLabel}
                  disabled={isPrinting || isLoading}
                >
                  <Truck className="h-4 w-4" />
                  {isPrinting ? 'Printing...' : 'Print Shipping Label'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Dialog open={isDeliveryDialogOpen} onOpenChange={setIsDeliveryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delivery</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Name</Label>
              <Input 
                id="recipient" 
                value={recipientName} 
                onChange={(e) => setRecipientName(e.target.value)} 
                placeholder="Enter name of person receiving"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Delivery Notes (Optional)</Label>
              <Textarea 
                id="notes" 
                value={deliveryNotes} 
                onChange={(e) => setDeliveryNotes(e.target.value)} 
                placeholder="Any notes about the delivery"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Proof of Delivery</Label>
              <Button variant="outline" className="w-full gap-2">
                <Camera className="h-4 w-4" />
                Take Photo
              </Button>
              <p className="text-sm text-muted-foreground">
                Photo capture would be implemented in a production app
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeliveryDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              disabled={!recipientName || isLoading} 
              onClick={handleDeliveryComplete}
            >
              Confirm Delivery
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeliveryScanner;
