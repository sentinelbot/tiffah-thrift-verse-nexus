
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  FileCheck, 
  FileText, 
  Printer, 
  Send, 
  ShoppingBag, 
  Truck, 
  User 
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Order, OrderStatus } from '@/types/order';
import { updateOrderStatus, getOrderById } from '@/services/orderService';
import { sendNotification } from '@/services/notificationService';
import OrderReceiptPrint from '@/components/admin/printing/OrderReceiptPrint';
import ShippingLabelPrint from '@/components/admin/printing/ShippingLabelPrint';

const statusColorMap: Record<OrderStatus, string> = {
  pending: 'bg-yellow-500',
  processing: 'bg-blue-500',
  ready: 'bg-indigo-500',
  outForDelivery: 'bg-purple-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500'
};

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  ready: 'Ready',
  outForDelivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');
  const [statusNote, setStatusNote] = useState('');

  // Fetch order data
  React.useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const orderData = await getOrderById(id || '');
        setOrder(orderData);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order data');
        toast.error('Failed to load order data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderData();
    }
  }, [id]);

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!newStatus || !order) return;
    
    try {
      setUpdatingStatus(true);
      const updatedOrder = await updateOrderStatus(order.id, newStatus, statusNote);
      
      // Send notification based on status change
      if (order.customer.email) {
        await sendNotification({
          userId: order.customer.id,
          type: 'shipping_update',
          channels: ['email', 'sms'],
          data: {
            email: order.customer.email,
            phone: order.shippingInfo.phone,
            orderNumber: order.orderNumber,
            status: newStatus,
            note: statusNote
          }
        });
      }
      
      setOrder(updatedOrder);
      setNewStatus('');
      setStatusNote('');
      toast.success(`Order status updated to ${statusLabels[newStatus]}`);
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Determine available status options based on current status and user role
  const getAvailableStatusOptions = (): OrderStatus[] => {
    if (!order) return [];
    
    const currentStatus = order.status;
    const userRole = user?.role;
    
    // Default flow: pending -> processing -> ready -> outForDelivery -> delivered
    switch (currentStatus) {
      case 'pending':
        return ['processing', 'cancelled'];
      case 'processing':
        return ['ready', 'cancelled'];
      case 'ready':
        return ['outForDelivery', 'processing', 'cancelled'];
      case 'outForDelivery':
        return ['delivered', 'ready', 'cancelled'];
      case 'delivered':
        // Only admins can change delivered orders
        return userRole === 'admin' ? ['processing', 'cancelled'] : [];
      case 'cancelled':
        // Only admins can reactivate cancelled orders
        return userRole === 'admin' ? ['pending', 'processing'] : [];
      default:
        return [];
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !order) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to load order</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{error || 'Order not found'}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate(-1)}>Go Back</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const statusOptions = getAvailableStatusOptions();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          
          <h1 className="text-3xl font-bold">{order.orderNumber}</h1>
          
          <Badge 
            className={`${statusColorMap[order.status]} ml-2 text-white`}
          >
            {statusLabels[order.status]}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <OrderReceiptPrint order={order} />
          <ShippingLabelPrint order={order} />
        </div>
      </div>
      
      {/* Order Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Customer Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <User className="h-5 w-5 mr-2" /> Customer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-medium">{order.shippingInfo.fullName}</p>
              <p>{order.shippingInfo.email}</p>
              <p>{order.shippingInfo.phone}</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Shipping Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Truck className="h-5 w-5 mr-2" /> Shipping
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>{order.shippingInfo.address}</p>
              <p>{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.postalCode}</p>
              <p className="text-sm text-muted-foreground">
                Method: {order.shippingInfo.shippingMethod === 'express' ? 'Express' : 'Standard'}
              </p>
              {order.shippingInfo.specialInstructions && (
                <p className="text-sm italic">"{order.shippingInfo.specialInstructions}"</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Order Timing */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Calendar className="h-5 w-5 mr-2" /> Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Order Date:</p>
                <p className="text-sm">{new Date(order.orderDate).toLocaleDateString()}</p>
              </div>
              
              {order.deliveryInfo.estimatedDelivery && (
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Est. Delivery:</p>
                  <p className="text-sm">{new Date(order.deliveryInfo.estimatedDelivery).toLocaleDateString()}</p>
                </div>
              )}
              
              {order.deliveryInfo.actualDelivery && (
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Delivered:</p>
                  <p className="text-sm">{new Date(order.deliveryInfo.actualDelivery).toLocaleDateString()}</p>
                </div>
              )}
              
              {order.deliveryInfo.trackingId && (
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">Tracking:</p>
                  <p className="text-sm font-mono">{order.deliveryInfo.trackingId}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Order Items */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" /> Order Items
          </CardTitle>
          <CardDescription>
            {order.items.length} {order.items.length === 1 ? 'item' : 'items'} in this order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4">
                <div className="h-16 w-16 rounded bg-muted relative overflow-hidden">
                  {item.product.imageUrl ? (
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.title} 
                      className="object-cover h-full w-full" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full text-muted-foreground">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <p className="font-medium">{item.product.title}</p>
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
                
                <div className="text-right">
                  <p className="font-medium">Ksh {item.price}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity > 1 ? `Ksh ${item.price / item.quantity} each` : ''}
                  </p>
                </div>
              </div>
            ))}
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-muted-foreground">Subtotal:</p>
                <p>Ksh {order.totalAmount}</p>
              </div>
              
              <div className="flex justify-between">
                <p className="text-muted-foreground">Shipping:</p>
                <p>Included</p>
              </div>
              
              <div className="flex justify-between font-bold">
                <p>Total:</p>
                <p>Ksh {order.totalAmount}</p>
              </div>
              
              <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">Payment Method:</p>
                <p className="capitalize">{order.paymentInfo.method}</p>
              </div>
              
              <div className="flex justify-between text-sm">
                <p className="text-muted-foreground">Payment Status:</p>
                <Badge variant={order.paymentInfo.status === 'completed' ? 'default' : 'outline'}>
                  {order.paymentInfo.status}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Order History */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" /> Order History
          </CardTitle>
          <CardDescription>
            Timeline of order status changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.history.slice().reverse().map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="relative flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <FileCheck className="h-4 w-4" />
                  </div>
                  {index !== order.history.length - 1 && (
                    <div className="h-full w-0.5 bg-border absolute top-8" />
                  )}
                </div>
                
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        Status changed to <Badge variant="outline">{statusLabels[event.status]}</Badge>
                      </p>
                      {event.note && <p className="text-sm mt-1">{event.note}</p>}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                  
                  {event.updatedBy && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Updated by: {event.updatedBy}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Update Status */}
      {statusOptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" /> Update Order Status
            </CardTitle>
            <CardDescription>
              Change the status of this order and notify the customer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <Select 
                  value={newStatus} 
                  onValueChange={(value) => setNewStatus(value as OrderStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {statusLabels[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <Textarea 
                  placeholder="Add a note about this status change (optional)"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="h-10 resize-none"
                />
              </div>
              
              <div className="md:col-span-1">
                <Button 
                  className="w-full"
                  onClick={handleStatusUpdate}
                  disabled={!newStatus || updatingStatus}
                >
                  {updatingStatus ? (
                    <>
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" /> Update Status
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderDetail;
