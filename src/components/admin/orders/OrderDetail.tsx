
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  PackageCheck, 
  Printer, 
  Truck, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  ClipboardList,
  User,
  MapPin,
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner';

const getStatusColor = (status: string) => {
  switch(status) {
    case 'pending': return 'bg-yellow-500';
    case 'processing': return 'bg-blue-500';
    case 'ready': return 'bg-purple-500';
    case 'outForDelivery': return 'bg-indigo-500';
    case 'delivered': return 'bg-green-500';
    case 'cancelled': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getStatusIcon = (status: string) => {
  switch(status) {
    case 'pending': return <Clock className="h-5 w-5" />;
    case 'processing': return <ClipboardList className="h-5 w-5" />;
    case 'ready': return <PackageCheck className="h-5 w-5" />;
    case 'outForDelivery': return <Truck className="h-5 w-5" />;
    case 'delivered': return <CheckCircle className="h-5 w-5" />;
    case 'cancelled': return <AlertCircle className="h-5 w-5" />;
    default: return <Clock className="h-5 w-5" />;
  }
};

const OrderTimeline = ({ history }: { history: any[] }) => {
  return (
    <div className="space-y-4">
      {history.map((event, i) => (
        <div key={i} className="flex">
          <div className="flex flex-col items-center mr-4">
            <div className={`rounded-full p-1 ${getStatusColor(event.status)}`}>
              {getStatusIcon(event.status)}
            </div>
            {i < history.length - 1 && <div className="h-full w-0.5 bg-border flex-1 my-1" />}
          </div>
          <div className="pb-4">
            <p className="font-medium">{event.status.charAt(0).toUpperCase() + event.status.slice(1)}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(event.timestamp).toLocaleDateString()} at {new Date(event.timestamp).toLocaleTimeString()}
            </p>
            {event.note && <p className="text-sm mt-1">{event.note}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export const OrderDetail = ({ order }: { order: any }) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  const updateOrderStatus = (newStatus: string) => {
    setIsUpdatingStatus(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success(`Order status updated to ${newStatus}`);
      setIsUpdatingStatus(false);
    }, 1000);
  };
  
  const getNextAction = () => {
    switch(order.status) {
      case 'pending':
        return {
          label: 'Start Processing',
          action: () => updateOrderStatus('processing'),
          icon: <ClipboardList className="mr-2 h-4 w-4" />
        };
      case 'processing':
        return {
          label: 'Mark as Ready',
          action: () => updateOrderStatus('ready'),
          icon: <PackageCheck className="mr-2 h-4 w-4" />
        };
      case 'ready':
        return {
          label: 'Out for Delivery',
          action: () => updateOrderStatus('outForDelivery'),
          icon: <Truck className="mr-2 h-4 w-4" />
        };
      case 'outForDelivery':
        return {
          label: 'Mark as Delivered',
          action: () => updateOrderStatus('delivered'),
          icon: <CheckCircle className="mr-2 h-4 w-4" />
        };
      default:
        return null;
    }
  };
  
  const nextAction = getNextAction();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{order.orderNumber}</h2>
          <p className="text-muted-foreground">
            Placed on {new Date(order.orderDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Receipt
          </Button>
          <Button variant="outline" size="sm">
            <Truck className="mr-2 h-4 w-4" />
            Shipping Label
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              Order Status
              <Badge className={`ml-3 ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <OrderTimeline history={order.history} />
            
            {nextAction && (
              <Button 
                className="w-full mt-4" 
                onClick={nextAction.action}
                disabled={isUpdatingStatus}
              >
                {nextAction.icon}
                {isUpdatingStatus ? 'Updating...' : nextAction.label}
              </Button>
            )}
            
            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={() => updateOrderStatus('cancelled')}
                disabled={isUpdatingStatus}
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Cancel Order
              </Button>
            )}
          </CardContent>
        </Card>
        
        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">{order.customer.name}</p>
                <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                {order.shippingInfo.phone && (
                  <p className="text-sm text-muted-foreground">{order.shippingInfo.phone}</p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium mb-1 flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  Shipping Address
                </h4>
                <p className="text-sm">{order.shippingInfo.fullName}</p>
                <p className="text-sm">{order.shippingInfo.address}</p>
                <p className="text-sm">
                  {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.postalCode}
                </p>
                <p className="text-sm">{order.shippingInfo.country}</p>
                {order.shippingInfo.specialInstructions && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Special Instructions:</p>
                    <p className="text-sm">{order.shippingInfo.specialInstructions}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-medium mb-1 flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Information
                </h4>
                <p className="text-sm capitalize">{order.paymentInfo.method}</p>
                <p className="text-sm">Transaction ID: {order.paymentInfo.transactionId}</p>
                <Badge variant="outline" className="mt-1">
                  {order.paymentInfo.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 py-2">
                    <div className="h-16 w-16 bg-muted rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product.imageUrl || "/placeholder.svg"} 
                        alt={item.product.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.product.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × KSh {item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        KSh {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                <Separator className="my-2" />
                
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <p className="text-sm">Subtotal</p>
                    <p className="font-medium">KSh {order.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm">Shipping</p>
                    <p className="font-medium">KSh 300</p>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <p className="font-medium">Total</p>
                    <p className="font-bold">KSh {(order.totalAmount + 300).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
