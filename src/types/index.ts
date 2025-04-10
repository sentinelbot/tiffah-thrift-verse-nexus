
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

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isMain: boolean;
  displayOrder: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
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
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

export interface SalesByCategory {
  category: string;
  revenue: number;
  units: number;
  percentage: number;
}

export interface InventoryStatus {
  category: string;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
}

export interface StaffPerformanceData {
  staffId: string;
  name: string;
  role: string;
  ordersProcessed: number;
  itemsProcessed: number;
  averageTime: number;
  rating: number;
}

export interface CustomerBehavior {
  metric: string;
  value: number;
  previousValue: number;
  change: number;
}

export interface MarketingEffectiveness {
  channel: string;
  visits: number;
  conversions: number;
  revenue: number;
  roi: number;
}

export interface SystemPerformance {
  metric: string;
  value: number;
  target: number;
  status: 'good' | 'warning' | 'critical';
}

// Extended CartContext Types
export interface ProductType {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  addedOn: Date;
}

export interface ExtendedCartContextType {
  items: CartItem[];
  wishlistItems: WishlistItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  addToCart: (product: ProductType) => void;
  removeFromCart: (id: string) => void;
  addToWishlist: (product: ProductType) => void;
  removeFromWishlist: (id: string) => void;
  moveToCart: (id: string) => void;
  cartItems: CartItem[];
  calculateCartTotal: () => number;
}
