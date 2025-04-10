
import AdminLayout from '@/components/layout/AdminLayout';
import { OrdersTable } from '@/components/admin/orders/OrdersTable';
import OrderReceiptPrint from '@/components/admin/printing/OrderReceiptPrint';
import ShippingLabelPrint from '@/components/admin/printing/ShippingLabelPrint';
import { Order, OrderStatus, PaymentMethod, PaymentStatus } from '@/types/orderTypes';

// Mock order for demonstration
const mockOrder: Order = {
  id: "order-123",
  orderNumber: "TTS-20250409-1234",
  totalAmount: 4500,
  status: "processing" as OrderStatus,
  paymentMethod: "mpesa" as PaymentMethod,
  paymentStatus: "completed" as PaymentStatus,
  paymentTransactionId: "MPESA123456",
  createdAt: new Date(),
  orderDate: new Date(),
  customer: {
    id: "cust-123",
    name: "Jane Smith",
    email: "jane@example.com"
  },
  items: [
    {
      id: "item-001",
      orderId: "order-123",
      productId: "prod-001",
      product: {
        id: "prod-001",
        title: "Vintage Denim Jacket",
        price: 2500,
        imageUrl: "/placeholder.svg"
      },
      quantity: 1,
      price: 2500
    },
    {
      id: "item-002",
      orderId: "order-123",
      productId: "prod-002",
      product: {
        id: "prod-002",
        title: "Floral Summer Dress",
        price: 1800,
        imageUrl: "/placeholder.svg"
      },
      quantity: 1,
      price: 1800
    }
  ],
  paymentInfo: {
    method: "mpesa" as PaymentMethod,
    status: "completed" as PaymentStatus,
    transactionId: "MPESA123456",
    amount: 4500
  },
  shippingInfo: {
    fullName: "Jane Smith",
    email: "jane@example.com",
    phone: "+254712345678",
    address: "123 Main St",
    city: "Nairobi",
    state: "Nairobi",
    postalCode: "00100",
    country: "Kenya",
    shippingMethod: "express"
  },
  deliveryInfo: {
    estimatedDelivery: new Date(Date.now() + 86400000), // Tomorrow
    trackingId: "TRK12345"
  },
  history: [
    {
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      status: "pending" as OrderStatus,
      note: "Order placed"
    },
    {
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      status: "processing" as OrderStatus,
      note: "Payment confirmed"
    }
  ]
};

const Orders = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">Manage customer orders</p>
          </div>
          <div className="flex gap-2">
            <OrderReceiptPrint order={mockOrder} />
            <ShippingLabelPrint order={mockOrder} />
          </div>
        </div>
        
        <OrdersTable />
      </div>
    </AdminLayout>
  );
};

export default Orders;
