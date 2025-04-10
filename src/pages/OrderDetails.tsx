
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getOrderById } from '@/services/orderService';
import { Order } from '@/types/orderTypes';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  CheckCircle,
  Package,
  Truck,
  ShoppingBag,
  ArrowLeft,
  AlertCircle,
  Phone,
  MapPin,
  ClipboardList,
  Printer,
  HelpCircle,
  Clock,
  MailIcon,
  ArrowRight
} from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import { toast } from 'sonner';

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (orderId) {
          const orderData = await getOrderById(orderId);
          setOrder(orderData);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-600">Processing</Badge>;
      case 'ready':
        return <Badge variant="outline" className="bg-purple-500/20 text-purple-600">Ready</Badge>;
      case 'outForDelivery':
        return <Badge variant="outline" className="bg-indigo-500/20 text-indigo-600">Out for Delivery</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-500/20 text-green-600">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-500/20 text-red-600">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600">Pending</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/20 text-green-600">Paid</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-500/20 text-red-600">Failed</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-purple-500/20 text-purple-600">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getOrderTrackingSteps = () => {
    const steps = [
      { status: 'pending', label: 'Order Placed', icon: ShoppingBag },
      { status: 'processing', label: 'Processing', icon: Package },
      { status: 'ready', label: 'Ready for Delivery', icon: Package },
      { status: 'outForDelivery', label: 'Out for Delivery', icon: Truck },
      { status: 'delivered', label: 'Delivered', icon: CheckCircle },
    ];
    
    const currentStatusIndex = steps.findIndex(step => step.status === order?.status);
    
    return steps.map((step, index) => {
      const isCurrent = step.status === order?.status;
      const isCompleted = currentStatusIndex >= 0 && index <= currentStatusIndex;
      const isPending = !isCompleted;
      
      return {
        ...step,
        isCurrent,
        isCompleted,
        isPending
      };
    });
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg font-medium">Loading order details...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center max-w-lg mx-auto">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find the order you're looking for. It may have been deleted or you may not have permission to view it.
            </p>
            <Button onClick={() => navigate('/account')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Your Account
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  const trackingSteps = getOrderTrackingSteps();

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col gap-2 mb-8">
          <Button 
            variant="ghost" 
            className="w-fit -ml-4"
            onClick={() => navigate('/account')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Your Account
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
              <p className="text-muted-foreground">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print Receipt
              </Button>
              <Button variant="outline">
                <HelpCircle className="mr-2 h-4 w-4" />
                Need Help?
              </Button>
            </div>
          </div>
        </div>
        
        {/* Order Tracking */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Order Status</h2>
              {getStatusBadge(order.status)}
            </div>
            
            <div className="relative mt-8">
              {/* Progress Bar */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-muted">
                <div 
                  className="h-1 bg-primary" 
                  style={{ 
                    width: `${(trackingSteps.findIndex(step => step.isCurrent) / (trackingSteps.length - 1)) * 100}%`
                  }}
                ></div>
              </div>
              
              {/* Steps */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {trackingSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={step.status} className="flex flex-col items-center text-center z-10">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.isCompleted 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <StepIcon className="h-5 w-5" />
                      </div>
                      <p className={`mt-2 font-medium ${step.isCurrent ? 'text-primary' : ''}`}>
                        {step.label}
                      </p>
                      {step.isCurrent && order.status !== 'delivered' && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {order.status === 'pending' && 'Awaiting payment confirmation'}
                          {order.status === 'processing' && 'Your order is being prepared'}
                          {order.status === 'ready' && 'Ready for pickup/delivery'}
                          {order.status === 'outForDelivery' && 'On the way to you'}
                        </p>
                      )}
                      {step.isCompleted && !step.isCurrent && (
                        <div className="flex items-center text-xs text-muted-foreground gap-1 mt-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>Completed</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {order.status === 'outForDelivery' && (
              <div className="mt-8 p-4 bg-muted rounded-lg">
                <div className="flex items-start gap-4">
                  <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Estimated Delivery</h3>
                    <p className="text-sm">
                      {order.deliveryInfo?.estimatedDelivery 
                        ? formatDate(order.deliveryInfo.estimatedDelivery)
                        : 'Today, between 2:00 PM - 6:00 PM'}
                    </p>
                    {order.deliveryInfo?.trackingId && (
                      <p className="text-sm mt-1">
                        Tracking ID: {order.deliveryInfo.trackingId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {order.items?.map((item) => (
                    <div key={item.id} className="p-4 flex gap-4">
                      <div className="h-20 w-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        {item.product?.imageUrl && (
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product?.title || 'Product'}</h3>
                        <div className="flex flex-wrap justify-between items-end mt-1">
                          <div className="text-sm text-muted-foreground">
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: KSh {item.price.toLocaleString()}</p>
                          </div>
                          <p className="font-medium">
                            KSh {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t">
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>KSh {order.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>KSh 0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>KSh 0.00</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>KSh {order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Order Information</h2>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Order Number</h3>
                    <p className="font-medium">{order.orderNumber}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Order Date</h3>
                    <p>{formatDate(order.createdAt)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Payment Method</h3>
                    <p className="capitalize">{order.paymentMethod}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Payment Status</h3>
                    <div>{getPaymentBadge(order.paymentStatus)}</div>
                  </div>
                  
                  {order.paymentTransactionId && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Transaction ID</h3>
                      <p className="text-sm font-mono">{order.paymentTransactionId}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Delivery Address</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.shippingInfo?.fullName || user?.name || 'Customer'}<br />
                        {order.shippingInfo?.address || '123 Main Street'}<br />
                        {order.shippingInfo?.city || 'Nairobi'}, {order.shippingInfo?.postalCode || '00100'}<br />
                        {order.shippingInfo?.country || 'Kenya'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Contact</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.shippingInfo?.phone || '+254 712 345 678'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MailIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.shippingInfo?.email || user?.email || 'customer@example.com'}
                      </p>
                    </div>
                  </div>
                  
                  {order.shippingInfo?.specialInstructions && (
                    <div className="flex items-start gap-2">
                      <ClipboardList className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Special Instructions</h3>
                        <p className="text-sm text-muted-foreground">
                          {order.shippingInfo.specialInstructions}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Need more help */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold">Need Help With Your Order?</h3>
                <p className="text-muted-foreground">
                  Our customer service team is here to assist you.
                </p>
              </div>
              <Button>
                Contact Support
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default OrderDetails;
