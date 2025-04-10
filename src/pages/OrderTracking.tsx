
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, PrinterIcon, FileTextIcon } from "lucide-react";
import { toast } from "sonner";
import { Order } from "@/types/order";
import { getOrderById } from "@/services/orderService";
import { formatDate } from "@/utils/dateUtils";
import OrderStatusTracker from "@/components/orders/OrderStatusTracker";

const OrderTracking = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulating an API call to get the order by its number
    const fetchOrder = async () => {
      try {
        // In a real implementation, this would search by order number
        // For now, we'll use the mock service and assume the orderNumber is the ID
        const data = await getOrderById(orderNumber || '');
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Failed to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);
  
  const handlePrintReceipt = () => {
    if (order) {
      toast.success("Printing receipt...");
      // In a real implementation, this would call a receipt printing service
    }
  };
  
  const handleDownloadReceipt = () => {
    if (order) {
      toast.success("Downloading receipt...");
      // In a real implementation, this would generate and download a PDF receipt
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-full max-w-md mb-8" />
            
            <div className="space-y-6">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-64 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
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
              We couldn't find the order you're looking for. Please check the order number and try again.
            </p>
            <Button onClick={() => navigate('/')}>Return to Home</Button>
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
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Track Order #{order.orderNumber}</h1>
              <p className="text-muted-foreground">Placed on {formatDate(order.orderDate)}</p>
            </div>
          </div>
          
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusTracker status={order.status} className="py-4" />
              
              <div className="mt-8 text-center">
                {order.status === 'delivered' ? (
                  <p className="text-green-500 font-medium">
                    Your order was delivered on {formatDate(order.deliveryInfo.actualDelivery || new Date())}
                  </p>
                ) : order.status === 'cancelled' ? (
                  <p className="text-red-500 font-medium">
                    Your order was cancelled
                  </p>
                ) : (
                  <p>
                    {order.status === 'pending' && "Your order has been received and is being reviewed."}
                    {order.status === 'processing' && "Your order is being prepared for shipping."}
                    {order.status === 'ready' && "Your order is ready for shipping."}
                    {order.status === 'outForDelivery' && (
                      <>
                        Your order is out for delivery and should arrive by{" "}
                        <span className="font-medium">
                          {formatDate(order.deliveryInfo.estimatedDelivery || new Date())}
                        </span>
                      </>
                    )}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium">{order.shippingInfo.fullName}</p>
                  <p>{order.shippingInfo.address}</p>
                  <p>{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.postalCode}</p>
                  <p>{order.shippingInfo.country}</p>
                  <p className="pt-2">
                    <span className="text-muted-foreground">Email: </span>
                    {order.shippingInfo.email}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Phone: </span>
                    {order.shippingInfo.phone}
                  </p>
                  <p className="pt-2">
                    <span className="text-muted-foreground">Shipping Method: </span>
                    <span className="capitalize">{order.shippingInfo.shippingMethod}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p>
                    <span className="text-muted-foreground">Payment Method: </span>
                    <span className="capitalize">{order.paymentInfo.method}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Payment Status: </span>
                    <span className="capitalize">{order.paymentInfo.status}</span>
                  </p>
                  {order.paymentInfo.transactionId && (
                    <p>
                      <span className="text-muted-foreground">Transaction ID: </span>
                      {order.paymentInfo.transactionId}
                    </p>
                  )}
                  <p className="pt-2">
                    <span className="text-muted-foreground">Amount: </span>
                    KSh {order.paymentInfo.amount.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="w-20 h-20 rounded overflow-hidden border border-border flex-shrink-0">
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">{item.product.title}</p>
                      <p className="text-sm text-muted-foreground">
                        KSh {item.price.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">KSh {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-2 ml-auto w-full max-w-[240px]">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>
                    KSh {order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span>
                    KSh {order.shippingInfo.shippingMethod === 'express' ? '500' : '200'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>VAT (16%):</span>
                  <span>
                    KSh {(order.totalAmount - 
                      (order.shippingInfo.shippingMethod === 'express' ? 500 : 200) - 
                      order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)).toLocaleString()}
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
          
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={handlePrintReceipt}>
              <PrinterIcon className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
            <Button onClick={handleDownloadReceipt}>
              <FileTextIcon className="mr-2 h-4 w-4" />
              Download Receipt
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTracking;
