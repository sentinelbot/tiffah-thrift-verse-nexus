
import { supabase } from '@/integrations/supabase/client';
import { getOnlineStatus, addToSyncQueue } from '@/services/offlineService';

export type NotificationType = 
  | 'order_confirmation' 
  | 'shipping_update' 
  | 'delivery_confirmation' 
  | 'abandoned_cart' 
  | 'price_drop' 
  | 'back_in_stock' 
  | 'promotion' 
  | 'loyalty_points';

export type NotificationChannel = 'email' | 'sms' | 'whatsapp' | 'in_app';

export interface NotificationRequest {
  userId: string;
  type: NotificationType;
  channels: NotificationChannel[];
  data: {
    [key: string]: any;
    email?: string;
    phone?: string;
  };
}

export interface NotificationResult {
  success: boolean;
  results: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    in_app: boolean;
  };
}

export const sendNotification = async (
  request: NotificationRequest
): Promise<NotificationResult> => {
  try {
    // Check if we're online
    if (!getOnlineStatus()) {
      // Queue the notification for later
      await addToSyncQueue({
        url: '/api/notifications',
        method: 'POST',
        body: JSON.stringify(request),
        headers: { 'Content-Type': 'application/json' },
        type: 'other'
      });
      
      // Return a fake success for offline mode
      return {
        success: true,
        results: {
          email: false,
          sms: false,
          whatsapp: false,
          in_app: true
        }
      };
    }
    
    // We're online, proceed with the actual API call
    const { data, error } = await supabase.functions.invoke('send-notification', {
      body: request,
    });

    if (error) throw error;
    return data as NotificationResult;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

export const sendOrderConfirmation = async (
  userId: string,
  email: string,
  phone: string,
  orderData: {
    orderNumber: string;
    totalAmount: number;
    items: any[];
  }
) => {
  const channels: NotificationChannel[] = ['email'];
  if (phone) channels.push('sms');
  
  return sendNotification({
    userId,
    type: 'order_confirmation',
    channels,
    data: {
      email,
      phone,
      ...orderData
    }
  });
};

export const sendShippingUpdate = async (
  userId: string,
  email: string,
  phone: string,
  orderData: {
    orderNumber: string;
    estimatedDelivery: string;
    trackingId?: string;
  }
) => {
  const channels: NotificationChannel[] = ['email'];
  if (phone) channels.push('sms');
  
  return sendNotification({
    userId,
    type: 'shipping_update',
    channels,
    data: {
      email,
      phone,
      ...orderData
    }
  });
};

export const sendAbandonedCartReminder = async (
  userId: string,
  email: string,
  cartData: {
    items: any[];
    totalAmount: number;
    lastUpdated: string;
  }
) => {
  return sendNotification({
    userId,
    type: 'abandoned_cart',
    channels: ['email'],
    data: {
      email,
      ...cartData
    }
  });
};

export const processAbandonedCarts = async () => {
  console.log('Processing abandoned carts...');
  
  // If offline, queue this task for later
  if (!getOnlineStatus()) {
    await addToSyncQueue({
      url: '/api/process-abandoned-carts',
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
      type: 'other'
    });
    
    return { success: false, error: "Offline, task queued for sync" };
  }
  
  const hours = 4; // Hours since cart was abandoned
  const currentTime = new Date();
  const cutoffTime = new Date(currentTime.getTime() - hours * 60 * 60 * 1000);
  
  try {
    // Note: This is mock functionality until the carts table is properly set up in Supabase
    // In a real implementation, we would use:
    // const { data: abandonedCarts, error } = await supabase
    //   .from('carts')
    //   .select('*')
    //   .eq('status', 'active')
    //   .lt('updated_at', cutoffTime.toISOString())
    //   .gte('total_items', 1);
    
    // For now, let's mock the abandoned carts data
    const mockAbandonedCarts = [
      {
        user_id: '123',
        user_email: 'customer@example.com',
        items: [{id: 'product1', name: 'Vintage Shirt', price: 1500}],
        total_amount: 1500,
        updated_at: new Date(currentTime.getTime() - 5 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    // Process the abandoned carts
    for (const cart of mockAbandonedCarts) {
      await sendAbandonedCartReminder(
        cart.user_id,
        cart.user_email,
        {
          items: cart.items,
          totalAmount: cart.total_amount,
          lastUpdated: cart.updated_at
        }
      );
    }
    
    return { success: true, count: mockAbandonedCarts.length };
  } catch (error) {
    console.error('Error processing abandoned carts:', error);
    return { success: false, error };
  }
};

export const sendLoyaltyPointsUpdate = async (
  userId: string,
  email: string,
  pointsData: {
    points: number;
    totalPoints: number;
    reason: string;
  }
) => {
  return sendNotification({
    userId,
    type: 'loyalty_points',
    channels: ['email', 'in_app'],
    data: {
      email,
      ...pointsData
    }
  });
};

export const sendPromotionalNotification = async (
  userIds: string[],
  userEmails: string[],
  promotionData: {
    promotionDetails: string;
    expiryDate: string;
    imageUrl?: string;
    targetSegment?: string;
  }
) => {
  const notifications = userIds.map((userId, index) => {
    return sendNotification({
      userId,
      type: 'promotion',
      channels: ['email', 'in_app'],
      data: {
        email: userEmails[index],
        ...promotionData
      }
    });
  });
  
  return Promise.all(notifications);
};
