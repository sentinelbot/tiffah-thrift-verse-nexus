
import React, { useState, useEffect } from 'react';
import { getCustomerOrders } from '@/services/orderService';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types/orderTypes';
import { convertOrderType } from '@/utils/orderTypeMapper';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Helper function to format dates
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const OrderHistory: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          const fetchedOrders = await getCustomerOrders(user.id);
          setOrders(fetchedOrders || []);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-3 w-[100px]" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-[120px]" />
                  <Skeleton className="h-3 w-[80px]" />
                </div>
                <Skeleton className="h-8 w-[100px]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>You haven't placed any orders yet.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Package className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground mb-4">
            Your order history will appear here once you've made a purchase.
          </p>
          <Link to="/shop">
            <Button>Start Shopping</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>View and track your orders</CardDescription>
        </CardHeader>
      </Card>
      
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">Order #{order.orderNumber}</CardTitle>
                <CardDescription>Placed on {formatDate(order.orderDate)}</CardDescription>
              </div>
              <Badge 
                variant={
                  order.status === 'delivered' ? 'default' : 
                  order.status === 'cancelled' ? 'destructive' : 
                  'secondary'
                }
              >
                {order.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">KSh {order.totalAmount.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{order.items?.length || 0} items</p>
              </div>
              <Link to={`/order/${order.id}`}>
                <Button variant="outline" size="sm">View Details</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrderHistory;
