
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { getOrderById } from '@/services/orderService';
import { Order } from '@/types/orderTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Package, Truck, MapPin, Calendar } from 'lucide-react';

const OrderConfirmation: React.FC = () => {
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
        <div className="container max-w-4xl mx-auto py-12 px-4">
          <div className="animate-pulse space-y-4">
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
        <div className="container max-w-4xl mx-auto py-12 px-4 text-center">
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

  // Calculate estimated delivery date (for demo purposes: 3-5 days from order date)
  const estimatedDelivery = new Date(order.orderDate);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);
  const deliveryDate = estimatedDelivery.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="flex flex-col items-center text-center mb-8">
          <CheckCircle2 className="text-green-500 h-16 w-16 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order #{order.orderNumber}</CardTitle>
            <CardDescription>Placed on {orderDate}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold mb-1">Payment</h3>
                  <p className="text-muted-foreground text-sm capitalize">{order.paymentMethod}</p>
                  <p className="text-muted-foreground text-sm capitalize">{order.paymentStatus}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-semibold mb-1">Amount</h3>
                  <p className="text-primary font-semibold">KSh {order.totalAmount.toLocaleString()}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Order Status</h3>
                    <p className="text-muted-foreground text-sm capitalize">{order.status}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Estimated Delivery</h3>
                    <p className="text-muted-foreground text-sm">{deliveryDate}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Shipping Address</h3>
                    <p className="text-muted-foreground text-sm">
                      {order.shippingInfo?.address}, {order.shippingInfo?.city}, {order.shippingInfo?.state}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Order Date</h3>
                    <p className="text-muted-foreground text-sm">{orderDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-2 sm:flex-row sm:justify-between sm:items-center">
            <Link to={`/order/${order.id}`}>
              <Button variant="outline" className="w-full sm:w-auto">View Order Details</Button>
            </Link>
            <Link to="/shop">
              <Button className="w-full sm:w-auto">Continue Shopping</Button>
            </Link>
          </CardFooter>
        </Card>

        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Questions about your order?</h2>
          <p className="text-muted-foreground mb-4">
            If you have any questions about your order, please contact our customer service team.
          </p>
          <Link to="/help-center">
            <Button variant="outline">Contact Support</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
