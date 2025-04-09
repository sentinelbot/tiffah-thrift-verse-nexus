
import { supabase } from '@/integrations/supabase/client';

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

// Helper function for order confirmation notifications
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

// Helper function for shipping update notifications
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

// Helper function for abandoned cart notifications
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

// Function to schedule abandoned cart notifications (to be called by a cron job in production)
export const processAbandonedCarts = async () => {
  // In production, this would be a cron job that checks for abandoned carts
  // and sends notifications to users who haven't completed their purchase
  console.log('Processing abandoned carts...');
  
  // Mock implementation
  const hours = 4; // Hours since cart was abandoned
  const currentTime = new Date();
  const cutoffTime = new Date(currentTime.getTime() - hours * 60 * 60 * 1000);
  
  try {
    // Get abandoned carts (in production, you'd have a database table for this)
    // This is just a mockup of what the query would look like
    const { data: abandonedCarts, error } = await supabase
      .from('carts')
      .select('*')
      .eq('status', 'active')
      .lt('updated_at', cutoffTime.toISOString())
      .gte('total_items', 1);
    
    if (error) throw error;
    
    // Send notification for each abandoned cart
    if (abandonedCarts) {
      for (const cart of abandonedCarts) {
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
    }
    
    return { success: true, count: abandonedCarts?.length || 0 };
  } catch (error) {
    console.error('Error processing abandoned carts:', error);
    return { success: false, error };
  }
};

// Helper function for loyalty point notifications
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

// Helper function for marketing promotions
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
