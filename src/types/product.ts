
export type ProductCondition = 'new' | 'likeNew' | 'good' | 'fair';
export type ProductStatus = 'available' | 'reserved' | 'sold';

export interface ProductImage {
  url: string;
  alt: string;
  isMain: boolean;
}

export interface ProductMeasurements {
  chest?: number;
  waist?: number;
  length?: number;
}

export interface InventoryTracking {
  inStockDate?: Date;
  reservedUntil?: Date;
  soldDate?: Date;
}

export interface Product {
  id: string;
  name: string;
  title?: string; // For backward compatibility
  description: string;
  price: number;
  originalPrice?: number;
  original_price?: number; // For backward compatibility
  category: string;
  subCategory?: string;
  sub_category?: string; // For backward compatibility
  size?: string;
  color?: string;
  brand?: string;
  condition: ProductCondition;
  imageUrl?: string; // For backward compatibility
  images: ProductImage[];
  barcode: string;
  status: ProductStatus;
  dateAdded?: Date;
  date_added?: string; // For backward compatibility
  featured: boolean;
  measurements?: ProductMeasurements;
  inventoryTracking?: InventoryTracking;
  tags?: string[];
  added_by?: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subCategory?: string;
  size?: string;
  color?: string;
  brand?: string;
  condition: ProductCondition;
  status: ProductStatus;
  barcode: string;
  featured?: boolean;
  measurements?: ProductMeasurements;
  tags?: string[];
  added_by?: string;
}

export interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  original_price: number;
  category: string;
  sub_category: string;
  size: string;
  color: string;
  brand: string;
  condition: ProductCondition;
  status: ProductStatus;
  barcode?: string; // Make this optional in the form
  featured: boolean;
  measurements?: ProductMeasurements;
  tags?: string[];
  added_by: string;
}
