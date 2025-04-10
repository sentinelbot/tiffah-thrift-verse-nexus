
import React, { useState } from 'react';
import StaffLayout from '@/components/layout/StaffLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PrintDialog } from '@/components/admin/printing/PrintDialog';
import { Order } from '@/types';
import { BarcodeScanner } from '@/components/barcode/BarcodeScanner';
import { OrderScanner } from '@/components/barcode/OrderScanner';

// Mock data for orders
const mockOrders: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 'TTS-20250408-0001',
    totalAmount: 4500,
    status: 'pending',
    paymentMethod: 'mpesa',
    paymentStatus: 'completed',
    createdAt: new Date(2025, 3, 8, 10, 30),
    orderDate: new Date(2025, 3, 8, 10, 30),
    customer: {
      id: 'cust-001',
      name: 'Jane Smith',
      email: 'jane@example.com'
    },
    items: [
      {
        id: 'item-001',
        orderId: 'ord-001',
        productId: 'prod-001',
        quantity: 1,
        price: 2500,
        product: {
          id: 'prod-001',
          name: 'Vintage Denim Jacket',
          price: 2500,
          category: 'Jackets',
          condition: 'good',
          barcode: 'PROD001',
          status: 'available',
          imageUrl: '/placeholder.svg'
        }
      },
      {
        id: 'item-002',
        orderId: 'ord-001',
        productId: 'prod-002',
        quantity: 1,
        price: 2000,
        product: {
          id: 'prod-002',
          name: 'Leather Boots',
          price: 2000,
          category: 'Footwear',
          condition: 'likeNew',
          barcode: 'PROD002',
          status: 'available',
          imageUrl: '/placeholder.svg'
        }
      }
    ],
    shippingInfo: {
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+254712345678',
      address: '123 Main St',
      city: 'Nairobi',
      state: 'Nairobi',
      postalCode: '00100',
      country: 'Kenya',
      shippingMethod: 'standard'
    }
  },
  {
    id: 'ord-002',
    orderNumber: 'TTS-20250407-0002',
    totalAmount: 3000,
    status: 'processing',
    paymentMethod: 'card',
    paymentStatus: 'completed',
    createdAt: new Date(2025, 3, 7, 15, 45),
    orderDate: new Date(2025, 3, 7, 15, 45),
    customer: {
      id: 'cust-002',
      name: 'John Doe',
      email: 'john@example.com'
    },
    items: [
      {
        id: 'item-003',
        orderId: 'ord-002',
        productId: 'prod-003',
        quantity: 1,
        price: 1800,
        product: {
          id: 'prod-003',
          name: 'Silk Blouse',
          price: 1800,
          category: 'Tops',
          condition: 'likeNew',
          barcode: 'PROD003',
          status: 'available',
          imageUrl: '/placeholder.svg'
        }
      },
      {
        id: 'item-004',
        orderId: 'ord-002',
        productId: 'prod-004',
        quantity: 1,
        price: 1200,
        product: {
          id: 'prod-004',
          name: 'Cotton Scarf',
          price: 1200,
          category: 'Accessories',
          condition: 'new',
          barcode: 'PROD004',
          status: 'available',
          imageUrl: '/placeholder.svg'
        }
      }
    ],
    shippingInfo: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+254723456789',
      address: '456 Oak St',
      city: 'Nairobi',
      state: 'Nairobi',
      postalCode: '00200',
      country: 'Kenya',
      shippingMethod: 'express'
    }
  },
  {
    id: 'ord-003',
    orderNumber: 'TTS-20250406-0003',
    totalAmount: 5500,
    status: 'ready',
    paymentMethod: 'mpesa',
    paymentStatus: 'completed',
    createdAt: new Date(2025, 3, 6, 9, 15),
    orderDate: new Date(2025, 3, 6, 9, 15),
    customer: {
      id: 'cust-003',
      name: 'Mary Johnson',
      email: 'mary@example.com'
    },
    items: [
      {
        id: 'item-005',
        orderId: 'ord-003',
        productId: 'prod-005',
        quantity: 1,
        price: 3500,
        product: {
          id: 'prod-005',
          name: 'Designer Handbag',
          price: 3500,
          category: 'Bags',
          condition: 'good',
          barcode: 'PROD005',
          status: 'available',
          imageUrl: '/placeholder.svg'
        }
      },
      {
        id: 'item-006',
        orderId: 'ord-003',
        productId: 'prod-006',
        quantity: 1,
        price: 2000,
        product: {
          id: 'prod-006',
          name: 'Linen Pants',
          price: 2000,
          category: 'Bottoms',
          condition: 'likeNew',
          barcode: 'PROD006',
          status: 'available',
          imageUrl: '/placeholder.svg'
        }
      }
    ],
    shippingInfo: {
      fullName: 'Mary Johnson',
      email: 'mary@example.com',
      phone: '+254734567890',
      address: '789 Pine St',
      city: 'Nairobi',
      state: 'Nairobi',
      postalCode: '00300',
      country: 'Kenya',
      shippingMethod: 'standard'
    }
  }
];

const OrderPreparer = () => {
  const [selectedTab, setSelectedTab] = useState('pending');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [orderBarcodes, setOrderBarcodes] = useState<string[]>([]);
  const [scannedBarcodes, setScannedBarcodes] = useState<string[]>([]);
  const [scanningMode, setScanningMode] = useState<'off' | 'barcode' | 'order'>('off');
  
  const handleScan = (barcode: string) => {
    // Handle barcode scan
    console.log('Scanned barcode:', barcode);
    setScannedBarcodes(prev => [...prev, barcode]);
    
    // TODO: Implement actual barcode processing logic
    const matchedOrder = mockOrders.find(order => order.orderNumber === barcode);
    if (matchedOrder) {
      setSelectedOrder(matchedOrder);
      toast.success(`Order ${matchedOrder.orderNumber} found!`);
    } else {
      // Check if it's a product barcode
      const matchedProduct = mockOrders
        .flatMap(order => order.items || [])
        .find(item => item.product?.barcode === barcode);
      
      if (matchedProduct) {
        toast.success(`Product ${matchedProduct.product?.name} scanned!`);
      } else {
        toast.error('Unknown barcode');
      }
    }
  };
  
  // Filter orders based on selected tab
  const filteredOrders = mockOrders.filter(order => {
    if (selectedTab === 'pending') return order.status === 'pending';
    if (selectedTab === 'processing') return order.status === 'processing';
    if (selectedTab === 'ready') return order.status === 'ready';
    return true;
  });
  
  return (
    <StaffLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Order Preparation</h1>
            <p className="text-muted-foreground">
              Prepare and pack customer orders for delivery
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={scanningMode === 'barcode' ? 'default' : 'outline'} 
              onClick={() => setScanningMode(scanningMode === 'barcode' ? 'off' : 'barcode')}
            >
              {scanningMode === 'barcode' ? 'Scanning Active' : 'Scan Products'}
            </Button>
            
            <Button 
              variant={scanningMode === 'order' ? 'default' : 'outline'} 
              onClick={() => setScanningMode(scanningMode === 'order' ? 'off' : 'order')}
            >
              {scanningMode === 'order' ? 'Scanning Active' : 'Scan Order'}
            </Button>
          </div>
        </div>
        
        {/* Scanner */}
        {scanningMode === 'barcode' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Product Scanner</CardTitle>
              <CardDescription>
                Scan product barcodes to verify items for an order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <BarcodeScanner onScan={handleScan} />
                <p className="text-muted-foreground text-sm mt-2">
                  Position the barcode in front of the camera
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {scanningMode === 'order' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Order Scanner</CardTitle>
              <CardDescription>
                Scan order barcode to quickly find an order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <OrderScanner />
                <p className="text-muted-foreground text-sm mt-2">
                  Position the order barcode in front of the camera
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Orders List */}
        <Tabs defaultValue="pending" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="ready">Ready for Delivery</TabsTrigger>
            <TabsTrigger value="all">All Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4">
            <OrdersList 
              orders={filteredOrders} 
              onSelectOrder={setSelectedOrder}
              onPrintClick={() => setIsPrintDialogOpen(true)}
            />
          </TabsContent>
          
          <TabsContent value="processing" className="space-y-4">
            <OrdersList 
              orders={filteredOrders} 
              onSelectOrder={setSelectedOrder}
              onPrintClick={() => setIsPrintDialogOpen(true)}
            />
          </TabsContent>
          
          <TabsContent value="ready" className="space-y-4">
            <OrdersList 
              orders={filteredOrders} 
              onSelectOrder={setSelectedOrder}
              onPrintClick={() => setIsPrintDialogOpen(true)}
            />
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            <OrdersList 
              orders={filteredOrders} 
              onSelectOrder={setSelectedOrder}
              onPrintClick={() => setIsPrintDialogOpen(true)}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Print Dialog */}
      {selectedOrder && (
        <PrintDialog
          title="Print Order Receipt"
          description={`Print receipt for order ${selectedOrder.orderNumber}`}
          previewContent={
            <div className="p-4 border rounded-md">
              <h3 className="text-lg font-bold mb-2">Order Receipt</h3>
              <p>Order #: {selectedOrder.orderNumber}</p>
              <p>Customer: {selectedOrder.customer?.name}</p>
              <p>Date: {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
              <hr className="my-2" />
              {selectedOrder.items?.map(item => (
                <div key={item.id} className="flex justify-between py-1">
                  <span>{item.quantity}x {item.product?.name}</span>
                  <span>KSh {item.price.toLocaleString()}</span>
                </div>
              ))}
              <hr className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>KSh {selectedOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          }
          onPrint={() => {
            console.log('Printing order:', selectedOrder.orderNumber);
            // TODO: Implement actual printing logic
            toast.success(`Order ${selectedOrder.orderNumber} receipt printed!`);
            setIsPrintDialogOpen(false);
          }}
          onDownload={() => {
            console.log('Downloading receipt for order:', selectedOrder.orderNumber);
            // TODO: Implement actual download logic
            toast.success(`Order ${selectedOrder.orderNumber} receipt downloaded!`);
            setIsPrintDialogOpen(false);
          }}
        >
          <div>
            {/* Additional print options could go here */}
          </div>
        </PrintDialog>
      )}
    </StaffLayout>
  );
};

interface OrdersListProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onPrintClick: () => void;
}

const OrdersList: React.FC<OrdersListProps> = ({ orders, onSelectOrder, onPrintClick }) => {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-2">No orders found</p>
          <Button variant="outline">Refresh</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      {orders.map(order => (
        <Card key={order.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between">
              <span>Order #{order.orderNumber}</span>
              <span className="text-primary">KSh {order.totalAmount.toLocaleString()}</span>
            </CardTitle>
            <CardDescription>
              {new Date(order.orderDate).toLocaleDateString()} - {order.customer?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm mb-1">Order Items</h4>
                <ul className="space-y-1 text-sm">
                  {order.items?.map(item => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.quantity}x {item.product?.name}</span>
                      <span>KSh {item.price.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Shipping Address</h4>
                <p className="text-sm text-muted-foreground">
                  {order.shippingInfo?.fullName}<br />
                  {order.shippingInfo?.address}<br />
                  {order.shippingInfo?.city}, {order.shippingInfo?.postalCode}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <div className="flex items-center">
              <Badge variant={
                order.status === 'pending' ? 'default' :
                order.status === 'processing' ? 'secondary' :
                order.status === 'ready' ? 'success' :
                'outline'
              }>
                {order.status}
              </Badge>
              <Badge variant="outline" className="ml-2">
                {order.paymentMethod === 'mpesa' ? 'M-Pesa' :
                 order.paymentMethod === 'card' ? 'Card' :
                 order.paymentMethod === 'cash' ? 'Cash' : 'Other'}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onSelectOrder(order)}>
                View Details
              </Button>
              <Button size="sm" onClick={() => {
                onSelectOrder(order);
                onPrintClick();
              }}>
                Print Receipt
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

export default OrderPreparer;

// Import toast for notifications
import { toast } from 'sonner';

// Define a Badge component as it seems to be used but not imported
const Badge = ({ children, variant }: { children: React.ReactNode, variant?: string }) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'default':
        return 'bg-primary text-primary-foreground';
      case 'secondary':
        return 'bg-secondary text-secondary-foreground';
      case 'outline':
        return 'border border-input bg-background text-foreground';
      case 'success':
        return 'bg-green-500 text-white';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getVariantClass()}`}>
      {children}
    </span>
  );
};
