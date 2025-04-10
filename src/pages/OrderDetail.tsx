
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { getOrderById } from '@/services/orderService';
import { Order } from '@/types/orderTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, Truck, CalendarDays, Clock } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (id) {
        try {
          setLoading(true);
          const orderData = await getOrderById(id);
          if (orderData) {
            setOrder(orderData);
          }
        } catch (error) {
          console.error('Error fetching order:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto py-8 px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto py-8 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="mb-6">We couldn't find the order you're looking for.</p>
          <Link to="/account">
            <Button>Go to Your Account</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  // Format the order date
  const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate estimated delivery date (for demo purposes)
  const estimatedDelivery = order.deliveryInfo?.estimatedDelivery || 
    new Date(new Date(order.orderDate).setDate(new Date(order.orderDate).getDate() + 5));
  
  const deliveryDate = estimatedDelivery.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/account">My Account</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Order Details</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
          <Badge 
            variant={
              order.status === 'delivered' ? 'default' : 
              order.status === 'cancelled' ? 'destructive' : 
              'secondary'
            }
            className="text-sm px-3 py-1"
          >
            {order.status}
          </Badge>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
            <CardDescription>Order placed on {orderDate}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Amount</h3>
                  <p className="font-semibold">KSh {order.totalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Payment Method</h3>
                  <p className="font-medium capitalize">{order.paymentMethod}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Payment Status</h3>
                  <Badge variant={order.paymentStatus === 'completed' ? 'default' : 'outline'}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Order Status</h3>
                    <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Shipping Information</h3>
                    <div className="text-sm text-muted-foreground">
                      <p>{order.shippingInfo?.fullName}</p>
                      <p>{order.shippingInfo?.address}</p>
                      <p>{order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.postalCode}</p>
                      <p>{order.shippingInfo?.country}</p>
                      <p className="mt-1">{order.shippingInfo?.email}</p>
                      <p>{order.shippingInfo?.phone}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Estimated Delivery</h3>
                    <p className="text-sm text-muted-foreground">{deliveryDate}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Order History</h3>
                    <div className="text-sm text-muted-foreground space-y-1 mt-1">
                      {order.history && order.history.length > 0 ? (
                        order.history.map((historyItem, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="capitalize">{historyItem.status}</span>
                            <span>
                              {new Date(historyItem.timestamp).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="flex justify-between">
                          <span className="capitalize">{order.status}</span>
                          <span>
                            {new Date(order.orderDate).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Order Items</CardTitle>
            <CardDescription>
              {(order.items?.length || 0)} {(order.items?.length || 0) === 1 ? 'item' : 'items'} in your order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="flex-shrink-0 h-16 w-16 rounded overflow-hidden border">
                      <img 
                        src={item.product?.imageUrl || '/placeholder.svg'} 
                        alt={item.product?.title || 'Product'} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">
                        {item.product?.title || 'Product'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">KSh {item.price.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        Total: KSh {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No items in this order.</p>
              )}
              
              <Separator className="my-4" />
              
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>KSh {order.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>KSh 0</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>KSh {order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/account">
            <Button variant="outline" className="w-full" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Account
            </Button>
          </Link>
          {order.status !== 'cancelled' && (
            <Button variant="outline" className="w-full" size="sm">
              Contact Support
            </Button>
          )}
          <Link to="/shop">
            <Button className="w-full" size="sm">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetail;
