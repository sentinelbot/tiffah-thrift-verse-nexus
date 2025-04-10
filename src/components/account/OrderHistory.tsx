
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getCustomerOrders } from '@/services/orderService';
import { Order } from '@/types/order';
import { formatDateTime } from '@/utils/dateUtils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Loader2, Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const customerOrders = await getCustomerOrders(user.id);
        setOrders(customerOrders);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg border-dashed">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No orders yet</h3>
        <p className="text-muted-foreground mb-6">
          When you place orders, they will appear here.
        </p>
        <Button asChild>
          <Link to="/shop">Start Shopping</Link>
        </Button>
      </div>
    );
  }
  
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'ready':
        return <Package className="h-5 w-5 text-green-500" />;
      case 'outForDelivery':
        return <Truck className="h-5 w-5 text-primary" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="border rounded-lg p-4">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div>
              <h3 className="font-medium">Order #{order.orderNumber}</h3>
              <p className="text-sm text-muted-foreground">
                Placed on {formatDateTime(new Date(order.orderDate))}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              {getStatusIcon(order.status)}
              <span className="capitalize">{order.status}</span>
            </div>
          </div>
          
          <div className="grid gap-4 mb-4">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3">
                <div className="h-16 w-16 rounded overflow-hidden border">
                  <img 
                    src={item.product.imageUrl} 
                    alt={item.product.title} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{item.product.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Qty: {item.quantity} × {formatCurrency(item.price)}
                  </div>
                </div>
                <div className="font-medium">
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="font-medium">Total: {formatCurrency(order.totalAmount)}</div>
            <Button variant="outline" asChild>
              <Link to={`/order-confirmation/${order.id}`}>
                View Order
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
