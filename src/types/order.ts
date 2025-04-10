
import { OrderStatus, PaymentMethod, PaymentStatus, OrderItem, ShippingInfo, PaymentInfo, DeliveryInfo, OrderHistory } from './index';

export type { OrderStatus, PaymentMethod, PaymentStatus, OrderItem, ShippingInfo, PaymentInfo, DeliveryInfo, OrderHistory };

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentInfo: PaymentInfo;
  shippingInfo: ShippingInfo;
  deliveryInfo: DeliveryInfo;
  orderDate: Date;
  notes?: string;
  history: OrderHistory[];
}
