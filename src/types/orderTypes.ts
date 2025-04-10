
// Define types for order-related functionality

export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'ready'
  | 'outForDelivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 
  | 'mpesa'
  | 'card'
  | 'paypal'
  | 'cash';

export type PaymentStatus = 
  | 'pending'
  | 'completed'
  | 'failed'
  | 'refunded';

export interface Customer {
  id: string;
  name: string;
  email: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  price: number;
  quantity: number;
  product?: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
  };
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
  shippingMethod: string;
  specialInstructions?: string;
}

export interface PaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId: string;
  amount: number;
}

export interface DeliveryInfo {
  estimatedDelivery: Date;
  actualDelivery?: Date;
  trackingId?: string;
  deliveryStaff?: string;
  notes?: string;
}

export interface OrderHistory {
  timestamp: Date;
  status: OrderStatus;
  note: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  customerId?: string;
  customer?: Customer;
  items?: OrderItem[];
  createdAt: Date;
  updatedAt?: Date;
  orderDate: Date;
  shippingInfo?: ShippingInfo;
  paymentInfo?: PaymentInfo;
  deliveryInfo?: DeliveryInfo;
  history?: OrderHistory[];
}

export interface OrderCreateInput {
  customerId: string;
  items: Omit<OrderItem, 'id' | 'orderId'>[];
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
}
