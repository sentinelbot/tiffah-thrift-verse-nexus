
export type PaymentMethod = 'mpesa' | 'card' | 'paypal' | 'cash';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export type OrderStatus = 'pending' | 'processing' | 'ready' | 'outForDelivery' | 'delivered' | 'cancelled';

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  shippingMethod: 'standard' | 'express';
}

export interface PaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  amount: number;
}

export interface DeliveryInfo {
  method?: string;
  cost?: number;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  trackingId?: string;
  deliveryStaff?: string;
}

export interface OrderItem {
  productId: string;
  product: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentInfo: PaymentInfo;
  shippingInfo: ShippingInfo;
  deliveryInfo: DeliveryInfo;
  orderDate: Date;
  notes?: string;
}

export interface OrderCreateInput {
  customer: {
    id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  paymentInfo: Omit<PaymentInfo, 'transactionId'>;
  shippingInfo: ShippingInfo;
  deliveryInfo: {
    estimatedDelivery: Date;
  };
}
