
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, Truck, Package, Clock } from "lucide-react";
import { getOrderById } from "@/services/orderService";
import { Order } from "@/types/order";
import { formatDate, formatCurrency } from "@/lib/utils";

const OrderConfirmation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError("Order ID is required");
        setLoading(false);
        return;
      }
      
      try {
        const orderData = await getOrderById(id);
        setOrder(orderData);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order information");
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading order information...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
                <p className="text-muted-foreground mb-6">
                  {error || "We couldn't find the order you're looking for."}
                </p>
                <Button asChild>
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'ready':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'outForDelivery':
        return <Truck className="h-5 w-5 text-primary" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'outline';
      case 'processing':
        return 'secondary';
      case 'ready':
        return 'default';
      case 'outForDelivery':
        return 'default';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">Order Confirmation</CardTitle>
                  <CardDescription>
                    Order #{order.orderNumber} - Placed on {formatDate(new Date(order.orderDate))}
                  </CardDescription>
                </div>
                <Badge variant={getStatusBadgeVariant(order.status)} className="text-sm px-3 py-1 capitalize flex items-center gap-1.5 self-start md:self-center">
                  {getStatusIcon(order.status)}
                  {order.status.replace(/([A-Z])/g, ' $1').trim()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <div className="text-sm text-muted-foreground">
                    <p>{order.shippingInfo.fullName}</p>
                    <p>{order.shippingInfo.address}</p>
                    <p>{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.postalCode}</p>
                    <p>{order.shippingInfo.country}</p>
                    <p>Phone: {order.shippingInfo.phone}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Payment Information</h3>
                  <div className="text-sm text-muted-foreground">
                    <p className="capitalize">Method: {order.paymentInfo.method}</p>
                    <p>Status: <span className={`capitalize ${order.paymentInfo.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>{order.paymentInfo.status}</span></p>
                    {order.paymentInfo.transactionId && (
                      <p>Transaction ID: {order.paymentInfo.transactionId}</p>
                    )}
                    <p>Amount: {formatCurrency(order.paymentInfo.amount)}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Order Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted px-4 py-3 text-sm font-medium grid grid-cols-10 gap-2">
                    <div className="col-span-5">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-1 text-center">Qty</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>
                  
                  {order.items.map((item, index) => (
                    <div key={item.productId} className="px-4 py-4 grid grid-cols-10 gap-2 items-center text-sm border-t">
                      <div className="col-span-5 flex items-center gap-3">
                        <div className="w-12 h-12 rounded overflow-hidden border border-border flex-shrink-0">
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.product.title}</p>
                        </div>
                      </div>
                      <div className="col-span-2 text-center">
                        {formatCurrency(item.price)}
                      </div>
                      <div className="col-span-1 text-center">
                        {item.quantity}
                      </div>
                      <div className="col-span-2 text-right">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                  
                  <div className="px-4 py-4 border-t">
                    <div className="ml-auto w-full max-w-[240px] space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(order.totalAmount * 0.84)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>VAT (16%):</span>
                        <span>{formatCurrency(order.totalAmount * 0.16)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping:</span>
                        <span>{formatCurrency(order.shippingInfo.shippingMethod === 'express' ? 500 : 200)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>{formatCurrency(order.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Delivery Information</h3>
                <div className="border rounded-lg p-4 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground">Shipping Method:</p>
                      <p className="font-medium capitalize">
                        {order.shippingInfo.shippingMethod} Shipping
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Estimated Delivery:</p>
                      <p className="font-medium">
                        {order.deliveryInfo.estimatedDelivery ? formatDate(new Date(order.deliveryInfo.estimatedDelivery)) : 'To be determined'}
                      </p>
                    </div>
                    {order.deliveryInfo.trackingId && (
                      <div>
                        <p className="text-muted-foreground">Tracking Number:</p>
                        <p className="font-medium">{order.deliveryInfo.trackingId}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild variant="outline">
                  <Link to="/account">View All Orders</Link>
                </Button>
                <Button asChild>
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
