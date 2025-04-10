import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, Truck, Package, Calendar, ArrowLeft, FileText, Printer } from "lucide-react";
import { Order } from "@/types/order";
import { formatDate } from "@/utils/dateUtils";
import { getOrderById } from "@/services/orderService";
import { downloadReceipt, printReceipt } from "@/services/receiptService";
import { Skeleton } from "@/components/ui/skeleton";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const orderId = location.state?.orderId;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!orderId) {
      navigate('/');
      return;
    }
    
    const fetchOrder = async () => {
      try {
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order:", error);
        toast({
          title: "Error",
          description: "Failed to load order details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId, navigate, toast]);
  
  const handleDownloadReceipt = () => {
    if (order) {
      downloadReceipt(order);
      toast({
        title: "Receipt Downloaded",
        description: "Your receipt has been downloaded successfully."
      });
    }
  };
  
  const handlePrintReceipt = () => {
    if (order) {
      printReceipt(order);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-6" />
            <Skeleton className="h-64 w-full mb-6" />
            <Skeleton className="h-32 w-full mb-6" />
            <Skeleton className="h-20 w-2/4" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find the order details you're looking for.
            </p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Thank You for Your Order!</h1>
            <p className="text-muted-foreground mt-2">
              Your order has been placed successfully and is being processed.
            </p>
          </div>
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Order Summary</h2>
                <span className="text-sm text-muted-foreground">
                  {formatDate(order.orderDate)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-medium">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium capitalize">{order.paymentInfo.method}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Status</p>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="font-medium">KSh {order.totalAmount.toLocaleString()}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <h3 className="font-medium mb-3">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded overflow-hidden border border-border flex-shrink-0">
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × KSh {item.product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <span className="font-medium">
                      KSh {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2 ml-auto w-full max-w-[240px]">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>KSh {order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span>KSh {order.shippingInfo.shippingMethod === 'express' ? '500' : '200'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>VAT (16%):</span>
                  <span>
                    KSh {(order.totalAmount - (order.shippingInfo.shippingMethod === 'express' ? 500 : 200) - 
                    order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.16).toLocaleString()}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>KSh {order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Truck className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Shipping Information</h3>
                </div>
                <address className="not-italic">
                  <p>{order.shippingInfo.fullName}</p>
                  <p>{order.shippingInfo.address}</p>
                  <p>{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.postalCode}</p>
                  <p>{order.shippingInfo.country}</p>
                  <p className="mt-2">
                    <span className="text-muted-foreground">Email: </span>
                    {order.shippingInfo.email}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Phone: </span>
                    {order.shippingInfo.phone}
                  </p>
                </address>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Delivery Information</h3>
                </div>
                <p className="mb-2">
                  <span className="text-muted-foreground">Shipping Method: </span>
                  <span className="capitalize">{order.shippingInfo.shippingMethod}</span>
                </p>
                <p className="mb-2">
                  <span className="text-muted-foreground">Estimated Delivery: </span>
                  {order.deliveryInfo.estimatedDelivery ? 
                    formatDate(order.deliveryInfo.estimatedDelivery) : 
                    'To be determined'}
                </p>
                {order.deliveryInfo.trackingId && (
                  <p>
                    <span className="text-muted-foreground">Tracking Number: </span>
                    {order.deliveryInfo.trackingId}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-wrap justify-between gap-4">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={() => navigate('/account')}>
                <Package className="mr-2 h-4 w-4" />
                View All Orders
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrintReceipt}>
                <Printer className="mr-2 h-4 w-4" />
                Print Receipt
              </Button>
              <Button onClick={handleDownloadReceipt}>
                <FileText className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
