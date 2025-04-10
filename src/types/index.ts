
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
