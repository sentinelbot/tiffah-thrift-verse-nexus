
export type ProductCondition = 'new' | 'likeNew' | 'good' | 'fair';

export type ProductStatus = 'available' | 'reserved' | 'sold';

export interface Product {
  id: string;
  name: string;
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
  featured: boolean;
  added_by?: string;
  date_added: string;
  last_updated: string;
  measurements?: Record<string, any>;
  inventory_tracking?: Record<string, any>;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt?: string;
  is_main: boolean;
  display_order: number;
  created_at: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'productManager' | 'orderPreparer' | 'deliveryStaff' | 'customer';
}
