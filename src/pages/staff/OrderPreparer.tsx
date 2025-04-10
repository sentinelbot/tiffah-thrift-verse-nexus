
import React, { useState } from 'react';
import StaffLayout from '@/components/layout/StaffLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Search,
  PackageCheck,
  ClipboardList,
  ShoppingBag,
  Check,
  Printer,
  Clock,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  ClipboardCheck,
  Truck,
  BoxSelect,
} from 'lucide-react';

const OrderPreparer = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDetail, setShowOrderDetail] = useState<boolean>(false);
  
  // Mock order data
  const orders = [
    {
      id: 'ORD-20250410-1584',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '+254712345678',
      },
      items: [
        {
          id: 'ITEM-001',
          productId: 'PRD-001',
          name: 'Vintage Denim Jacket',
          price: 2500,
          quantity: 1,
          location: 'Rack B-15',
          image: '/placeholder.svg',
        },
        {
          id: 'ITEM-002',
          productId: 'PRD-002',
          name: 'Leather Crossbody Bag',
          price: 3200,
          quantity: 1,
          location: 'Shelf C-22',
          image: '/placeholder.svg',
        },
        {
          id: 'ITEM-003',
          productId: 'PRD-003',
          name: 'Classic White Sneakers',
          price: 2200,
          quantity: 1,
          location: 'Box S-45',
          image: '/placeholder.svg',
        },
      ],
      status: 'pending',
      totalAmount: 7900,
      orderDate: '2025-04-10 08:32:15',
      specialInstructions: 'Please wrap separately as a gift.',
    },
    {
      id: 'ORD-20250410-1583',
      customer: {
        name: 'Michael Kimani',
        email: 'michael.k@example.com',
        phone: '+254723456789',
      },
      items: [
        {
          id: 'ITEM-004',
          productId: 'PRD-004',
          name: 'Floral Summer Dress',
          price: 1800,
          quantity: 1,
          location: 'Rack D-08',
          image: '/placeholder.svg',
        },
      ],
      status: 'processing',
      totalAmount: 1800,
      orderDate: '2025-04-10 09:45:22',
      specialInstructions: '',
    },
    {
      id: 'ORD-20250410-1582',
      customer: {
        name: 'Amina Wanjiku',
        email: 'amina.w@example.com',
        phone: '+254734567890',
      },
      items: [
        {
          id: 'ITEM-005',
          productId: 'PRD-005',
          name: 'Wool Winter Coat',
          price: 4500,
          quantity: 1,
          location: 'Rack A-03',
          image: '/placeholder.svg',
        },
        {
          id: 'ITEM-006',
          productId: 'PRD-006',
          name: 'Vintage Graphic T-Shirt',
          price: 1200,
          quantity: 2,
          location: 'Shelf T-17',
          image: '/placeholder.svg',
        },
      ],
      status: 'ready',
      totalAmount: 6900,
      orderDate: '2025-04-10 10:12:45',
      specialInstructions: 'Include receipt in package.',
    },
    {
      id: 'ORD-20250410-1581',
      customer: {
        name: 'David Omondi',
        email: 'david.o@example.com',
        phone: '+254745678901',
      },
      items: [
        {
          id: 'ITEM-007',
          productId: 'PRD-007',
          name: 'High-Waisted Jeans',
          price: 1900,
          quantity: 1,
          location: 'Rack B-22',
          image: '/placeholder.svg',
        },
        {
          id: 'ITEM-008',
          productId: 'PRD-008',
          name: 'Cashmere Sweater',
          price: 3800,
          quantity: 1,
          location: 'Shelf C-09',
          image: '/placeholder.svg',
        },
      ],
      status: 'outForDelivery',
      totalAmount: 5700,
      orderDate: '2025-04-09 16:50:33',
      specialInstructions: '',
    },
    {
      id: 'ORD-20250410-1580',
      customer: {
        name: 'Lucy Mwangi',
        email: 'lucy.m@example.com',
        phone: '+254756789012',
      },
      items: [
        {
          id: 'ITEM-009',
          productId: 'PRD-009',
          name: 'Silk Blouse',
          price: 2200,
          quantity: 1,
          location: 'Rack D-14',
          image: '/placeholder.svg',
        },
        {
          id: 'ITEM-010',
          productId: 'PRD-010',
          name: 'Leather Belt',
          price: 850,
          quantity: 1,
          location: 'Drawer A-05',
          image: '/placeholder.svg',
        },
      ],
      status: 'delivered',
      totalAmount: 3050,
      orderDate: '2025-04-09 11:23:17',
      specialInstructions: '',
    },
  ];
  
  // Filter orders based on search query
  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Processing</Badge>;
      case 'ready':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Ready</Badge>;
      case 'outForDelivery':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">Out for Delivery</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">Delivered</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Handle order item check
  const [checkedItems, setCheckedItems] = useState<{[key: string]: boolean}>({});
  
  const handleItemCheck = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };
  
  // Check if all items are checked
  const areAllItemsChecked = (items: any[]) => {
    return items.every(item => checkedItems[item.id]);
  };
  
  // Handle order status update
  const updateOrderStatus = (orderId: string, newStatus: string) => {
    // In a real app, this would update the database
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
    setShowOrderDetail(false);
  };
  
  // Handle print functions
  const printPickingList = (orderId: string) => {
    toast.success(`Printing picking list for order ${orderId}`);
  };
  
  const printPackingSlip = (orderId: string) => {
    toast.success(`Printing packing slip for order ${orderId}`);
  };
  
  const printShippingLabel = (orderId: string) => {
    toast.success(`Printing shipping label for order ${orderId}`);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <StaffLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold">Order Preparation</h1>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  className="pl-8 w-full md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="pending" className="mb-6">
            <TabsList>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="ready">Ready</TabsTrigger>
              <TabsTrigger value="outForDelivery">Out for Delivery</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="all">All Orders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Pending Orders</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <ArrowUpDown className="h-3.5 w-3.5 mr-1" />
                        Sort
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => printPickingList('batch')}>
                        <Printer className="h-3.5 w-3.5 mr-1" />
                        Print Batch
                      </Button>
                    </div>
                  </div>
                  <CardDescription>Orders that need to be processed</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.filter(order => order.status === 'pending').length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center h-24">
                              <div className="flex flex-col items-center justify-center">
                                <CheckCircle2 className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-muted-foreground mb-2">No pending orders</p>
                                <p className="text-sm text-muted-foreground">All orders have been processed</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredOrders
                            .filter(order => order.status === 'pending')
                            .map((order) => (
                              <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{order.customer.name}</span>
                                    <span className="text-xs text-muted-foreground">{order.customer.phone}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1 text-sm">
                                    <Clock className="h-3 w-3" />
                                    <span>{formatDate(order.orderDate)}</span>
                                  </div>
                                </TableCell>
                                <TableCell>{order.items.length}</TableCell>
                                <TableCell>KSh {order.totalAmount.toLocaleString()}</TableCell>
                                <TableCell>{getStatusBadge(order.status)}</TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setShowOrderDetail(true);
                                      // Reset checked items
                                      setCheckedItems({});
                                    }}
                                  >
                                    <ClipboardList className="h-3.5 w-3.5 mr-1" />
                                    Process
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="processing">
              <Card>
                <CardHeader>
                  <CardTitle>Processing Orders</CardTitle>
                  <CardDescription>Orders currently being prepared</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Similar table but filtered to processing orders */}
                  <p className="text-center py-8 text-muted-foreground">Processing orders will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ready">
              <Card>
                <CardHeader>
                  <CardTitle>Ready Orders</CardTitle>
                  <CardDescription>Orders ready for pickup or delivery</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Similar table but filtered to ready orders */}
                  <p className="text-center py-8 text-muted-foreground">Ready orders will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="outForDelivery">
              <Card>
                <CardHeader>
                  <CardTitle>Out for Delivery</CardTitle>
                  <CardDescription>Orders currently out for delivery</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Similar table but filtered to outForDelivery orders */}
                  <p className="text-center py-8 text-muted-foreground">Out for delivery orders will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="delivered">
              <Card>
                <CardHeader>
                  <CardTitle>Delivered Orders</CardTitle>
                  <CardDescription>Orders that have been delivered</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Similar table but filtered to delivered orders */}
                  <p className="text-center py-8 text-muted-foreground">Delivered orders will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>All Orders</CardTitle>
                  <CardDescription>View all orders regardless of status</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Similar table but with all orders */}
                  <p className="text-center py-8 text-muted-foreground">All orders will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Order Detail Dialog */}
          <Dialog open={showOrderDetail} onOpenChange={setShowOrderDetail}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Order Details: {selectedOrder?.id}</DialogTitle>
                <DialogDescription>
                  Process items for this order
                </DialogDescription>
              </DialogHeader>
              
              {selectedOrder && (
                <div className="py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Customer Information</h3>
                      <div className="bg-muted/30 p-3 rounded-md">
                        <p className="font-medium">{selectedOrder.customer.name}</p>
                        <p className="text-sm">{selectedOrder.customer.email}</p>
                        <p className="text-sm">{selectedOrder.customer.phone}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Order Summary</h3>
                      <div className="bg-muted/30 p-3 rounded-md">
                        <div className="flex justify-between mb-1">
                          <p className="text-sm">Order Date:</p>
                          <p className="text-sm">{formatDate(selectedOrder.orderDate)}</p>
                        </div>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm">Total Items:</p>
                          <p className="text-sm">{selectedOrder.items.length}</p>
                        </div>
                        <div className="flex justify-between mb-1">
                          <p className="text-sm">Total Amount:</p>
                          <p className="text-sm font-medium">KSh {selectedOrder.totalAmount.toLocaleString()}</p>
                        </div>
                        <div className="flex justify-between">
                          <p className="text-sm">Status:</p>
                          <div>{getStatusBadge(selectedOrder.status)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedOrder.specialInstructions && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-2">Special Instructions</h3>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 p-3 rounded-md">
                        <p className="text-sm">{selectedOrder.specialInstructions}</p>
                      </div>
                    </div>
                  )}
                  
                  <h3 className="text-sm font-medium mb-2">Order Items</h3>
                  <div className="border rounded-md">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <React.Fragment key={item.id}>
                        <div className="p-3">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={checkedItems[item.id] || false}
                              onCheckedChange={() => handleItemCheck(item.id)}
                              id={`item-${item.id}`}
                            />
                            <div className="h-16 w-16 bg-muted rounded-md flex-shrink-0"></div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <div>
                                  <label
                                    htmlFor={`item-${item.id}`}
                                    className="font-medium cursor-pointer"
                                  >
                                    {item.name}
                                  </label>
                                  <p className="text-xs text-muted-foreground">
                                    Product ID: {item.productId}
                                  </p>
                                </div>
                                <p className="font-medium">
                                  KSh {item.price.toLocaleString()}
                                </p>
                              </div>
                              
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="bg-muted/70">
                                    Qty: {item.quantity}
                                  </Badge>
                                  <Badge variant="outline" className="bg-primary/10">
                                    {item.location}
                                  </Badge>
                                </div>
                                
                                <Button variant="ghost" size="sm">
                                  <Check className="h-3 w-3 mr-1" />
                                  Verify
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {index < selectedOrder.items.length - 1 && <Separator />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
              
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <div className="flex gap-2 flex-1 flex-col sm:flex-row">
                  <Button variant="outline" onClick={() => printPickingList(selectedOrder?.id)}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Print Picking List
                  </Button>
                  <Button variant="outline" onClick={() => printPackingSlip(selectedOrder?.id)}>
                    <ClipboardCheck className="h-4 w-4 mr-2" />
                    Print Packing Slip
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  {selectedOrder?.status === 'pending' && (
                    <Button 
                      onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                      disabled={!areAllItemsChecked(selectedOrder.items)}
                    >
                      <BoxSelect className="h-4 w-4 mr-2" />
                      Start Processing
                    </Button>
                  )}
                  
                  {selectedOrder?.status === 'processing' && (
                    <Button 
                      onClick={() => updateOrderStatus(selectedOrder.id, 'ready')}
                      disabled={!areAllItemsChecked(selectedOrder.items)}
                    >
                      <PackageCheck className="h-4 w-4 mr-2" />
                      Mark as Ready
                    </Button>
                  )}
                  
                  {selectedOrder?.status === 'ready' && (
                    <>
                      <Button 
                        variant="outline"
                        onClick={() => printShippingLabel(selectedOrder.id)}
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        Print Shipping Label
                      </Button>
                      <Button 
                        onClick={() => updateOrderStatus(selectedOrder.id, 'outForDelivery')}
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Start Delivery
                      </Button>
                    </>
                  )}
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </StaffLayout>
  );
};

export default OrderPreparer;
