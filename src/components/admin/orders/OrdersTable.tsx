
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Printer,
  Edit,
  Trash,
  CheckSquare,
  X,
  ArrowUpDown,
  ShoppingBag,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { formatDate } from '@/utils/dateUtils';

// Mock orders data
const mockOrders = [
  {
    id: 'order-001',
    orderNumber: 'TTS-20250410-0001',
    customer: 'John Doe',
    email: 'john.doe@example.com',
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
    email: 'jane.smith@example.com',
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
    email: 'robert.johnson@example.com',
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
    email: 'maria.garcia@example.com',
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
    email: 'alex.wong@example.com',
    items: 2,
    totalAmount: 4500,
    status: 'outForDelivery',
    paymentStatus: 'completed',
    dateCreated: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'order-006',
    orderNumber: 'TTS-20250408-0006',
    customer: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    items: 3,
    totalAmount: 6200,
    status: 'delivered',
    paymentStatus: 'completed',
    dateCreated: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
  {
    id: 'order-007',
    orderNumber: 'TTS-20250407-0007',
    customer: 'James Wilson',
    email: 'james.wilson@example.com',
    items: 1,
    totalAmount: 3000,
    status: 'cancelled',
    paymentStatus: 'refunded',
    dateCreated: new Date(Date.now() - 3600000 * 96).toISOString(),
  },
];

export function OrdersTable() {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = mockOrders.filter(order => 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setOrders(filtered);
  };
  
  const resetSearch = () => {
    setSearchQuery('');
    setOrders(mockOrders);
  };
  
  const handleSelectAll = () => {
    if (selectedOrderIds.length === orders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(orders.map(order => order.id));
    }
  };
  
  const handleSelectOrder = (orderId: string) => {
    if (selectedOrderIds.includes(orderId)) {
      setSelectedOrderIds(selectedOrderIds.filter(id => id !== orderId));
    } else {
      setSelectedOrderIds([...selectedOrderIds, orderId]);
    }
  };
  
  const handleDeleteSelected = () => {
    toast.success(`${selectedOrderIds.length} orders deleted`);
    setOrders(orders.filter(order => !selectedOrderIds.includes(order.id)));
    setSelectedOrderIds([]);
  };
  
  const handleDeleteOrder = (orderId: string) => {
    setOrderToDelete(orderId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteOrder = () => {
    if (orderToDelete) {
      setOrders(orders.filter(order => order.id !== orderToDelete));
      toast.success(`Order ${orderToDelete} deleted`);
      setOrderToDelete(null);
      setIsDeleteDialogOpen(false);
    }
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search"
                placeholder="Search orders..." 
                className="pl-9 min-w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
            {searchQuery && (
              <Button type="button" variant="ghost" onClick={resetSearch}>
                Reset
              </Button>
            )}
          </form>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2">
                  <Checkbox checked id="order-number" />
                  <label htmlFor="order-number">Order Number</label>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Checkbox checked id="customer" />
                  <label htmlFor="customer">Customer</label>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Checkbox checked id="email" />
                  <label htmlFor="email">Email</label>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Checkbox checked id="items" />
                  <label htmlFor="items">Items</label>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Checkbox checked id="amount" />
                  <label htmlFor="amount">Amount</label>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Checkbox checked id="status" />
                  <label htmlFor="status">Status</label>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Checkbox checked id="payment" />
                  <label htmlFor="payment">Payment</label>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Checkbox checked id="date" />
                  <label htmlFor="date">Date</label>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex gap-2">
          {selectedOrderIds.length > 0 && (
            <Button 
              variant="outline"
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={handleDeleteSelected}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          )}
          <Button>
            <ShoppingBag className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={orders.length > 0 && selectedOrderIds.length === orders.length}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all orders"
                />
              </TableHead>
              <TableHead className="min-w-[150px]">
                <div className="flex items-center gap-1">
                  Order Number
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="min-w-[150px]">Customer</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell w-[80px] text-center">Items</TableHead>
              <TableHead className="hidden md:table-cell">Total</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="hidden md:table-cell">Payment</TableHead>
              <TableHead className="hidden md:table-cell">
                <div className="flex items-center gap-1">
                  Date
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedOrderIds.includes(order.id)}
                      onCheckedChange={() => handleSelectOrder(order.id)}
                      aria-label={`Select order ${order.orderNumber}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.email}</TableCell>
                  <TableCell className="hidden md:table-cell text-center">{order.items}</TableCell>
                  <TableCell className="hidden md:table-cell">KSh {order.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="hidden md:table-cell">{getPaymentBadge(order.paymentStatus)}</TableCell>
                  <TableCell className="hidden md:table-cell">{formatDate(new Date(order.dateCreated))}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Order
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Printer className="mr-2 h-4 w-4" />
                          Print Receipt
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteOrder(order.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {selectedOrderIds.length > 0 
            ? `${selectedOrderIds.length} of ${orders.length} row(s) selected.` 
            : `Showing ${orders.length} order(s).`}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteOrder}>
              <Trash className="mr-2 h-4 w-4" />
              Delete Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
