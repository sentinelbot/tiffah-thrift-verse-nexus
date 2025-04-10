
// Types for product-related functionality
export interface Product {
  id: string;
  name: string;
  title?: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: string;
  subCategory?: string;
  condition: string;
  size?: string;
  color?: string;
  brand?: string;
  barcode: string;
  status: string;
  imageUrl?: string;
  featured?: boolean;
  measurements?: Record<string, number>;
  inventoryTracking?: {
    inStockDate?: string | Date;
    reservedUntil?: string | Date;
    soldDate?: string | Date;
  };
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isMain: boolean;
  displayOrder: number;
}

export interface ProductWithImages extends Product {
  images: ProductImage[];
}

export type ProductType = Product;

// Types for order-related functionality
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

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
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
  shippingMethod: string;
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
  estimatedDelivery?: Date | string;
  actualDelivery?: Date | string;
  trackingId?: string;
  deliveryStaff?: string;
  notes?: string;
}

export interface OrderHistory {
  timestamp: Date | string;
  status: OrderStatus;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customer?: Customer;
  items?: OrderItem[];
  totalAmount: number;
  status: OrderStatus | string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  paymentInfo?: PaymentInfo;
  shippingInfo?: ShippingAddress;
  deliveryInfo?: DeliveryInfo;
  createdAt: Date | string;
  updatedAt?: Date | string;
  orderDate: Date | string;
  processedBy?: string;
  notes?: string;
  barcodeData?: string;
  history?: OrderHistory[];
}

// Types for cart-related functionality
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  product?: Product;
  reservedUntil?: Date;
}

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  addedAt: Date;
}

// Types for analytics and reports
export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

export interface SalesByCategory {
  category: string;
  revenue: number;
  units: number;
  percentage: number;
}

export interface InventoryStatus {
  category: string;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
}

export interface StaffPerformanceData {
  staffId: string;
  name: string;
  ordersProcessed: number;
  itemsProcessed: number;
  averageTimeHours: number;
}

export interface CustomerBehavior {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  orderCount: number;
  lastActive: Date | string;
  averageOrderValue: number;
  lifetimeValue: number;
  acquisitionSource?: string;
}

export interface MarketingEffectiveness {
  channel: string;
  sessions: number;
  conversions: number;
  revenue: number;
  cost: number;
  roi: number;
}

export interface SystemPerformance {
  date: string;
  pageLoadTime: number;
  serverResponseTime: number;
  errorRate: number;
  userSessions: number;
  apiCalls: number;
}

// Types for AI and enhancement-related functionality
export interface AIEnhancement {
  id: string;
  productId: string;
  enhancementType: 'description' | 'image' | 'price' | 'category';
  originalValue: string;
  enhancedValue: string;
  confidence: number;
  createdAt: Date | string;
  usedInProduction: boolean;
}

// Types for printing-related functionality
export interface PrintJob {
  id: string;
  type: 'label' | 'receipt' | 'shippingLabel';
  content: string;
  printerId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  relatedId?: string;
  requestedBy?: string;
  createdAt: Date | string;
  processedAt?: Date | string;
}

// Types for component props
export interface ProductLabelPrintProps {
  product: Product;
  onClose?: () => void;
}

export interface AIDescriptionGeneratorProps {
  product?: Product;
  onGenerated?: (description: string) => void;
  onClose?: () => void;
}

export interface ProductPhotoUploadProps {
  productId?: string;
  onUploaded?: (urls: string[]) => void;
  onClose?: () => void;
}
