
import { ProductImage } from "./product";

export type Category = {
  id: string;
  name: string;
  description?: string;
  image?: string;
};

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
  pickedUpBy?: string;
  pickedUpAt?: string;
  deliveredBy?: string;
  deliveredAt?: string;
  recipientName?: string;
  notes?: string;
}

export interface OrderHistory {
  timestamp: Date;
  status: OrderStatus;
  note?: string;
  updatedBy?: string;
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
  history: OrderHistory[];
}

// Define the Product interface to align with database structure and UI needs
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description?: string;
  category: string;
  subCategory?: string;
  condition: 'new' | 'likeNew' | 'good' | 'fair';
  brand?: string;
  size?: string;
  color?: string;
  barcode: string;
  status: string;
  featured: boolean;
  imageUrl?: string;
  images: ProductImage[];
  dateAdded: string;
  lastUpdated?: string;
  measurements?: {
    chest?: number;
    waist?: number;
    length?: number;
  };
  tags?: string[];
  
  // Fields to maintain compatibility with database structure
  original_price?: number;
  sub_category?: string;
  date_added?: string;
  last_updated?: string;
  added_by?: string;
  inventory_tracking?: any;
}

export interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  name?: string | null;
  phone?: string | null;
  role?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface PrintJob {
  id: string;
  type: 'receipt' | 'label' | 'shipping';
  content: string;
  printerId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  processedAt?: Date;
  error?: string;
  relatedId?: string;
  requestedBy: string;
}

export * from './analytics';
