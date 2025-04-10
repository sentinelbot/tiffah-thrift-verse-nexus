
import { Order as OrderType1 } from '@/types/orderTypes';
import { Order as OrderType2 } from '@/types/order';
import { Customer, PaymentInfo, ShippingInfo, OrderItem } from '@/types/orderTypes';

/**
 * Safely converts from one order type to another
 */
export const convertOrderType = (order: OrderType1): OrderType2 => {
  return {
    ...order,
    status: order.status as any,
    paymentStatus: order.paymentStatus as any,
    paymentMethod: order.paymentMethod as any,
    items: order.items || [], // Ensure items is never undefined
  };
};

/**
 * Creates a safe customer object from potentially incomplete data
 */
export const createSafeCustomer = (customerData: any): Customer => {
  return {
    id: customerData?.id || '',
    name: customerData?.name || 'Unknown',
    email: customerData?.email || ''
  };
};

/**
 * Creates a safe order item object from potentially incomplete data
 */
export const createSafeOrderItem = (itemData: any): OrderItem => {
  return {
    id: itemData?.id || '',
    orderId: itemData?.order_id || itemData?.orderId || '',
    productId: itemData?.product_id || itemData?.productId || '',
    price: Number(itemData?.price) || 0,
    quantity: itemData?.quantity || 1,
    product: itemData?.product ? {
      id: itemData.product.id || '',
      title: itemData.product.name || itemData.product.title || '',
      price: Number(itemData.product.price) || 0,
      imageUrl: itemData.product.imageUrl || itemData.product.image_url || '/placeholder.svg'
    } : undefined
  };
};

/**
 * Helper function for services to convert from database records to application models
 */
export const orderServiceHelper = (dbOrders: any[]): OrderType1[] => {
  return dbOrders.map(order => ({
    id: order.id,
    orderNumber: order.order_number || order.orderNumber,
    totalAmount: Number(order.total_amount || order.totalAmount),
    status: order.status,
    paymentMethod: order.payment_method || order.paymentMethod,
    paymentStatus: order.payment_status || order.paymentStatus,
    paymentTransactionId: order.payment_transaction_id || order.paymentTransactionId,
    customerId: order.customer_id || order.customerId,
    createdAt: new Date(order.created_at || order.createdAt),
    updatedAt: order.updated_at || order.updatedAt ? new Date(order.updated_at || order.updatedAt) : undefined,
    orderDate: new Date(order.created_at || order.createdAt || order.orderDate),
    items: Array.isArray(order.items) ? 
      order.items.map(createSafeOrderItem) : [],
    customer: order.customer ? 
      createSafeCustomer(order.customer) : undefined,
    paymentInfo: {
      method: order.payment_method || order.paymentMethod,
      status: order.payment_status || order.paymentStatus,
      transactionId: order.payment_transaction_id || order.paymentTransactionId,
      amount: Number(order.total_amount || order.totalAmount)
    } as PaymentInfo,
    shippingInfo: order.shippingInfo || {},
    deliveryInfo: {
      estimatedDelivery: order.deliveryInfo?.estimatedDelivery ? 
        new Date(order.deliveryInfo.estimatedDelivery) : new Date(),
      actualDelivery: order.deliveryInfo?.actualDelivery ? 
        new Date(order.deliveryInfo.actualDelivery) : undefined,
      trackingId: order.deliveryInfo?.trackingId
    },
    history: Array.isArray(order.history) ? 
      order.history.map((h: any) => ({
        timestamp: new Date(h.timestamp),
        status: h.status,
        note: h.note
      })) : []
  }));
};
