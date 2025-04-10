
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string, role?: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

export interface ProductImage {
  id?: string;
  url: string;
  alt?: string;
  isMain?: boolean;
  displayOrder?: number;
  productId?: string;
}

// Base product interface that ensures all necessary properties are present
export interface BaseProduct {
  id: string;
  name: string;
  title: string; // Added for compatibility with ProductType
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
  dateAdded: Date;
  lastUpdated: Date;
  addedBy?: string;
  featured: boolean;
  imageUrl?: string; // For backward compatibility
  measurements?: {
    chest?: number;
    waist?: number;
    length?: number;
    [key: string]: number | undefined;
  };
  inventoryTracking?: {
    inStockDate?: Date;
    reservedUntil?: Date;
    soldDate?: Date;
  };
}

// Main Product interface that extends the base interface
export interface Product extends BaseProduct {
  // Additional product-specific properties can go here
}

// ProductType interface for backward compatibility
export interface ProductType {
  id: string;
  title: string;
  name: string; // Added to fix error
  price: number;
  originalPrice?: number;
  category: string;
  condition?: string;
  size?: string;
  color?: string;
  brand?: string;
  imageUrl: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  children?: Category[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PrintJob {
  id: string;
  type: 'label' | 'receipt' | 'shippingLabel';
  content: string;
  printerId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  requestedBy?: string;
  relatedId?: string;
  createdAt: Date;
  processedAt?: Date;
}

// Analytics Types

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

// Add a mapping helper function for Supabase data conversion
export function mapSupabaseProduct(data: any): Product {
  return {
    id: data.id,
    name: data.name,
    title: data.name, // Ensure title is also set for compatibility
    description: data.description,
    price: data.price,
    originalPrice: data.original_price,
    category: data.category,
    subCategory: data.sub_category,
    tags: data.tags,
    size: data.size,
    color: data.color,
    brand: data.brand,
    condition: data.condition,
    barcode: data.barcode,
    status: data.status as 'available' | 'reserved' | 'sold',
    dateAdded: new Date(data.date_added),
    lastUpdated: new Date(data.last_updated),
    addedBy: data.added_by,
    featured: data.featured,
    imageUrl: data.images?.[0]?.url || '/placeholder.svg',
    measurements: typeof data.measurements === 'string' 
      ? JSON.parse(data.measurements) 
      : data.measurements,
    inventoryTracking: typeof data.inventory_tracking === 'string'
      ? JSON.parse(data.inventory_tracking)
      : data.inventory_tracking
  };
}

// Type for profile data from supabase
export interface Profile {
  id: string;
  name: string;
  email: string;
  role?: string;
  phone?: string;
  loyaltyPoints?: number;
  created_at?: string;
  updated_at?: string;
}
