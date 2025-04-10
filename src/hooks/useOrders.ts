
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (
    limit: number = 20,
    offset: number = 0,
    status?: string,
    customerId?: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items(*),
          shipping_info(*),
          delivery_info(*)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (status) {
        query = query.eq('status', status);
      }
      
      if (customerId) {
        query = query.eq('customer_id', customerId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders');
      toast.error('Failed to fetch orders');
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchOrderById = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*),
          shipping_info(*),
          delivery_info(*),
          order_history(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err: any) {
      console.error('Error fetching order:', err);
      setError(err.message || 'Failed to fetch order');
      toast.error('Failed to fetch order');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const createOrder = async (orderData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Start a transaction by using Supabase's upsert pattern
      // First, create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_id: orderData.customerId,
          total_amount: orderData.totalAmount,
          status: 'pending',
          payment_method: orderData.paymentMethod,
          payment_status: 'pending',
          order_number: `TTS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`
        }])
        .select()
        .single();
      
      if (orderError) {
        throw orderError;
      }
      
      // Then, create order items
      const orderItems = orderData.items.map((item: any) => ({
        order_id: order.id,
        product_id: item.id,
        price: item.price,
        quantity: item.quantity
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) {
        throw itemsError;
      }
      
      // Create shipping information
      const { error: shippingError } = await supabase
        .from('shipping_info')
        .insert([{
          order_id: order.id,
          full_name: orderData.shipping.fullName,
          email: orderData.shipping.email,
          phone: orderData.shipping.phone,
          address: orderData.shipping.address,
          city: orderData.shipping.city,
          state: orderData.shipping.state,
          postal_code: orderData.shipping.postalCode,
          country: orderData.shipping.country,
          shipping_method: orderData.shipping.method,
          special_instructions: orderData.shipping.instructions
        }]);
      
      if (shippingError) {
        throw shippingError;
      }
      
      // Create initial order history entry
      const { error: historyError } = await supabase
        .from('order_history')
        .insert([{
          order_id: order.id,
          status: 'pending',
          note: 'Order created'
        }]);
      
      if (historyError) {
        throw historyError;
      }
      
      toast.success('Order created successfully');
      return order;
    } catch (err: any) {
      console.error('Error creating order:', err);
      setError(err.message || 'Failed to create order');
      toast.error('Failed to create order');
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateOrderStatus = async (orderId: string, status: string, note?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update the order status
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (orderError) {
        throw orderError;
      }
      
      // Add a new entry to order history
      const { error: historyError } = await supabase
        .from('order_history')
        .insert([{
          order_id: orderId,
          status,
          note: note || `Status updated to ${status}`
        }]);
      
      if (historyError) {
        throw historyError;
      }
      
      toast.success(`Order status updated to ${status}`);
      return true;
    } catch (err: any) {
      console.error('Error updating order status:', err);
      setError(err.message || 'Failed to update order status');
      toast.error('Failed to update order status');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updatePaymentStatus = async (orderId: string, paymentStatus: string, transactionId?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updates: any = { payment_status: paymentStatus };
      
      if (transactionId) {
        updates.payment_transaction_id = transactionId;
      }
      
      // Update the payment status
      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId);
      
      if (error) {
        throw error;
      }
      
      // Add a new entry to order history
      const { error: historyError } = await supabase
        .from('order_history')
        .insert([{
          order_id: orderId,
          status: 'payment_update',
          note: `Payment status updated to ${paymentStatus}`
        }]);
      
      if (historyError) {
        throw historyError;
      }
      
      toast.success(`Payment status updated to ${paymentStatus}`);
      return true;
    } catch (err: any) {
      console.error('Error updating payment status:', err);
      setError(err.message || 'Failed to update payment status');
      toast.error('Failed to update payment status');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const assignDeliveryStaff = async (orderId: string, staffId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if delivery info exists
      const { data: existingInfo, error: checkError } = await supabase
        .from('delivery_info')
        .select('id')
        .eq('order_id', orderId)
        .maybeSingle();
      
      if (checkError) {
        throw checkError;
      }
      
      let operation;
      
      if (existingInfo) {
        // Update existing delivery info
        operation = supabase
          .from('delivery_info')
          .update({ 
            delivery_staff: staffId,
            estimated_delivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
          })
          .eq('order_id', orderId);
      } else {
        // Create new delivery info
        operation = supabase
          .from('delivery_info')
          .insert([{ 
            order_id: orderId,
            delivery_staff: staffId,
            estimated_delivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
          }]);
      }
      
      const { error } = await operation;
      
      if (error) {
        throw error;
      }
      
      // Update order status if it's still pending
      const { data: orderData } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single();
      
      if (orderData && orderData.status === 'pending') {
        await updateOrderStatus(orderId, 'processing', 'Delivery staff assigned');
      } else {
        // Add a history entry
        const { error: historyError } = await supabase
          .from('order_history')
          .insert([{
            order_id: orderId,
            status: 'delivery_update',
            note: 'Delivery staff assigned'
          }]);
        
        if (historyError) {
          throw historyError;
        }
      }
      
      toast.success('Delivery staff assigned successfully');
      return true;
    } catch (err: any) {
      console.error('Error assigning delivery staff:', err);
      setError(err.message || 'Failed to assign delivery staff');
      toast.error('Failed to assign delivery staff');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    error,
    fetchOrders,
    fetchOrderById,
    createOrder,
    updateOrderStatus,
    updatePaymentStatus,
    assignDeliveryStaff
  };
};
