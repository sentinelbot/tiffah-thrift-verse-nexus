
export interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentTransactionId?: string;
  customerId?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  price: number;
  quantity: number;
  createdAt?: Date;
}

export interface OrderSupabase {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  payment_method: string;
  payment_status: string;
  payment_transaction_id?: string;
  customer_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface OrderItemSupabase {
  id: string;
  order_id: string;
  product_id?: string;
  price: number;
  quantity: number;
  created_at?: string;
}
