
export interface Delivery {
  id: string;
  orderNumber: string;
  customerName: string;
  address: string;
  phone: string;
  status: 'pending' | 'inProgress' | 'delivered' | 'failed';
  items: DeliveryItem[];
  assignedTo?: string;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
  trackingCode?: string;
  totalPrice?: number; // Added property
  customerInfo?: {
    name: string;
    phone: string;
    email?: string;
  }; // Added property
}

export interface DeliveryItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  verified: boolean;
  price?: number; // Added property for price
}

export interface DeliveryFilter {
  status?: string;
  date?: Date;
  assignedTo?: string;
}
