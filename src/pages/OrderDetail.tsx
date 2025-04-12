
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  Printer, 
  MapPin, 
  Package, 
  Truck, 
  Info, 
  Clock, 
  CreditCard,
  ShoppingBag,
  MessageCircle
} from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Mock order data - in a real app, you would fetch this from an API
  const order = {
    id: id || 'TTS-20250412-1234',
    date: new Date(),
    status: 'processing',
    payment: {
      method: 'mpesa',
      transactionId: 'MPESA12345678',
      status: 'completed'
    },
    shipping: {
      method: 'standard',
      address: {
        fullName: 'John Doe',
        street: '123 Main St',
        city: 'Nairobi',
        state: '',
        postalCode: '00100',
        country: 'Kenya'
      },
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
    },
    items: [
      {
        id: '1',
        name: 'Vintage Denim Jacket',
        price: 2500,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=150&auto=format&fit=crop'
      },
      {
        id: '2',
        name: 'Floral Summer Dress',
        price: 1800,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1578651557809-5919a62b0c20?q=80&w=150&auto=format&fit=crop'
      }
    ],
    timeline: [
      { status: 'order_placed', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), message: 'Order placed' },
      { status: 'payment_confirmed', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), message: 'Payment confirmed' },
      { status: 'processing', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), message: 'Order processing' },
      { status: 'shipped', timestamp: null, message: 'Order shipped' },
      { status: 'delivered', timestamp: null, message: 'Order delivered' }
    ],
    subtotal: 4300,
    shipping: 200,
    total: 4500
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  // Format time
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-500">Processing</Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-purple-500/20 text-purple-500">Shipped</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-500/20 text-red-500">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/account" className="text-sm text-muted-foreground hover:text-foreground flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Orders
            </Link>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4">
              <div>
                <h1 className="text-3xl font-bold mb-1">Order #{order.id}</h1>
                <div className="flex items-center">
                  <p className="text-muted-foreground mr-3">Placed on {formatDate(order.date)}</p>
                  {getStatusBadge(order.status)}
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0 space-x-2">
                <Button variant="outline" size="sm">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center text-muted-foreground mb-3">
                  <Package className="h-4 w-4 mr-2" />
                  <h3 className="font-medium">Order Status</h3>
                </div>
                <div className="flex items-center">
                  {getStatusBadge(order.status)}
                  <span className="ml-2 font-medium capitalize">{order.status}</span>
                </div>
                {order.status === 'processing' && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Your order is being prepared for shipping
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center text-muted-foreground mb-3">
                  <MapPin className="h-4 w-4 mr-2" />
                  <h3 className="font-medium">Shipping Address</h3>
                </div>
                <p className="font-medium">{order.shipping.address.fullName}</p>
                <p className="text-sm text-muted-foreground">
                  {order.shipping.address.street}
                  <br />
                  {order.shipping.address.city}, {order.shipping.address.postalCode}
                  <br />
                  {order.shipping.address.country}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center text-muted-foreground mb-3">
                  <CreditCard className="h-4 w-4 mr-2" />
                  <h3 className="font-medium">Payment Information</h3>
                </div>
                <p className="font-medium capitalize">{order.payment.method}</p>
                <p className="text-sm text-muted-foreground">
                  Transaction: {order.payment.transactionId}
                  <br />
                  Status: <span className="text-green-500">Completed</span>
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Order Timeline
              </h3>
              
              <div className="space-y-6 relative">
                {/* Vertical line */}
                <div className="absolute top-0 left-3 bottom-0 w-0.5 bg-muted"></div>
                
                {order.timeline.map((event, index) => (
                  <div key={index} className="flex">
                    <div className={`w-6 h-6 rounded-full flex-shrink-0 z-10 ${
                      event.timestamp ? 'bg-primary' : 'bg-muted'
                    } flex items-center justify-center`}>
                      {event.timestamp && <div className="w-2 h-2 rounded-full bg-background"></div>}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">{event.message}</p>
                      {event.timestamp ? (
                        <p className="text-sm text-muted-foreground">
                          {formatDate(event.timestamp)} at {formatTime(event.timestamp)}
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Pending</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Order Items</h3>
              
              <div className="space-y-6">
                {order.items.map(item => (
                  <div key={item.id} className="flex">
                    <div className="h-20 w-20 bg-muted rounded-md overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      <div className="mt-1">
                        <Button variant="link" className="h-auto p-0 text-primary" asChild>
                          <Link to={`/product/${item.id}`}>View Product</Link>
                        </Button>
                      </div>
                    </div>
                    <div className="font-medium">
                      KSh {item.price.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex justify-end">
                <div className="w-full max-w-xs">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>KSh {order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Shipping ({order.shipping.method})</span>
                    <span>KSh {order.shipping.toLocaleString()}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>KSh {order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1" asChild>
              <Link to="/contact">
                <MessageCircle className="mr-2 h-4 w-4" />
                Need Help?
              </Link>
            </Button>
            <Button className="flex-1" asChild>
              <Link to="/shop">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetail;
