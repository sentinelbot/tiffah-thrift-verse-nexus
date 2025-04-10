
import { Json } from '@/integrations/supabase/types';

// Extend types for better type safety with Supabase
export interface SupabaseProduct {
  id: string;
  name: string;
  title?: string;
  description?: string;
  price: number;
  original_price?: number;
  category: string;
  sub_category?: string;
  tags?: string[];
  size?: string;
  color?: string;
  brand?: string;
  condition: 'new' | 'likeNew' | 'good' | 'fair';
  barcode: string;
  status: 'available' | 'reserved' | 'sold';
  image_url?: string;
  featured: boolean;
  measurements?: Record<string, number>;
  inventory_tracking?: {
    inStockDate?: string;
    reservedUntil?: string;
    soldDate?: string;
  };
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface ProductImageSupabase {
  id: string;
  product_id: string;
  url: string;
  alt?: string;
  is_main: boolean;
  display_order: number;
  created_at: string;
}

export interface OrderSupabase {
  id: string;
  order_number: string;
  customer_id: string;
  total_amount: number;
  status: string;
  payment_info: {
    method: string;
    status: string;
    transactionId?: string;
    amount: number;
  };
  shipping_info: {
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
  };
  delivery_info: {
    estimatedDelivery?: string;
    actualDelivery?: string;
    trackingId?: string;
    deliveryStaff?: string;
  };
  notes?: string;
  created_at: string;
  updated_at: string;
  processed_by?: string;
}

export interface OrderItemSupabase {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
}

export interface OrderHistorySupabase {
  id: string;
  order_id: string;
  status: string;
  notes?: string;
  updated_by?: string;
  created_at: string;
}

export interface PrintJobSupabase {
  id: string;
  type: 'label' | 'receipt' | 'shippingLabel';
  content: string;
  printer_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  related_id?: string;
  requested_by?: string;
  created_at: string;
  processed_at?: string;
}

export interface UserRoleSupabase {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

export interface PendingScanSupabase {
  id: string;
  user_id: string;
  scan_type: string;
  barcode: string;
  data: Json;
  created_at: string;
  processed: boolean;
  processed_at?: string;
}

export interface ScanHistorySupabase {
  id: string;
  user_id: string;
  scan_type: string;
  barcode: string;
  result: Json;
  scanned_at: string;
}

export interface SalesDataSupabase {
  date: string;
  revenue: number;
  orders: number;
  average_order_value: number;
}

export interface SalesByCategorySupabase {
  category: string;
  revenue: number;
  units: number;
  percentage: number;
}

export interface InventoryStatusSupabase {
  category: string;
  in_stock: number;
  low_stock: number;
  out_of_stock: number;
  total_value: number;
}

export interface StaffPerformanceSupabase {
  staff_id: string;
  name: string;
  orders_processed: number;
  items_processed: number;
  average_time_hours: number;
}
