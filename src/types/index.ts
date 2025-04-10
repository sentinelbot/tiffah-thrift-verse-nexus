
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
  title: string;
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
  images: { url: string; alt: string; isMain: boolean }[];
  barcode: string;
  status: 'available' | 'reserved' | 'sold';
  dateAdded: Date;
  featured: boolean;
  measurements?: {
    chest?: number;
    waist?: number;
    length?: number;
  };
}

// Analytics types
export interface SalesData {
  date: string;
  amount: number;
  orders: number;
  avgOrderValue: number;
}

export interface SalesByCategory {
  category: string;
  sales: number;
  percentage: number;
}

export interface InventoryStatus {
  category: string;
  inStock: number;
  reserved: number;
  sold: number;
}

export interface StaffPerformanceData {
  name: string;
  role: string;
  productivity: number;
  accuracy: number;
  customerRating: number;
}

export interface CustomerBehavior {
  metric: string;
  value: number;
  previousValue: number;
  change: number;
}

export interface MarketingEffectiveness {
  channel: string;
  visitors: number;
  conversion: number;
  cost: number;
  roi: number;
}

export interface SystemPerformance {
  metric: string;
  value: number;
  target: number;
  status: 'good' | 'warning' | 'critical';
}

// Export existing Order types from order.ts
export * from './order';
