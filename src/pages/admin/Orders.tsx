
import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { OrdersTable } from '@/components/admin/orders/OrdersTable';
import { OrderDetail } from '@/components/admin/orders/OrderDetail';
import OrderReceiptPrint from '@/components/admin/printing/OrderReceiptPrint';
import ShippingLabelPrint from '@/components/admin/printing/ShippingLabelPrint';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

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
        title: "Vintage Denim Jacket",
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
        title: "Floral Summer Dress",
        price: 1800,
        imageUrl: "/placeholder.svg"
      },
      quantity: 1,
      price: 1800
    }
  ],
  totalAmount: 4300,
  status: "processing" as const,
  paymentInfo: {
    method: "mpesa" as const,
    status: "completed" as const,
    transactionId: "MPESA123456",
    amount: 4300
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
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  // In a real app, you would fetch the order details here based on selectedOrderId
  const selectedOrder = selectedOrderId ? mockOrder : null;
  
  const handleRowClick = (orderId: string) => {
    setSelectedOrderId(orderId);
  };
  
  return (
    <AdminLayout>
      {selectedOrder ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setSelectedOrderId(null)}
              className="flex items-center"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
            <div className="flex gap-2">
              <OrderReceiptPrint order={selectedOrder} />
              <ShippingLabelPrint order={selectedOrder} />
            </div>
          </div>
          
          <OrderDetail order={selectedOrder} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Orders</h1>
              <p className="text-muted-foreground">Manage customer orders</p>
            </div>
          </div>
          
          <OrdersTable onRowClick={handleRowClick} />
        </div>
      )}
    </AdminLayout>
  );
};

export default Orders;
