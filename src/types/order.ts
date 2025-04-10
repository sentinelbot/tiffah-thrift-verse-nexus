
export type OrderStatus = 'pending' | 'processing' | 'ready' | 'outForDelivery' | 'delivered' | 'cancelled';

export type PaymentMethod = 'mpesa' | 'card' | 'paypal' | 'cash';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export type ShippingMethod = 'standard' | 'express';

export interface OrderHistoryItem {
  timestamp: Date;
  status: OrderStatus;
  note?: string;
  updatedBy?: string;
}

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  shippingMethod: ShippingMethod;
  specialInstructions?: string;
}

export interface PaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  amount: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  product?: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
  };
  price: number;
  quantity: number;
  createdAt?: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  customerId?: string;
  createdAt: Date;
  updatedAt?: Date;
  
  // Extended properties that weren't in the original type
  orderDate: Date;
  items: OrderItem[];
  paymentInfo: PaymentInfo;
  shippingInfo: ShippingInfo;
  deliveryInfo: {
    estimatedDelivery: Date;
    actualDelivery?: Date;
    trackingId?: string;
  };
  history: OrderHistoryItem[];
  customer?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface OrderSupabase {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  payment_transaction_id?: string;
  customer_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface OrderItemSupabase {
  id: string;
  order_id: string;
  product_id?: string;
  price: number;
  quantity: number;
  created_at?: string;
}
