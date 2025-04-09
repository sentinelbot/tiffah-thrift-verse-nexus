
import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Mail, MessageSquare, Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { NotificationType } from '@/services/notificationService';

interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data: any;
}

const NotificationCenter = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // This is a mock implementation for demonstration purposes
  // In a real app, you would fetch notifications from your database
  useEffect(() => {
    if (!user) return;

    // Mock notifications for demo purposes
    const mockNotifications: Notification[] = [
      {
        id: '1',
        userId: user.id,
        type: 'order_confirmation',
        title: 'Order Confirmed',
        message: 'Your order #TTS-20250409-1234 has been confirmed.',
        isRead: false,
        createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
        data: { orderNumber: 'TTS-20250409-1234' }
      },
      {
        id: '2',
        userId: user.id,
        type: 'shipping_update',
        title: 'Order Shipped',
        message: 'Your order #TTS-20250408-9876 has been shipped.',
        isRead: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
        data: { orderNumber: 'TTS-20250408-9876' }
      },
      {
        id: '3',
        userId: user.id,
        type: 'loyalty_points',
        title: 'Points Earned',
        message: 'You earned 50 loyalty points from your recent purchase.',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
        data: { points: 50, totalPoints: 250 }
      },
      {
        id: '4',
        userId: user.id,
        type: 'promotion',
        title: 'Weekend Sale',
        message: '25% off all summer dresses this weekend only!',
        isRead: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(),
        data: { promotionDetails: '25% off all summer dresses', expiryDate: '2025-04-12' }
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);

    // In a real implementation, you would fetch from your database:
    // const fetchNotifications = async () => {
    //   const { data, error } = await supabase
    //     .from('notifications')
    //     .select('*')
    //     .eq('userId', user.id)
    //     .order('createdAt', { ascending: false });
    //
    //   if (error) {
    //     console.error('Error fetching notifications:', error);
    //     return;
    //   }
    //
    //   setNotifications(data || []);
    //   setUnreadCount(data?.filter(n => !n.isRead).length || 0);
    // };
    //
    // fetchNotifications();

    // You would also set up a realtime subscription for new notifications
    // const channel = supabase
    //   .channel('public:notifications')
    //   .on('postgres_changes', {
    //     event: 'INSERT',
    //     schema: 'public',
    //     table: 'notifications',
    //     filter: `userId=eq.${user.id}`,
    //   }, (payload) => {
    //     setNotifications(prev => [payload.new, ...prev]);
    //     setUnreadCount(prev => prev + 1);
    //   })
    //   .subscribe();
    //
    // return () => {
    //   supabase.removeChannel(channel);
    // };
  }, [user]);

  const markAsRead = async (id: string) => {
    // In a real implementation, you would update the database
    // const { error } = await supabase
    //   .from('notifications')
    //   .update({ isRead: true })
    //   .eq('id', id);
    //
    // if (error) {
    //   console.error('Error marking notification as read:', error);
    //   return;
    // }

    // Update local state
    setNotifications(prevNotifications =>
      prevNotifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    // In a real implementation, you would update the database
    // const { error } = await supabase
    //   .from('notifications')
    //   .update({ isRead: true })
    //   .eq('userId', user.id)
    //   .eq('isRead', false);
    //
    // if (error) {
    //   console.error('Error marking all notifications as read:', error);
    //   return;
    // }

    // Update local state
    setNotifications(prevNotifications =>
      prevNotifications.map(n => ({ ...n, isRead: true }))
    );
    setUnreadCount(0);
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'order_confirmation':
        return <Badge className="bg-green-500">Order</Badge>;
      case 'shipping_update':
        return <Badge className="bg-blue-500">Shipping</Badge>;
      case 'delivery_confirmation':
        return <Badge className="bg-purple-500">Delivery</Badge>;
      case 'abandoned_cart':
        return <Badge className="bg-amber-500">Cart</Badge>;
      case 'price_drop':
        return <Badge className="bg-rose-500">Price</Badge>;
      case 'back_in_stock':
        return <Badge className="bg-emerald-500">Stock</Badge>;
      case 'promotion':
        return <Badge className="bg-pink-500">Offer</Badge>;
      case 'loyalty_points':
        return <Badge className="bg-indigo-500">Points</Badge>;
      default:
        return <Badge>Notification</Badge>;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center translate-x-1/4 -translate-y-1/4">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Card className="border-0">
          <CardHeader className="px-4 py-3 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg">Notifications</CardTitle>
              <CardDescription className="text-xs mt-1">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                  : 'No new notifications'}
              </CardDescription>
            </div>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs"
                onClick={markAllAsRead}
              >
                Mark all read
              </Button>
            )}
          </CardHeader>
          <ScrollArea className="h-[300px]">
            {notifications.length > 0 ? (
              <div>
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`relative px-4 py-3 border-b hover:bg-muted/50 ${
                      !notification.isRead ? 'bg-muted/20' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 rounded-full bg-primary mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                <BellOff className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No notifications yet</p>
              </div>
            )}
          </ScrollArea>
          <CardFooter className="p-3 border-t">
            <Button variant="outline" size="sm" className="w-full text-xs">
              View all notifications
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
