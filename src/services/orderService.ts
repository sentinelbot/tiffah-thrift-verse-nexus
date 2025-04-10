
import { Order, OrderCreateInput, OrderStatus } from '@/types/order';
import { toast } from 'sonner';

// Generate a random order number in the format TTS-YYYYMMDD-XXXX
const generateOrderNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  
  return `TTS-${year}${month}${day}-${random}`;
};

// Create a new order
export const createOrder = async (orderData: OrderCreateInput): Promise<Order> => {
  // This would be an actual API call in production
  console.log('Creating order:', orderData);
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 15),
      orderNumber: generateOrderNumber(),
      customer: orderData.customer,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      status: 'pending',
      paymentInfo: orderData.paymentInfo,
      shippingInfo: orderData.shippingInfo,
      deliveryInfo: orderData.deliveryInfo,
      orderDate: new Date()
    };
    
    // In production, this would be stored in the database
    // For now, we'll store it in localStorage for demo purposes
    const savedOrders = localStorage.getItem('tiffah-orders');
    const orders = savedOrders ? JSON.parse(savedOrders) : [];
    orders.push(newOrder);
    localStorage.setItem('tiffah-orders', JSON.stringify(orders));
    
    return newOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    toast.error('Failed to create order');
    throw error;
  }
};

// Get an order by ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  console.log('Fetching order:', orderId);
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Retrieve from localStorage for demo purposes
    const savedOrders = localStorage.getItem('tiffah-orders');
    if (!savedOrders) return null;
    
    const orders: Order[] = JSON.parse(savedOrders);
    const order = orders.find(o => o.id === orderId);
    
    return order || null;
  } catch (error) {
    console.error('Error fetching order:', error);
    toast.error('Failed to fetch order details');
    return null;
  }
};

// Get all orders for a customer
export const getCustomerOrders = async (customerId: string): Promise<Order[]> => {
  console.log('Fetching orders for customer:', customerId);
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Retrieve from localStorage for demo purposes
    const savedOrders = localStorage.getItem('tiffah-orders');
    if (!savedOrders) return [];
    
    const orders: Order[] = JSON.parse(savedOrders);
    return orders.filter(o => o.customer.id === customerId);
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    toast.error('Failed to fetch your order history');
    return [];
  }
};

// Update order status
export const updateOrderStatus = async (
  orderId: string, 
  status: OrderStatus,
  notes?: string
): Promise<boolean> => {
  console.log(`Updating order ${orderId} status to ${status}`);
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Retrieve from localStorage for demo purposes
    const savedOrders = localStorage.getItem('tiffah-orders');
    if (!savedOrders) return false;
    
    const orders: Order[] = JSON.parse(savedOrders);
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) return false;
    
    // Update the order status
    orders[orderIndex].status = status;
    if (notes) {
      orders[orderIndex].notes = notes;
    }
    
    // Save back to localStorage
    localStorage.setItem('tiffah-orders', JSON.stringify(orders));
    
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    toast.error('Failed to update order status');
    return false;
  }
};
