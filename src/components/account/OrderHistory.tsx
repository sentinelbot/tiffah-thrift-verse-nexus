
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getCustomerOrders } from '@/services/orderService';
import { Order } from '@/types/orderTypes';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Package, ExternalLink, AlertCircle } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const customerOrders = await getCustomerOrders(user.id);
        setOrders(customerOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Could not load your orders. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-600">Processing</Badge>;
      case 'ready':
        return <Badge variant="outline" className="bg-purple-500/20 text-purple-600">Ready</Badge>;
      case 'outForDelivery':
        return <Badge variant="outline" className="bg-indigo-500/20 text-indigo-600">Out for Delivery</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-500/20 text-green-600">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-500/20 text-red-600">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600">Pending</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/20 text-green-600">Paid</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-500/20 text-red-600">Failed</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-purple-500/20 text-purple-600">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center space-y-2">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
          <p className="text-destructive">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No orders yet</h3>
        <p className="text-muted-foreground mb-4">When you place orders, they will appear here.</p>
        <Button onClick={() => navigate('/shop')}>
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b bg-muted/20">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-medium">Order #{order.orderNumber}</h3>
                  <p className="text-sm text-muted-foreground">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {getStatusBadge(order.status)}
                  {getPaymentBadge(order.paymentStatus)}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    View Details
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="h-16 w-16 rounded bg-muted flex-shrink-0 overflow-hidden">
                      {item.product?.imageUrl && (
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.title}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.product?.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity} × KSh {item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">KSh {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-lg font-bold">KSh {order.totalAmount.toLocaleString()}</p>
                </div>
                
                {order.deliveryInfo?.estimatedDelivery && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="font-medium">{formatDate(order.deliveryInfo.estimatedDelivery)}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrderHistory;
