
import AdminLayout from '@/components/layout/AdminLayout';
import { OrdersTable } from '@/components/admin/orders/OrdersTable';
import OrderReceiptPrint from '@/components/admin/printing/OrderReceiptPrint';
import ShippingLabelPrint from '@/components/admin/printing/ShippingLabelPrint';

// Mock order for demonstration
const mockOrder = {
  id: "order-123",
  orderNumber: "TTS-20250409-1234",
  customer: {
    id: "cust-123",
    name: "Jane Smith",
    email: "jane@example.com"
  },
  items: [
    {
      productId: "prod-001",
      product: {
        id: "prod-001",
        name: "Vintage Denim Jacket", // Changed from title to name
        price: 2500,
        imageUrl: "/placeholder.svg"
      },
      quantity: 1,
      price: 2500
    },
    {
      productId: "prod-002",
      product: {
        id: "prod-002",
        name: "Floral Summer Dress", // Changed from title to name
        price: 1800,
        imageUrl: "/placeholder.svg"
      },
      quantity: 1,
      price: 1800
    }
  ],
  totalAmount: 4500,
  status: "processing" as const,
  paymentInfo: {
    method: "mpesa" as const,
    status: "completed" as const,
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
    shippingMethod: "express" as const
  },
  deliveryInfo: {
    estimatedDelivery: new Date(Date.now() + 86400000), // Tomorrow
    trackingId: "TRK12345"
  },
  orderDate: new Date(),
  history: [
    {
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      status: "pending" as const,
      note: "Order placed"
    },
    {
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      status: "processing" as const,
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
