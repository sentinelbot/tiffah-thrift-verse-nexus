
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreVertical, 
  CheckSquare, 
  ClipboardList, 
  Printer,
  PackageCheck,
  ScanBarcode,
  ShoppingBag,
  TruckIcon,
  Eye,
  CircleCheck,
  RotateCcw,
  Send,
  Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock orders data
const mockOrders = [
  {
    id: 'order-001',
    orderNumber: 'TTS-20250410-0001',
    customer: 'John Doe',
    items: 3,
    totalAmount: 7500,
    status: 'pending',
    paymentStatus: 'completed',
    dateCreated: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'order-002',
    orderNumber: 'TTS-20250410-0002',
    customer: 'Jane Smith',
    items: 1,
    totalAmount: 2800,
    status: 'processing',
    paymentStatus: 'completed',
    dateCreated: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'order-003',
    orderNumber: 'TTS-20250409-0003',
    customer: 'Robert Johnson',
    items: 2,
    totalAmount: 5000,
    status: 'processing',
    paymentStatus: 'completed',
    dateCreated: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'order-004',
    orderNumber: 'TTS-20250409-0004',
    customer: 'Maria Garcia',
    items: 4,
    totalAmount: 9200,
    status: 'ready',
    paymentStatus: 'completed',
    dateCreated: new Date(Date.now() - 3600000 * 26).toISOString(),
  },
  {
    id: 'order-005',
    orderNumber: 'TTS-20250408-0005',
    customer: 'Alex Wong',
    items: 2,
    totalAmount: 4500,
    status: 'outForDelivery',
    paymentStatus: 'completed',
    dateCreated: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

// Mock order items data
const mockOrderItems = [
  {
    id: 'item-001',
    productId: 'prod-001',
    name: 'Vintage Denim Jacket',
    price: 2500,
    quantity: 1,
    category: 'Jackets',
    location: 'Shelf A3',
    imageUrl: '/placeholder.svg',
  },
  {
    id: 'item-002',
    productId: 'prod-005',
    name: 'White Cotton T-shirt',
    price: 1200,
    quantity: 1,
    category: 'Shirts',
    location: 'Shelf B2',
    imageUrl: '/placeholder.svg',
  },
  {
    id: 'item-003',
    productId: 'prod-008',
    name: 'Black Leather Belt',
    price: 1800,
    quantity: 1,
    category: 'Accessories',
    location: 'Drawer C1',
    imageUrl: '/placeholder.svg',
  },
];

const OrderPreparer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('processing');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [viewingPickList, setViewingPickList] = useState(false);
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info(`Searching for: ${searchQuery}`);
  };
  
  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
  };
  
  const handlePrintReceipt = (orderId: string) => {
    toast.success(`Printing receipt for order ${orderId}`);
  };
  
  const handleGeneratePickList = (order: any) => {
    setSelectedOrder(order);
    setViewingPickList(true);
  };
  
  const handleMarkAsReady = (orderId: string) => {
    toast.success(`Order ${orderId} marked as ready for pickup/delivery`);
  };
  
  const handleScanBarcode = () => {
    navigate('/staff/scanning');
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-600">Processing</Badge>;
      case 'ready':
        return <Badge variant="outline" className="bg-purple-500/20 text-purple-600">Ready</Badge>;
      case 'outForDelivery':
        return <Badge variant="outline" className="bg-indigo-500/20 text-indigo-600">Out for Delivery</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-500/20 text-green-600">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-500/20 text-red-600">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600">Pending</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/20 text-green-600">Paid</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-500/20 text-red-600">Failed</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-purple-500/20 text-purple-600">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredOrders = mockOrders
    .filter(order => 
      activeTab === 'all' || 
      (activeTab === 'pending' && order.status === 'pending') ||
      (activeTab === 'processing' && order.status === 'processing') ||
      (activeTab === 'ready' && order.status === 'ready') ||
      (activeTab === 'outForDelivery' && order.status === 'outForDelivery')
    )
    .filter(order => 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Order Preparation</h1>
          <p className="text-muted-foreground">Prepare and process customer orders</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Button onClick={handleScanBarcode}>
            <ScanBarcode className="mr-2 h-4 w-4" />
            Scan Barcode
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">5</CardTitle>
            <CardDescription>Pending Orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Need payment confirmation
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">8</CardTitle>
            <CardDescription>Processing Orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Ready to be prepared
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">3</CardTitle>
            <CardDescription>Ready for Pickup</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Awaiting pickup/delivery
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">4</CardTitle>
            <CardDescription>Out for Delivery</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Currently being delivered
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="ready">Ready</TabsTrigger>
            <TabsTrigger value="outForDelivery">Out for Delivery</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <form onSubmit={handleSearch} className="relative flex-1 sm:flex-auto">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search orders..." 
                className="pl-9 w-full sm:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <TabsContent value={activeTab} className="m-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Date
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-10">
                        <div className="flex flex-col items-center justify-center">
                          <ShoppingBag className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground mb-2">No orders found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.items}</TableCell>
                        <TableCell>KSh {order.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{getPaymentBadge(order.paymentStatus)}</TableCell>
                        <TableCell>{new Date(order.dateCreated).toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleGeneratePickList(order)}>
                                <ClipboardList className="mr-2 h-4 w-4" />
                                Generate Pick List
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePrintReceipt(order.id)}>
                                <Printer className="mr-2 h-4 w-4" />
                                Print Receipt
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {order.status === 'processing' && (
                                <DropdownMenuItem onClick={() => handleMarkAsReady(order.id)}>
                                  <CheckSquare className="mr-2 h-4 w-4" />
                                  Mark as Ready
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Send className="mr-2 h-4 w-4" />
                                Notify Customer
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Phone className="mr-2 h-4 w-4" />
                                Contact Customer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{filteredOrders.length}</span> of{" "}
                <span className="font-medium">{mockOrders.length}</span> orders
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                >
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Order Details Dialog */}
      <Dialog open={selectedOrder !== null && !viewingPickList} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder && (
                <span>Order #{selectedOrder.orderNumber} • {new Date(selectedOrder.dateCreated).toLocaleString()}</span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                  <div>{getStatusBadge(selectedOrder.status)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Payment</h4>
                  <div>{getPaymentBadge(selectedOrder.paymentStatus)}</div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Customer</h4>
                  <p className="text-sm">{selectedOrder.customer}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Contact</h4>
                  <p className="text-sm">+254 712 345 678</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Items</h4>
                <div className="space-y-2">
                  {mockOrderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 border rounded-md">
                      <div className="h-12 w-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.name}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span>Qty: {item.quantity}</span>
                          <span className="mx-1">•</span>
                          <span>KSh {item.price.toLocaleString()}</span>
                          <span className="mx-1">•</span>
                          <span>Location: {item.location}</span>
                        </div>
                      </div>
                      <div>
                        <Badge variant="outline" className="ml-auto">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between border-t pt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-lg font-bold">KSh {selectedOrder.totalAmount.toLocaleString()}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Delivery Method</p>
                  <p className="font-medium">Standard Delivery</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between gap-2">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handlePrintReceipt(selectedOrder?.id)}>
                <Printer className="mr-2 h-4 w-4" />
                Print Receipt
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
                setViewingPickList(true);
              }}>
                <ClipboardList className="mr-2 h-4 w-4" />
                Pick List
              </Button>
            </div>
            
            {selectedOrder?.status === 'processing' && (
              <Button size="sm" onClick={() => {
                handleMarkAsReady(selectedOrder.id);
                setSelectedOrder(null);
              }}>
                <CheckSquare className="mr-2 h-4 w-4" />
                Mark as Ready
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Pick List Dialog */}
      <Dialog open={viewingPickList} onOpenChange={(open) => !open && setViewingPickList(false)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Pick List</DialogTitle>
            <DialogDescription>
              {selectedOrder && (
                <span>Order #{selectedOrder.orderNumber} • {selectedOrder.customer}</span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="border-b pb-2">
              <div className="flex justify-between mb-2">
                <h3 className="font-medium">Items to Pick</h3>
                <Button size="sm" variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Follow the item locations to find each product
              </p>
            </div>
            
            <div className="space-y-4">
              {mockOrderItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>
                  <div className="flex-1 border rounded-md p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{item.name}</span>
                      <Badge variant="outline">{item.location}</Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>SKU: {item.productId}</span>
                      <span className="mx-1">•</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="rounded-full">
                    <CircleCheck className="h-6 w-6 text-muted" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Order Notes</h4>
              <p className="text-sm text-muted-foreground">
                No special instructions for this order.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingPickList(false)}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Back to Order
            </Button>
            <Button onClick={() => {
              toast.success('All items confirmed as picked');
              setViewingPickList(false);
              setSelectedOrder(null);
            }}>
              <PackageCheck className="mr-2 h-4 w-4" />
              Confirm All Picked
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderPreparer;
