
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  FileText, 
  Printer, 
  Clock, 
  PackageCheck, 
  Truck, 
  CheckCircle, 
  Package
} from "lucide-react";
import { Order } from "@/types/order";
import { getOrderById } from "@/services/orderService";
import { downloadReceipt, printReceipt } from "@/services/receiptService";
import { formatDate, formatRelativeTime } from "@/utils/dateUtils";
import { useToast } from "@/components/ui/use-toast";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!id) return;
    
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
        toast({
          title: "Failed to load order details",
          description: "Please try again or contact customer support.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id, toast]);
  
  // Function to render the appropriate icon for each order status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5" />;
      case "processing":
        return <PackageCheck className="h-5 w-5" />;
      case "ready":
        return <Package className="h-5 w-5" />;
      case "outForDelivery":
        return <Truck className="h-5 w-5" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "ready":
        return "bg-indigo-500";
      case "outForDelivery":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  
  // Handler for downloading receipt
  const handleDownloadReceipt = () => {
    if (order) {
      downloadReceipt(order);
      toast({
        title: "Receipt Downloaded",
        description: "Your receipt has been downloaded successfully."
      });
    }
  };
  
  // Handler for printing receipt
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
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-full max-w-md mb-8" />
            
            <div className="space-y-6">
              <Skeleton className="h-40 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
              <Skeleton className="h-64 w-full" />
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
              We couldn't find the order you're looking for.
            </p>
            <Button onClick={() => navigate('/account')}>Return to Account</Button>
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
            <Button variant="ghost" size="sm" onClick={() => navigate('/account')}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Account
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
              <p className="text-muted-foreground">Placed on {formatDate(order.orderDate)}</p>
            </div>
            <Badge className={`text-sm py-1 px-3 ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
          
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Status line */}
                <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border"></div>
                
                {/* Status points */}
                <div className="space-y-8 relative">
                  {order.history.map((historyItem, index) => (
                    <div key={index} className="flex gap-3">
                      <div className={`
                        rounded-full w-8 h-8 flex items-center justify-center z-10
                        ${index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                      `}>
                        {getStatusIcon(historyItem.status)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {historyItem.status.charAt(0).toUpperCase() + historyItem.status.slice(1)}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(historyItem.timestamp)}
                          </span>
                        </div>
                        {historyItem.note && (
                          <p className="text-sm text-muted-foreground">{historyItem.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
          
          <Card className="mb-6">
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
                      <Link to={`/product/${item.productId}`} className="font-medium hover:underline">
                        {item.product.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        KSh {item.price.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">KSh {(item.price * item.quantity).toLocaleString()}</p>
                      <Button variant="ghost" size="sm" asChild className="mt-1">
                        <Link to={`/product/${item.productId}`}>Buy Again</Link>
                      </Button>
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
          
          <div className="flex flex-wrap justify-end gap-3">
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
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetail;
