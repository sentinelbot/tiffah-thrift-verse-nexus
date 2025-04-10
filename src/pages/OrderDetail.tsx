
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Package,
  Truck,
  Calendar,
  CreditCard,
  MapPin,
  User,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Order } from '@/types';

const OrderDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      // In a real app, this would be an API call
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockOrder: Order = {
          id: orderId || '1',
          orderNumber: 'TTS-20250410-0001',
          customer: {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+254712345678'
          },
          items: [
            {
              id: '1',
              orderId: '1',
              productId: 'prod1',
              quantity: 2,
              price: 25.99,
              product: {
                id: 'prod1',
                name: 'Vintage Denim Jacket',
                title: 'Vintage Denim Jacket',
                price: 25.99,
                category: 'Jackets',
                condition: 'good',
                barcode: 'PROD-001',
                status: 'sold',
                imageUrl: '/placeholder.svg'
              }
            },
            {
              id: '2',
              orderId: '1',
              productId: 'prod2',
              quantity: 1,
              price: 14.99,
              product: {
                id: 'prod2',
                name: 'Floral Summer Dress',
                title: 'Floral Summer Dress',
                price: 14.99,
                category: 'Dresses',
                condition: 'likeNew',
                barcode: 'PROD-002',
                status: 'sold',
                imageUrl: '/placeholder.svg'
              }
            }
          ],
          totalAmount: 66.97,
          status: 'processing',
          paymentMethod: 'mpesa',
          paymentStatus: 'completed',
          orderDate: new Date('2025-04-10T09:30:00Z'),
          createdAt: new Date('2025-04-10T09:30:00Z'),
          paymentTransactionId: 'MPE123456789',
          notes: 'Customer requested gift wrapping',
          shippingInfo: {
            fullName: 'John Doe',
            email: 'john@example.com',
            phone: '+254712345678',
            address: '123 Nairobi Street',
            city: 'Nairobi',
            state: 'Nairobi',
            postalCode: '00100',
            country: 'Kenya',
            shippingMethod: 'standard'
          },
          paymentInfo: {
            method: 'mpesa',
            status: 'completed',
            transactionId: 'MPE123456789',
            amount: 66.97
          },
          deliveryInfo: {
            estimatedDelivery: new Date('2025-04-12T12:00:00Z'),
            method: 'standard'
          },
          history: [
            {
              timestamp: new Date('2025-04-10T09:30:00Z'),
              status: 'pending',
              note: 'Order created'
            },
            {
              timestamp: new Date('2025-04-10T09:35:00Z'),
              status: 'processing',
              note: 'Payment received'
            }
          ]
        };
        
        setOrder(mockOrder);
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);
  
  // Get status badge based on order status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-gray-500/20 text-gray-500">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-500">Processing</Badge>;
      case 'ready':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500">Ready</Badge>;
      case 'outForDelivery':
        return <Badge variant="outline" className="bg-purple-500/20 text-purple-500">Out for Delivery</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-500/20 text-red-500">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get payment status badge based on payment status
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500">Pending</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500">Completed</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-500/20 text-red-500">Failed</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-purple-500/20 text-purple-500">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Format date for display
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto py-12 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-muted-foreground">Loading order details...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!order) {
    return (
      <Layout>
        <div className="container max-w-4xl mx-auto py-12 px-4">
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
            <h1 className="text-2xl font-bold">Order Not Found</h1>
            <p className="text-muted-foreground">
              We couldn't find the order you were looking for.
            </p>
            <Button onClick={() => navigate('/account')} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Account
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate('/account')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Account
          </Button>
          
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-medium">Order Status:</h2>
            {getStatusBadge(order.status)}
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Order #{order.orderNumber}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Package className="mr-2 h-5 w-5" />
                Order Details
              </CardTitle>
              <CardDescription>
                Placed on {formatDate(order.orderDate)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order Number:</span>
                <span className="font-medium">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order Date:</span>
                <span>{formatDate(order.orderDate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order Status:</span>
                <span>{getStatusBadge(order.status)}</span>
              </div>
              {order.deliveryInfo?.estimatedDelivery && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Delivery:</span>
                  <span>{formatDate(order.deliveryInfo.estimatedDelivery)}</span>
                </div>
              )}
              {order.notes && (
                <div className="pt-2 text-sm">
                  <div className="text-muted-foreground">Notes:</div>
                  <div className="bg-orange-50 dark:bg-orange-950/30 p-2 rounded border border-orange-200 dark:border-orange-900 mt-1">
                    {order.notes}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <CreditCard className="mr-2 h-5 w-5" />
                Payment Information
              </CardTitle>
              <CardDescription>
                Payment details and status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-medium capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Status:</span>
                <span>{getPaymentStatusBadge(order.paymentStatus)}</span>
              </div>
              {order.paymentTransactionId && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-mono text-xs">{order.paymentTransactionId}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-bold">${order.totalAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <User className="mr-2 h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <div className="font-medium">{order.customer?.name}</div>
                <div>{order.customer?.email}</div>
                <div>{order.customer?.phone}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <MapPin className="mr-2 h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div>{order.shippingInfo?.fullName}</div>
              <div>{order.shippingInfo?.address}</div>
              <div>{order.shippingInfo?.city}, {order.shippingInfo?.state} {order.shippingInfo?.postalCode}</div>
              <div>{order.shippingInfo?.country}</div>
              <div className="text-muted-foreground pt-2">
                Shipping Method: <span className="capitalize">{order.shippingInfo?.shippingMethod}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
            <CardDescription>
              Items included in your order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="flex items-center space-x-2">
                      <div 
                        className="h-12 w-12 rounded bg-gray-100 bg-cover bg-center"
                        style={{backgroundImage: `url(${item.product?.imageUrl || '/placeholder.svg'})`}}
                      />
                      <div>
                        <div className="font-medium">{item.product?.name}</div>
                        <div className="text-xs text-muted-foreground">{item.product?.category}</div>
                      </div>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">Subtotal</TableCell>
                  <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Order Timeline
            </CardTitle>
            <CardDescription>
              Track the progress of your order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {order.history?.map((entry, index) => (
                <div key={index} className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    {index < (order.history?.length || 0) - 1 && (
                      <div className="h-full w-0.5 bg-border"></div>
                    )}
                  </div>
                  <div className="space-y-1 pt-1">
                    <div className="text-sm font-medium">{entry.status}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(entry.timestamp)} {entry.timestamp instanceof Date && entry.timestamp.toLocaleTimeString()}
                    </div>
                    {entry.note && (
                      <div className="text-xs text-muted-foreground">{entry.note}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default OrderDetail;
