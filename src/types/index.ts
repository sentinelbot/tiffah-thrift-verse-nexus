
export type ProductCondition = 'new' | 'likeNew' | 'good' | 'fair';

export type ProductStatus = 'available' | 'reserved' | 'sold';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category: string;
  sub_category: string | null;
  tags: string[] | null;
  size: string | null;
  color: string | null;
  brand: string | null;
  condition: ProductCondition;
  barcode: string;
  status: ProductStatus;
  featured: boolean;
  added_by: string | null;
  date_added: string;
  last_updated: string;
  measurements: Record<string, any> | null;
  inventory_tracking: Record<string, any> | null;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  is_main: boolean;
  display_order: number;
  created_at: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'productManager' | 'orderPreparer' | 'deliveryStaff' | 'customer';
}
