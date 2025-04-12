
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check, MapPin, Package, Truck, CalendarClock, ShoppingBag, Printer } from 'lucide-react';

const OrderConfirmation = () => {
  // Mock order details
  const order = {
    id: 'TTS-20250412-1234',
    date: new Date(),
    status: 'pending',
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
              <Check className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
          </div>
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                  <p className="text-muted-foreground">Placed on {formatDate(order.date)}</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <Button variant="outline" size="sm" className="mr-2">
                    <Printer className="mr-2 h-4 w-4" />
                    Print Receipt
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/order/${order.id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground">
                    <Package className="h-4 w-4 mr-2" />
                    <span className="text-sm">Order Status</span>
                  </div>
                  <div className="font-medium capitalize">{order.status}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">Shipping Address</span>
                  </div>
                  <div className="font-medium">{order.shipping.address.fullName}</div>
                  <div className="text-sm">
                    {order.shipping.address.street}, {order.shipping.address.city}, {order.shipping.address.postalCode}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground">
                    <CalendarClock className="h-4 w-4 mr-2" />
                    <span className="text-sm">Estimated Delivery</span>
                  </div>
                  <div className="font-medium">{formatDate(order.shipping.estimatedDelivery)}</div>
                  <div className="text-sm capitalize">{order.shipping.method} Shipping</div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <h3 className="font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center">
                    <div className="h-20 w-20 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className="font-medium">{item.name}</h4>
                      <div className="text-sm text-muted-foreground">Quantity: {item.quantity}</div>
                    </div>
                    <div className="font-medium">KSh {item.price.toLocaleString()}</div>
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
                    <span className="text-muted-foreground">Shipping</span>
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
          
          <div className="flex flex-col md:flex-row gap-4">
            <Card className="flex-1">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Truck className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-semibold">Track Your Order</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  You'll receive tracking information via email once your order ships.
                </p>
                <Button variant="outline" className="w-full">Track Order</Button>
              </CardContent>
            </Card>
            
            <Card className="flex-1">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-semibold">Continue Shopping</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Browse our collection for more unique thrift finds.
                </p>
                <Button className="w-full" asChild>
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
