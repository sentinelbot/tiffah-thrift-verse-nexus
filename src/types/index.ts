
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
  dateAdded: Date;
  lastUpdated: Date;
  addedBy?: string;
  featured: boolean;
  imageUrl?: string; // Added for backward compatibility with some components
  title?: string; // Added for backward compatibility with some components
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

// This interface replicates the structure used in some components
export interface ProductType {
  id: string;
  title: string;
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
