
import React, { useState } from 'react';
import StaffLayout from '@/components/layout/StaffLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PrinterIcon, CheckCircle, Truck, AlertCircle, Calendar, Package, Search, Clock, BarChart, ArrowRight, ShoppingBag, PackageCheck, ClipboardList, FileCheck2 } from 'lucide-react';
import { Order, OrderItem, Customer } from '@/types';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import OrderScanner from '@/components/barcode/OrderScanner';
import PrintDialog from '@/components/admin/printing/PrintDialog';
import OrderReceiptPrint from '@/components/admin/printing/OrderReceiptPrint';

// Mock data
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'TTS-20250410-0001',
    customer: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+254712345678'
    },
    items: [
      {
        id: '1',
        orderId: '1',
        productId: 'prod1',
        quantity: 2,
        price: 25.99,
        product: {
          id: 'prod1',
          name: 'Vintage Denim Jacket',
          title: 'Vintage Denim Jacket',
          price: 25.99,
          category: 'Jackets',
          condition: 'good',
          barcode: 'PROD-001',
          status: 'sold',
          imageUrl: '/placeholder.svg'
        }
      },
      {
        id: '2',
        orderId: '1',
        productId: 'prod2',
        quantity: 1,
        price: 14.99,
        product: {
          id: 'prod2',
          name: 'Floral Summer Dress',
          title: 'Floral Summer Dress',
          price: 14.99,
          category: 'Dresses',
          condition: 'likeNew',
          barcode: 'PROD-002',
          status: 'sold',
          imageUrl: '/placeholder.svg'
        }
      }
    ],
    totalAmount: 66.97,
    status: 'processing',
    paymentMethod: 'mpesa',
    paymentStatus: 'completed',
    orderDate: new Date('2025-04-10T09:30:00Z'),
    createdAt: new Date('2025-04-10T09:30:00Z'),
    paymentTransactionId: 'MPE123456789',
    notes: 'Customer requested gift wrapping',
    shippingInfo: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+254712345678',
      address: '123 Nairobi Street',
      city: 'Nairobi',
      state: 'Nairobi',
      postalCode: '00100',
      country: 'Kenya',
      shippingMethod: 'standard'
    },
    paymentInfo: {
      method: 'mpesa',
      status: 'completed',
      transactionId: 'MPE123456789',
      amount: 66.97
    },
    deliveryInfo: {
      estimatedDelivery: new Date('2025-04-12T12:00:00Z'),
      method: 'standard'
    },
    history: [
      {
        timestamp: new Date('2025-04-10T09:30:00Z'),
        status: 'pending',
        note: 'Order created'
      },
      {
        timestamp: new Date('2025-04-10T09:35:00Z'),
        status: 'processing',
        note: 'Payment received'
      }
    ]
  },
  {
    id: '2',
    orderNumber: 'TTS-20250410-0002',
    customer: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+254723456789'
    },
    items: [
      {
        id: '3',
        orderId: '2',
        productId: 'prod3',
        quantity: 1,
        price: 45.00,
        product: {
          id: 'prod3',
          name: 'Leather Handbag',
          title: 'Leather Handbag',
          price: 45.00,
          category: 'Accessories',
          condition: 'likeNew',
          barcode: 'PROD-003',
          status: 'sold',
          imageUrl: '/placeholder.svg'
        }
      }
    ],
    totalAmount: 45.00,
    status: 'ready',
    paymentMethod: 'card',
    paymentStatus: 'completed',
    orderDate: new Date('2025-04-10T10:15:00Z'),
    createdAt: new Date('2025-04-10T10:15:00Z'),
    paymentTransactionId: 'CARD987654321',
    notes: '',
    shippingInfo: {
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+254723456789',
      address: '456 Mombasa Road',
      city: 'Nairobi',
      state: 'Nairobi',
      postalCode: '00200',
      country: 'Kenya',
      shippingMethod: 'express'
    },
    paymentInfo: {
      method: 'card',
      status: 'completed',
      transactionId: 'CARD987654321',
      amount: 45.00
    },
    deliveryInfo: {
      estimatedDelivery: new Date('2025-04-11T12:00:00Z'),
      method: 'express'
    },
    history: [
      {
        timestamp: new Date('2025-04-10T10:15:00Z'),
        status: 'pending',
        note: 'Order created'
      },
      {
        timestamp: new Date('2025-04-10T10:20:00Z'),
        status: 'processing',
        note: 'Payment received'
      },
      {
        timestamp: new Date('2025-04-10T11:30:00Z'),
        status: 'ready',
        note: 'Order prepared and ready for pickup'
      }
    ]
  },
  {
    id: '3',
    orderNumber: 'TTS-20250410-0003',
    customer: {
      id: '3',
      name: 'Robert Johnson',
      email: 'robert@example.com',
      phone: '+254734567890'
    },
    items: [
      {
        id: '4',
        orderId: '3',
        productId: 'prod4',
        quantity: 3,
        price: 12.50,
        product: {
          id: 'prod4',
          name: 'Vintage T-Shirt',
          title: 'Vintage T-Shirt',
          price: 12.50,
          category: 'Tops',
          condition: 'good',
          barcode: 'PROD-004',
          status: 'sold',
          imageUrl: '/placeholder.svg'
        }
      },
      {
        id: '5',
        orderId: '3',
        productId: 'prod5',
        quantity: 1,
        price: 22.99,
        product: {
          id: 'prod5',
          name: 'Linen Shorts',
          title: 'Linen Shorts',
          price: 22.99,
          category: 'Bottoms',
          condition: 'good',
          barcode: 'PROD-005',
          status: 'sold',
          imageUrl: '/placeholder.svg'
        }
      }
    ],
    totalAmount: 60.49,
    status: 'pending',
    paymentMethod: 'mpesa',
    paymentStatus: 'pending',
    orderDate: new Date('2025-04-10T11:45:00Z'),
    createdAt: new Date('2025-04-10T11:45:00Z'),
    notes: 'First-time customer',
    shippingInfo: {
      fullName: 'Robert Johnson',
      email: 'robert@example.com',
      phone: '+254734567890',
      address: '789 Kisumu Avenue',
      city: 'Kisumu',
      state: 'Kisumu',
      postalCode: '40100',
      country: 'Kenya',
      shippingMethod: 'standard'
    },
    paymentInfo: {
      method: 'mpesa',
      status: 'pending',
      amount: 60.49
    },
    deliveryInfo: {
      estimatedDelivery: new Date('2025-04-14T12:00:00Z'),
      method: 'standard'
    },
    history: [
      {
        timestamp: new Date('2025-04-10T11:45:00Z'),
        status: 'pending',
        note: 'Order created, awaiting payment'
      }
    ]
  }
];

const OrderPreparer = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState('processing');
  const [searchQuery, setSearchQuery] = useState('');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filter orders based on the active tab and search query
  const filteredOrders = orders.filter(order => {
    // Filter by status
    const statusMatch = 
      activeTab === 'all' || 
      (activeTab === 'processing' && order.status === 'processing') ||
      (activeTab === 'ready' && order.status === 'ready') ||
      (activeTab === 'completed' && (order.status === 'outForDelivery' || order.status === 'delivered'));
    
    // Filter by search query
    const searchMatch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer?.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  // Handle order status update
  const updateOrderStatus = (orderId: string, status: string) => {
    setIsLoading(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status, 
              history: [...(order.history || []), { 
                timestamp: new Date(),
                status: status as any,
                note: `Status updated to ${status}`
              }]
            } 
          : order
      );
      
      setOrders(updatedOrders);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status,
          history: [...(selectedOrder.history || []), { 
            timestamp: new Date(),
            status: status as any,
            note: `Status updated to ${status}`
          }]
        });
      }
      
      setIsLoading(false);
      toast.success(`Order ${orderId} status updated to ${status}`);
    }, 500);
  };

  // Handle barcode scan result
  const handleScanResult = (barcode: string) => {
    setScannerOpen(false);
    
    const orderNumber = barcode.trim();
    const foundOrder = orders.find(order => order.orderNumber === orderNumber);
    
    if (foundOrder) {
      setSelectedOrder(foundOrder);
      toast.success(`Order ${orderNumber} found!`);
    } else {
      toast.error(`Order ${orderNumber} not found`);
    }
  };

  // Get status badge based on order status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-gray-500/20 text-gray-500">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-500">Processing</Badge>;
      case 'ready':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500">Ready</Badge>;
      case 'outForDelivery':
        return <Badge variant="outline" className="bg-purple-500/20 text-purple-500">Out for Delivery</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-500/20 text-red-500">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <StaffLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Order Preparation</h1>
            <p className="text-muted-foreground">
              Process and prepare orders for delivery
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={() => setScannerOpen(true)} variant="outline">
              <Package className="mr-2 h-4 w-4" />
              Scan Order
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="stats bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-50 shadow-sm rounded-lg">
            <div className="flex space-x-8 p-4">
              <div className="flex flex-col items-center">
                <div className="text-muted-foreground text-sm">Processing</div>
                <div className="text-2xl font-bold">{orders.filter(o => o.status === 'processing').length}</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-muted-foreground text-sm">Ready</div>
                <div className="text-2xl font-bold">{orders.filter(o => o.status === 'ready').length}</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-muted-foreground text-sm">Today's Total</div>
                <div className="text-2xl font-bold">{orders.length}</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search orders..." 
              className="w-[250px] pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="ready">Ready</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4 mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No orders found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.orderNumber}</TableCell>
                          <TableCell>
                            <div className="font-medium">{order.customer?.name}</div>
                            <div className="text-xs text-muted-foreground">{order.customer?.email}</div>
                          </TableCell>
                          <TableCell>
                            <div>{new Date(order.orderDate).toLocaleDateString()}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(order.orderDate).toLocaleTimeString()}
                            </div>
                          </TableCell>
                          <TableCell>{order.items?.length || 0}</TableCell>
                          <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSelectedOrder(order)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Order Detail Dialog */}
      {selectedOrder && (
        <Dialog open={Boolean(selectedOrder)} onOpenChange={open => !open && setSelectedOrder(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Order {selectedOrder.orderNumber}</span>
                {getStatusBadge(selectedOrder.status)}
              </DialogTitle>
              <DialogDescription>
                Placed on {new Date(selectedOrder.orderDate).toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Customer and Order Info */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Customer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="font-medium">{selectedOrder.customer?.name}</div>
                      <div className="text-sm text-muted-foreground">{selectedOrder.customer?.email}</div>
                      <div className="text-sm text-muted-foreground">{selectedOrder.customer?.phone}</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1 text-sm">
                      <div>{selectedOrder.shippingInfo?.fullName}</div>
                      <div>{selectedOrder.shippingInfo?.address}</div>
                      <div>{selectedOrder.shippingInfo?.city}, {selectedOrder.shippingInfo?.state} {selectedOrder.shippingInfo?.postalCode}</div>
                      <div>{selectedOrder.shippingInfo?.country}</div>
                      {selectedOrder.shippingInfo?.specialInstructions && (
                        <div className="text-orange-600 mt-2">
                          Note: {selectedOrder.shippingInfo.specialInstructions}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Order Items */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Barcode</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="flex items-center space-x-2">
                            <div 
                              className="h-10 w-10 rounded bg-gray-100 bg-cover bg-center"
                              style={{backgroundImage: `url(${item.product?.imageUrl || '/placeholder.svg'})`}}
                            />
                            <div>
                              <div className="font-medium">{item.product?.name}</div>
                              <div className="text-xs text-muted-foreground">{item.product?.category}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {item.product?.barcode}
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Subtotal
                        </TableCell>
                        <TableCell className="text-right">
                          ${selectedOrder.totalAmount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              {/* Order History */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Order Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.history?.map((entry, index) => (
                      <div key={index} className="flex">
                        <div className="mr-4 flex flex-col items-center">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                          {index < (selectedOrder.history?.length || 0) - 1 && (
                            <div className="h-12 w-0.5 bg-border"></div>
                          )}
                        </div>
                        <div className="space-y-1 pt-0.5">
                          <div className="text-sm font-medium">{entry.status}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(entry.timestamp).toLocaleString()}
                          </div>
                          {entry.note && (
                            <div className="text-xs">{entry.note}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <DialogFooter className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setPrintDialogOpen(true)}>
                  <PrinterIcon className="mr-2 h-4 w-4" />
                  Print Receipt
                </Button>
              </div>
              
              <div className="flex space-x-2">
                {selectedOrder.status === 'processing' && (
                  <Button 
                    onClick={() => updateOrderStatus(selectedOrder.id, 'ready')}
                    disabled={isLoading}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Ready
                  </Button>
                )}
                
                {selectedOrder.status === 'ready' && (
                  <Button 
                    onClick={() => updateOrderStatus(selectedOrder.id, 'outForDelivery')}
                    disabled={isLoading}
                  >
                    <Truck className="mr-2 h-4 w-4" />
                    Send to Delivery
                  </Button>
                )}
                
                {(selectedOrder.status === 'pending' || selectedOrder.status === 'processing') && (
                  <Button 
                    variant="destructive"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                    disabled={isLoading}
                  >
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Cancel Order
                  </Button>
                )}
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Barcode Scanner Dialog */}
      <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan Order Barcode</DialogTitle>
            <DialogDescription>
              Scan or enter the order barcode to quickly find the order
            </DialogDescription>
          </DialogHeader>
          
          <OrderScanner onScan={handleScanResult} />
          
          <DialogFooter className="sm:justify-start">
            <Button variant="secondary" onClick={() => setScannerOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Print Dialog */}
      <Dialog open={printDialogOpen} onOpenChange={setPrintDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Print Order Receipt</DialogTitle>
            <DialogDescription>
              Select a printer to print the order receipt
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <PrintDialog>
              <OrderReceiptPrint order={selectedOrder} />
            </PrintDialog>
          )}
          
          <DialogFooter className="sm:justify-start">
            <Button variant="secondary" onClick={() => setPrintDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </StaffLayout>
  );
};

export default OrderPreparer;
