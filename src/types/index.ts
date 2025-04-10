
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

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subCategory?: string;
  size?: string;
  color?: string;
  brand?: string;
  condition: 'new' | 'likeNew' | 'good' | 'fair';
  imageUrl: string;
  images: { url: string; alt?: string; isMain: boolean }[];
  barcode: string;
  status: 'available' | 'reserved' | 'sold';
  dateAdded?: Date;
  featured: boolean;
  measurements?: {
    chest?: number;
    waist?: number;
    length?: number;
  };
  // For backward compatibility with database structure
  title?: string; // Alias for name
  original_price?: number;
  sub_category?: string;
  date_added?: string;
}

// Analytics types
export interface SalesData {
  period?: string;
  date?: string;
  revenue?: number;
  amount?: number;
  orders?: number;
  averageOrderValue?: number;
  avgOrderValue?: number;
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
  lowStock?: number;
  reserved?: number;
  sold?: number;
  totalValue?: number;
}

export interface StaffPerformanceData {
  name: string;
  role: string;
  productivity?: number;
  accuracy?: number;
  customerRating?: number;
  processed?: number;
  fulfilled?: number;
  completed?: number;
  target?: number;
  efficiency?: number;
}

export interface CustomerBehavior {
  metric?: string;
  value?: number;
  previousValue?: number;
  change?: number;
  segment?: string;
  count?: number;
  averageSpend?: number;
  repeatRate?: number;
  averageItemsPerOrder?: number;
}

export interface MarketingEffectiveness {
  channel?: string;
  visitors?: number;
  conversion?: number;
  cost?: number;
  roi?: number;
  campaign?: string;
  clicks?: number;
  conversions?: number;
  revenue?: number;
}

export interface SystemPerformance {
  metric?: string;
  value?: number;
  target?: number;
  status?: 'good' | 'warning' | 'critical';
  pageLoadTime?: number;
  serverResponseTime?: number;
  errorRate?: number;
  userSatisfaction?: number;
}

// Export existing Order types from order.ts
export * from './order';
