
export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'ready' 
  | 'outForDelivery' 
  | 'delivered' 
  | 'cancelled';

export type PaymentMethod = 'mpesa' | 'card' | 'paypal' | 'cash';

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'refunded';

export interface OrderItem {
  productId: string;
  product: {
    id: string;
    name: string;  // Changed to match other files
    price: number;
    imageUrl?: string;
  };
  quantity: number;
  price: number;
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
  shippingMethod: 'standard' | 'express';
  specialInstructions?: string;
}

export interface PaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  amount: number;
}

export interface DeliveryInfo {
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  trackingId?: string;
  deliveryStaff?: string;
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
  history: {
    timestamp: Date;
    status: OrderStatus;
    note?: string;
    updatedBy?: string;
  }[];
}
