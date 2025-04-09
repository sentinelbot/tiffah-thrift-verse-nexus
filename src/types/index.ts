
export type ProductCondition = 'new' | 'likeNew' | 'good' | 'fair';

export type ProductStatus = 'available' | 'reserved' | 'sold';

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  original_price?: number | null;
  category: string;
  sub_category?: string | null;
  tags?: string[] | null;
  size?: string | null;
  color?: string | null;
  brand?: string | null;
  condition: ProductCondition;
  barcode: string;
  status: ProductStatus;
  featured: boolean;
  added_by?: string | null;
  date_added: string;
  last_updated: string;
  measurements?: Record<string, any> | null;
  inventory_tracking?: Record<string, any> | null;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt?: string | null;
  is_main: boolean;
  display_order: number;
  created_at: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string | null;
  parent_id?: string | null;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'productManager' | 'orderPreparer' | 'deliveryStaff' | 'customer';
}

export interface OfflineStatus {
  isOnline: boolean;
  lastSync?: Date;
  pendingSyncCount?: number;
}

export interface CartItem {
  id: string;
  user_id: string;
  user_email: string;
  items: any[];
  total_amount: number;
  status: string;
  updated_at: string;
}

// Analytics interfaces
export interface SalesData {
  period: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
  previousPeriodChange?: number;
}

export interface SalesByCategory {
  category: string;
  sales: number;
  percentage: number;
}

export interface InventoryStatus {
  category: string;
  inStock: number;
  lowStock: number;
  totalValue: number;
}

export interface StaffPerformanceData {
  name: string;
  role: string;
  processed?: number;
  fulfilled?: number;
  completed?: number;
  target: number;
  efficiency: number;
}

export interface CustomerBehavior {
  segment: string;
  count: number;
  averageSpend: number;
  repeatRate: number;
  averageItemsPerOrder: number;
}

export interface MarketingEffectiveness {
  campaign: string;
  clicks: number;
  conversions: number;
  revenue: number;
  roi: number;
}

export interface SystemPerformance {
  pageLoadTime: number;
  serverResponseTime: number;
  errorRate: number;
  userSatisfaction: number;
}
