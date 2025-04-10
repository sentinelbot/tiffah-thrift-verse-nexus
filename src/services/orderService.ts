
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

    // Cast to Order[] to satisfy TypeScript
    return data.map(order => ({
      id: order.id,
      orderNumber: order.order_number,
      totalAmount: Number(order.total_amount),
      status: order.status as OrderStatus,
      paymentMethod: order.payment_method as PaymentMethod,
      paymentStatus: order.payment_status,
      paymentTransactionId: order.payment_transaction_id,
      customerId: order.customer_id,
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
 * Get orders for a specific customer
 */
export const getCustomerOrders = async (customerId: string): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*, product:products(*))
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching customer orders:', error);
      return [];
    }

    // Cast to Order[] to satisfy TypeScript
    return data.map(order => ({
      id: order.id,
      orderNumber: order.order_number,
      totalAmount: Number(order.total_amount),
      status: order.status as OrderStatus,
      paymentMethod: order.payment_method as PaymentMethod,
      paymentStatus: order.payment_status,
      paymentTransactionId: order.payment_transaction_id,
      customerId: order.customer_id,
      createdAt: new Date(order.created_at),
      updatedAt: order.updated_at ? new Date(order.updated_at) : undefined,
      orderDate: new Date(order.created_at),
      items: order.items || [],
    })) as Order[];
  } catch (error) {
    console.error('Error in getCustomerOrders:', error);
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
    
    // Cast to Order to satisfy TypeScript
    return {
      id: data.id,
      orderNumber: data.order_number,
      totalAmount: Number(data.total_amount),
      status: data.status as OrderStatus,
      paymentMethod: data.payment_method as PaymentMethod,
      paymentStatus: data.payment_status,
      paymentTransactionId: data.payment_transaction_id,
      customerId: data.customer_id,
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
      status: 'pending' as OrderStatus,
      paymentMethod: orderData.paymentMethod as PaymentMethod,
      paymentStatus: 'pending',
      customerId: orderData.customerId,
      createdAt: new Date(),
      orderDate: new Date(),
      shippingInfo: orderData.shippingInfo,
      paymentInfo: orderData.paymentInfo,
      customer: orderData.customer,
      items: orderData.items,
    };
    
    return mockOrder;
  } catch (error) {
    console.error('Error in createOrder:', error);
    return null;
  }
};
