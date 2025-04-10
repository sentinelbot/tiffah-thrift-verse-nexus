
// Common Types for the Tiffah Thrift Store
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  phone?: string;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  slug?: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: string;
  subCategory?: string;
  tags?: string[];
  size?: string;
  color?: string;
  brand?: string;
  condition: 'new' | 'likeNew' | 'good' | 'fair';
  images?: ProductImage[];
  barcode: string;
  status: 'available' | 'reserved' | 'sold';
  dateAdded: Date | string;
  lastUpdated: Date | string;
  addedBy?: string;
  featured?: boolean;
  measurements?: {
    chest?: number;
    waist?: number;
    length?: number;
    [key: string]: number | undefined;
  };
  inventoryTracking?: {
    inStockDate?: Date | string;
    reservedUntil?: Date | string;
    soldDate?: Date | string;
  };
}

export interface ProductImage {
  id?: string;
  url: string;
  alt?: string;
  isMain?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

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
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

export type ShippingMethod = 
  | 'standard'
  | 'express'
  | 'pickup';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
}

export interface DeliveryInfo {
  method: ShippingMethod;
  cost: number;
  estimatedDelivery: Date | string;
  actualDelivery?: Date | string;
  trackingId?: string;
  deliveryStaff?: string;
}

export interface PaymentInfo {
  method: PaymentMethod;
  transactionId?: string;
  status: PaymentStatus;
  amount: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  specialInstructions?: string;
  shippingMethod: ShippingMethod;
}

export interface OrderHistory {
  timestamp: Date | string;
  status: OrderStatus;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  paymentInfo?: PaymentInfo;
  shippingInfo?: ShippingAddress;
  deliveryInfo?: DeliveryInfo;
  orderDate: Date | string;
  createdAt: Date | string;
  processedBy?: string;
  notes?: string;
  barcodeData?: string;
  history?: OrderHistory[];
}

export type DeliveryStatus = 
  | 'ready'
  | 'assigned'
  | 'intransit'
  | 'delivered'
  | 'failed';

export interface DeliveryAddress {
  street: string;
  city: string;
  postalCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface DeliveryProof {
  photo?: string;
  signature?: string;
  notes?: string;
}

export interface Delivery {
  id: string;
  orderNumber: string;
  trackingId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  status: DeliveryStatus;
  items: {
    id: string;
    name: string;
    quantity: number;
  }[];
  totalAmount: number;
  shippingMethod: ShippingMethod;
  address: DeliveryAddress;
  assignedAt: Date | string;
  estimatedDelivery: Date | string;
  actualDelivery?: Date | string;
  pickedUpAt?: Date | string;
  attemptedDelivery?: Date | string;
  failureReason?: string;
  priority: 'high' | 'normal' | 'low';
  distance: number;
  notes?: string;
  deliveryProof?: DeliveryProof;
}

export interface ScanHistory {
  id: string;
  barcode: string;
  scan_type: 'product' | 'order' | 'delivery' | 'unknown';
  scan_time: Date | string;
  location?: string;
  result?: string;
  status: 'success' | 'error';
  scanned_by?: string;
  device_info?: string;
}

export interface PrintJob {
  id: string;
  type: 'label' | 'receipt' | 'shippingLabel';
  content: string;
  printerId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date | string;
  processedAt?: Date | string;
  error?: string;
  relatedId?: string;
  requestedBy?: string;
}
