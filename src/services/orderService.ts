
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem } from '@/types/orderTypes';
import { orderServiceHelper } from '@/utils/orderTypeMapper';

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer:profiles(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return orderServiceHelper(data || []);
  } catch (err) {
    console.error('Exception fetching orders:', err);
    return [];
  }
};

export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(*),
        customer:profiles(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching order by ID:', error);
      return null;
    }

    const orders = orderServiceHelper([data]);
    return orders[0] || null;
  } catch (err) {
    console.error('Exception fetching order by ID:', err);
    return null;
  }
};

export const getCustomerOrders = async (customerId: string): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching customer orders:', error);
      return [];
    }

    return orderServiceHelper(data || []);
  } catch (err) {
    console.error('Exception fetching customer orders:', err);
    return [];
  }
};

export const createOrder = async (order: any): Promise<Order | null> => {
  try {
    // Step 1: Create the order record
    const { data: newOrderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          customer_id: order.customerId,
          total_amount: order.totalAmount,
          status: 'pending',
          payment_method: order.paymentMethod,
          payment_status: 'pending',
          order_number: `TTS-${Date.now()}`
        }
      ])
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return null;
    }

    // Step 2: Create order items
    const orderItems = order.items.map((item: any) => ({
      order_id: newOrderData.id,
      product_id: item.productId,
      price: item.price,
      quantity: item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Consider rolling back the order here in a real application
      return null;
    }

    // Fetch the complete order with items
    return await getOrderById(newOrderData.id);
  } catch (err) {
    console.error('Exception creating order:', err);
    return null;
  }
};
