
import React, { useState } from 'react';
import StaffLayout from '@/components/layout/StaffLayout';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ShoppingCart,
  Search,
  Clock,
  CheckCircle,
  Package as PackageIcon,
  Truck,
  Barcode,
  Printer,
  ClipboardList,
  ListChecks,
  PackageCheck,
  Calendar,
  ChevronDown,
  ChevronUp,
  FilterX,
  Timer,
  Loader2
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import OrderReceiptPrint from '@/components/admin/printing/OrderReceiptPrint';
import ShippingLabelPrint from '@/components/admin/printing/ShippingLabelPrint';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from 'date-fns';
import { calendars } from 'lucide-react';

// Mock data for orders
const mockOrders = [
  {
    id: 'order-001',
    orderNumber: 'TTS-20250409-1234',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+254712345678'
    },
    items: [
      { id: 'prod-001', name: 'Vintage Denim Jacket', price: 2500, quantity: 1 },
      { id: 'prod-002', name: 'Floral Summer Dress', price: 1800, quantity: 1 }
    ],
    totalAmount: 4300,
    status: 'pending',
    paymentMethod: 'mpesa',
    paymentStatus: 'completed',
    shippingMethod: 'standard',
    shippingAddress: {
      street: '123 Main St',
      city: 'Nairobi',
      postalCode: '00100'
    },
    orderDate: '2025-04-09T10:15:30',
    estimatedDelivery: '2025-04-11T14:00:00',
    priority: 'normal'
  },
  {
    id: 'order-002',
    orderNumber: 'TTS-20250409-1235',
    customer: {
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '+254723456789'
    },
    items: [
      { id: 'prod-003', name: 'Leather Crossbody Bag', price: 3200, quantity: 1 }
    ],
    totalAmount: 3200,
    status: 'processing',
    paymentMethod: 'card',
    paymentStatus: 'completed',
    shippingMethod: 'express',
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Nairobi',
      postalCode: '00200'
    },
    orderDate: '2025-04-09T11:30:45',
    estimatedDelivery: '2025-04-10T12:00:00',
    priority: 'high'
  },
  {
    id: 'order-003',
    orderNumber: 'TTS-20250408-1232',
    customer: {
      name: 'David Johnson',
      email: 'david@example.com',
      phone: '+254734567890'
    },
    items: [
      { id: 'prod-005', name: 'Wool Winter Coat', price: 4500, quantity: 1 },
      { id: 'prod-004', name: 'Classic White Sneakers', price: 2200, quantity: 1 }
    ],
    totalAmount: 6700,
    status: 'ready',
    paymentMethod: 'mpesa',
    paymentStatus: 'completed',
    shippingMethod: 'standard',
    shippingAddress: {
      street: '789 Pine Rd',
      city: 'Mombasa',
      postalCode: '80100'
    },
    orderDate: '2025-04-08T15:20:10',
    estimatedDelivery: '2025-04-12T14:00:00',
    priority: 'normal'
  },
  {
    id: 'order-004',
    orderNumber: 'TTS-20250408-1231',
    customer: {
      name: 'Grace Onyango',
      email: 'grace@example.com',
      phone: '+254745678901'
    },
    items: [
      { id: 'prod-002', name: 'Floral Summer Dress', price: 1800, quantity: 2 }
    ],
    totalAmount: 3600,
    status: 'outForDelivery',
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    shippingMethod: 'standard',
    shippingAddress: {
      street: '321 Cedar Ln',
      city: 'Kisumu',
      postalCode: '40100'
    },
    orderDate: '2025-04-08T09:45:20',
    estimatedDelivery: '2025-04-11T14:00:00',
    priority: 'normal'
  },
  {
    id: 'order-005',
    orderNumber: 'TTS-20250407-1230',
    customer: {
      name: 'Robert Mwangi',
      email: 'robert@example.com',
      phone: '+254756789012'
    },
    items: [
      { id: 'prod-001', name: 'Vintage Denim Jacket', price: 2500, quantity: 1 },
      { id: 'prod-003', name: 'Leather Crossbody Bag', price: 3200, quantity: 1 }
    ],
    totalAmount: 5700,
    status: 'delivered',
    paymentMethod: 'mpesa',
    paymentStatus: 'completed',
    shippingMethod: 'express',
    shippingAddress: {
      street: '654 Elm St',
      city: 'Nairobi',
      postalCode: '00100'
    },
    orderDate: '2025-04-07T14:10:05',
    estimatedDelivery: '2025-04-09T14:00:00',
    actualDelivery: '2025-04-09T13:25:40',
    priority: 'high'
  }
];

const OrderPreparer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  
  // Filter orders based on search query and status filter
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
    setActiveTab('order-detail');
  };
  
  const handleStatusChange = (orderId: string, newStatus: string) => {
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };
  
  const handleScanBarcode = () => {
    setIsScanning(true);
    
    // Simulate a barcode scan
    setTimeout(() => {
      setIsScanning(false);
      toast.success('Item scanned and verified successfully');
    }, 2000);
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">Processing</Badge>;
      case 'ready':
        return <Badge className="bg-green-500">Ready</Badge>;
      case 'outForDelivery':
        return <Badge className="bg-purple-500">Out for Delivery</Badge>;
      case 'delivered':
        return <Badge className="bg-gray-500">Delivered</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return <Badge className="bg-red-500">High</Badge>;
      case 'normal':
        return <Badge className="bg-blue-500">Normal</Badge>;
      case 'low':
        return <Badge className="bg-gray-500">Low</Badge>;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'PPp'); // e.g., "Apr 10, 2025, 10:15 AM"
  };
  
  return (
    <StaffLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Order Management</h1>
            <p className="text-muted-foreground">Process and prepare orders for delivery</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleScanBarcode} disabled={isScanning}>
              {isScanning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Barcode className="h-4 w-4 mr-2" />
                  Scan Barcode
                </>
              )}
            </Button>
            <Button>
              <ClipboardList className="h-4 w-4 mr-2" />
              Order Report
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="processing">
              <Clock className="h-4 w-4 mr-2" />
              Processing
            </TabsTrigger>
            <TabsTrigger value="ready">
              <CheckCircle className="h-4 w-4 mr-2" />
              Ready for Pickup
            </TabsTrigger>
            <TabsTrigger value="order-detail" disabled={!selectedOrder}>
              <ClipboardList className="h-4 w-4 mr-2" />
              Order Details
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <CardTitle>All Orders</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search orders..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">
                          {statusFilter ? `Filter: ${statusFilter}` : "Filter"}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-0" align="end">
                        <div className="p-2">
                          <div className="font-medium">Filter by Status</div>
                        </div>
                        <Separator />
                        <div className="p-2 space-y-1">
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => setStatusFilter('pending')}
                          >
                            Pending
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => setStatusFilter('processing')}
                          >
                            Processing
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => setStatusFilter('ready')}
                          >
                            Ready
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => setStatusFilter('outForDelivery')}
                          >
                            Out for Delivery
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => setStatusFilter('delivered')}
                          >
                            Delivered
                          </Button>
                          <Separator className="my-1" />
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => setStatusFilter(null)}
                          >
                            <FilterX className="mr-2 h-4 w-4" />
                            Clear Filter
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Priority</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id} className="cursor-pointer" onClick={() => handleOrderClick(order)}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.customer.name}</TableCell>
                        <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                        <TableCell>KSh {order.totalAmount}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {getPriorityBadge(order.priority)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <OrderReceiptPrint order={order} />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'processing')}>
                                  Mark as Processing
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'ready')}>
                                  Mark as Ready
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOrderClick(order)}>
                                  View Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="processing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Orders In Progress</CardTitle>
                <CardDescription>Process these orders to prepare for delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockOrders
                    .filter(order => order.status === 'processing')
                    .map(order => (
                      <Card key={order.id} className="overflow-hidden">
                        <CardHeader className="p-4 pb-2 bg-muted/50">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex gap-2 items-center">
                                <h3 className="font-medium">{order.orderNumber}</h3>
                                {getPriorityBadge(order.priority)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.orderDate).toLocaleDateString()} • 
                                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <OrderReceiptPrint order={order} />
                              <Button variant="secondary" size="sm" onClick={() => handleOrderClick(order)}>
                                View
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <div className="flex gap-2 items-center">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>{order.customer.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{order.customer.name}</span>
                              </div>
                              <span className="font-medium">KSh {order.totalAmount}</span>
                            </div>
                            <ScrollArea className="h-24 w-full rounded-md border p-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between py-1">
                                  <span>{item.quantity}x {item.name}</span>
                                  <span>KSh {item.price * item.quantity}</span>
                                </div>
                              ))}
                            </ScrollArea>
                            <div className="flex justify-end gap-2 mt-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleScanBarcode()}
                                disabled={isScanning}
                              >
                                {isScanning ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Barcode className="h-4 w-4 mr-2" />
                                )}
                                Scan Items
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => handleStatusChange(order.id, 'ready')}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as Ready
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  
                  {mockOrders.filter(order => order.status === 'processing').length === 0 && (
                    <div className="text-center py-10">
                      <PackageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No Orders In Progress</h3>
                      <p className="text-muted-foreground">
                        All orders have been processed or are awaiting processing.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ready" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ready for Pickup</CardTitle>
                <CardDescription>These orders are ready for delivery staff pickup</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockOrders
                    .filter(order => order.status === 'ready')
                    .map(order => (
                      <Card key={order.id} className="overflow-hidden">
                        <CardHeader className="p-4 pb-2 bg-primary/10">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex gap-2 items-center">
                                <h3 className="font-medium">{order.orderNumber}</h3>
                                {getStatusBadge(order.status)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.orderDate).toLocaleDateString()} • 
                                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <ShippingLabelPrint order={order} />
                              <Button variant="secondary" size="sm" onClick={() => handleOrderClick(order)}>
                                View
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <div className="flex gap-2 items-center">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>{order.customer.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{order.customer.name}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <Timer className="h-4 w-4 text-muted-foreground" />
                                <span>Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="border p-2 rounded-md">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">Delivery Address:</p>
                                  <p className="text-sm text-muted-foreground">
                                    {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                                  </p>
                                </div>
                                <Badge>{order.shippingMethod}</Badge>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => toast.success(`Notified delivery staff for order ${order.orderNumber}`)}
                              >
                                <Truck className="h-4 w-4 mr-2" />
                                Notify Delivery
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => handleStatusChange(order.id, 'outForDelivery')}
                              >
                                <PackageCheck className="h-4 w-4 mr-2" />
                                Mark as Picked Up
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  
                  {mockOrders.filter(order => order.status === 'ready').length === 0 && (
                    <div className="text-center py-10">
                      <CheckCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No Orders Ready for Pickup</h3>
                      <p className="text-muted-foreground">
                        All prepared orders have been picked up by delivery staff.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="order-detail" className="space-y-4">
            {selectedOrder && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Order {selectedOrder.orderNumber}
                        {getStatusBadge(selectedOrder.status)}
                      </CardTitle>
                      <CardDescription>
                        Placed on {formatDate(selectedOrder.orderDate)}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <OrderReceiptPrint order={selectedOrder} />
                      <ShippingLabelPrint order={selectedOrder} />
                      <Button variant="outline" onClick={() => setActiveTab('orders')}>
                        Back to Orders
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Customer</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{selectedOrder.customer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{selectedOrder.customer.name}</p>
                            <p className="text-sm text-muted-foreground">{selectedOrder.customer.email}</p>
                            <p className="text-sm text-muted-foreground">{selectedOrder.customer.phone}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Shipping</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <p className="font-medium">Address:</p>
                            <Badge>{selectedOrder.shippingMethod}</Badge>
                          </div>
                          <p className="text-sm">
                            {selectedOrder.customer.name}<br />
                            {selectedOrder.shippingAddress.street}<br />
                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}
                          </p>
                          <p className="text-sm text-muted-foreground mt-2">
                            Estimated Delivery: {formatDate(selectedOrder.estimatedDelivery)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Payment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <p className="font-medium">Method:</p>
                            <Badge className={selectedOrder.paymentStatus === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}>
                              {selectedOrder.paymentStatus}
                            </Badge>
                          </div>
                          <p className="text-sm capitalize">{selectedOrder.paymentMethod}</p>
                          
                          <div className="flex justify-between mt-2">
                            <p className="font-medium">Total:</p>
                            <p className="font-medium">KSh {selectedOrder.totalAmount}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Order Items</h3>
                    <Card>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Item</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedOrder.items.map((item: any, index: number) => (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>KSh {item.price}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell className="text-right">KSh {item.price * item.quantity}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell colSpan={3} className="text-right font-medium">Subtotal</TableCell>
                              <TableCell className="text-right">KSh {selectedOrder.totalAmount}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Order Processing</h3>
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div className="font-medium">Current Status: {getStatusBadge(selectedOrder.status)}</div>
                            <div className="flex gap-2">
                              {selectedOrder.status === 'pending' && (
                                <Button onClick={() => handleStatusChange(selectedOrder.id, 'processing')}>
                                  <Clock className="h-4 w-4 mr-2" />
                                  Start Processing
                                </Button>
                              )}
                              
                              {selectedOrder.status === 'processing' && (
                                <Button onClick={() => handleStatusChange(selectedOrder.id, 'ready')}>
                                  <PackageCheck className="h-4 w-4 mr-2" />
                                  Mark as Ready
                                </Button>
                              )}
                              
                              {selectedOrder.status === 'ready' && (
                                <Button onClick={() => handleStatusChange(selectedOrder.id, 'outForDelivery')}>
                                  <Truck className="h-4 w-4 mr-2" />
                                  Mark as Picked Up
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-2">
                            <div className="font-medium">Processing Checklist</div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={handleScanBarcode}>
                                  <Barcode className="h-4 w-4" />
                                </Button>
                                <span>Scan and verify all items</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="h-6 w-6">
                                  <ListChecks className="h-4 w-4" />
                                </Button>
                                <span>Check item condition</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="h-6 w-6">
                                  <PackageIcon className="h-4 w-4" />
                                </Button>
                                <span>Package items securely</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="h-6 w-6">
                                  <Printer className="h-4 w-4" />
                                </Button>
                                <span>Print shipping label</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab('orders')}>
                    Back to Orders
                  </Button>
                  {selectedOrder.status === 'pending' && (
                    <Button onClick={() => handleStatusChange(selectedOrder.id, 'processing')}>
                      Start Processing
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </StaffLayout>
  );
};

export default OrderPreparer;
