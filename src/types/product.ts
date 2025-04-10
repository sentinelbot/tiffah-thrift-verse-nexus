
// Define types for product-related functionality

export interface ProductType {
  id: string;
  name: string;
  title?: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  category?: string;
  condition?: string;
  size?: string;
  color?: string;
  brand?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isMain: boolean;
  displayOrder: number;
}

export interface ProductWithImages {
  id: string;
  name: string;
  title?: string;
  price: number;
  originalPrice?: number;
  category?: string;
  condition?: string;
  size?: string;
  color?: string;
  brand?: string;
  images: ProductImage[];
}

export type Json = 
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface InventoryTracking {
  inStockDate?: string | Date;
  reservedUntil?: string | Date;
  soldDate?: string | Date;
}

// Helper functions for type safety
export const isJsonObject = (json: Json): json is { [key: string]: Json } => {
  return typeof json === 'object' && json !== null && !Array.isArray(json);
};

export const getMeasurementsFromJson = (json: Json | undefined): { [key: string]: number } => {
  if (!json || !isJsonObject(json)) return {};
  
  const result: { [key: string]: number } = {};
  Object.entries(json).forEach(([key, value]) => {
    if (typeof value === 'number') {
      result[key] = value;
    } else if (typeof value === 'string') {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        result[key] = num;
      }
    }
  });
  
  return result;
};

export const getInventoryTrackingFromJson = (json: Json | undefined): InventoryTracking => {
  if (!json || !isJsonObject(json)) return {};
  
  const inStockDate = isJsonObject(json) && json.inStockDate ? json.inStockDate as string : undefined;
  const reservedUntil = isJsonObject(json) && json.reservedUntil ? json.reservedUntil as string : undefined;
  const soldDate = isJsonObject(json) && json.soldDate ? json.soldDate as string : undefined;
  
  return {
    inStockDate,
    reservedUntil,
    soldDate
  };
};
