
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderStatus, PaymentMethod } from '@/types/orderTypes';

/**
 * Get all orders
 */
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer:profiles!orders_customer_id_fkey(id, name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data.map(order => ({
      ...order,
      createdAt: new Date(order.created_at),
      updatedAt: order.updated_at ? new Date(order.updated_at) : undefined,
      orderDate: new Date(order.created_at),
      customer: order.customer,
    })) as Order[];
  } catch (error) {
    console.error('Error in getAllOrders:', error);
    return [];
  }
};

/**
 * Get order by ID
 */
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer:profiles!orders_customer_id_fkey(id, name, email),
        items:order_items(*),
        shipping:shipping_info(*),
        delivery:delivery_info(*)
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }
    
    return {
      ...data,
      createdAt: new Date(data.created_at),
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
      orderDate: new Date(data.created_at),
      customer: data.customer,
      items: data.items,
      shippingInfo: data.shipping,
      deliveryInfo: data.delivery
    } as Order;
  } catch (error) {
    console.error('Error in getOrderById:', error);
    return null;
  }
};

// Dummy implementation until we implement the real service
export const createOrder = async (orderData: any): Promise<Order | null> => {
  try {
    // Simulating order creation
    const mockOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber: `TTS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000)}`,
      totalAmount: orderData.totalAmount,
      status: 'pending',
      paymentMethod: orderData.paymentMethod as PaymentMethod,
      paymentStatus: 'pending',
      customerId: orderData.customerId,
      customer: orderData.customer,
      items: orderData.items,
      createdAt: new Date(),
      orderDate: new Date(),
      shippingInfo: orderData.shippingInfo,
      paymentInfo: orderData.paymentInfo
    };
    
    return mockOrder;
  } catch (error) {
    console.error('Error in createOrder:', error);
    return null;
  }
};
