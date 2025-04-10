
import { Order, Customer, OrderItem, ShippingAddress, DeliveryInfo, PaymentInfo, OrderHistory } from '@/types';

// This utility maps database response to our type interfaces
export const orderServiceHelper = (data: any[]): Order[] => {
  return data.map(order => ({
    id: order.id,
    orderNumber: order.order_number,
    customer: mapCustomer(order.customer),
    items: mapOrderItems(order.items || []),
    totalAmount: order.total_amount,
    status: order.status,
    paymentMethod: order.payment_method,
    paymentStatus: order.payment_status,
    paymentTransactionId: order.payment_transaction_id,
    paymentInfo: mapPaymentInfo(order),
    shippingInfo: mapShippingInfo(order.shipping_info),
    deliveryInfo: mapDeliveryInfo(order.delivery_info),
    orderDate: order.order_date || order.created_at,
    createdAt: order.created_at,
    processedBy: order.processed_by,
    notes: order.notes,
    barcodeData: order.barcode_data,
    history: mapOrderHistory(order.history || [])
  }));
};

const mapCustomer = (customer: any): Customer => {
  if (!customer) {
    return {
      id: '',
      name: 'Unknown Customer',
      email: ''
    };
  }
  
  return {
    id: customer.id,
    name: customer.name || 'Unknown Customer',
    email: customer.email || '',
    phone: customer.phone
  };
};

const mapOrderItems = (items: any[]): OrderItem[] => {
  return items.map(item => ({
    id: item.id,
    orderId: item.order_id,
    productId: item.product_id,
    product: item.product ? {
      id: item.product.id,
      title: item.product.name,
      price: item.product.price,
      imageUrl: item.product.images?.[0]?.url || '/placeholder.svg'
    } : undefined,
    quantity: item.quantity,
    price: item.price
  }));
};

const mapShippingInfo = (shippingInfo: any): ShippingAddress | undefined => {
  if (!shippingInfo) return undefined;
  
  return {
    fullName: shippingInfo.full_name,
    email: shippingInfo.email,
    phone: shippingInfo.phone,
    address: shippingInfo.address,
    city: shippingInfo.city,
    state: shippingInfo.state,
    postalCode: shippingInfo.postal_code,
    country: shippingInfo.country,
    specialInstructions: shippingInfo.special_instructions,
    shippingMethod: shippingInfo.shipping_method
  };
};

const mapDeliveryInfo = (deliveryInfo: any): DeliveryInfo | undefined => {
  if (!deliveryInfo) return undefined;
  
  return {
    method: deliveryInfo.method,
    cost: deliveryInfo.cost,
    estimatedDelivery: deliveryInfo.estimated_delivery,
    actualDelivery: deliveryInfo.actual_delivery,
    trackingId: deliveryInfo.tracking_id,
    deliveryStaff: deliveryInfo.delivery_staff
  };
};

const mapPaymentInfo = (order: any): PaymentInfo | undefined => {
  if (!order.payment_method) return undefined;
  
  return {
    method: order.payment_method,
    transactionId: order.payment_transaction_id,
    status: order.payment_status,
    amount: order.total_amount
  };
};

const mapOrderHistory = (history: any[]): OrderHistory[] => {
  return history.map(entry => ({
    timestamp: entry.timestamp,
    status: entry.status,
    note: entry.note
  }));
};
