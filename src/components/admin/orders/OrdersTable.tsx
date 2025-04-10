
import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sample data - would be replaced with real data from API
const orders = [
  { id: 'TTS-20250409-0001', customer: 'Jane Smith', date: '2025-04-09', items: 3, total: 7500, status: 'Processing' },
  { id: 'TTS-20250408-0002', customer: 'John Doe', date: '2025-04-08', items: 2, total: 4500, status: 'Ready' },
  { id: 'TTS-20250408-0001', customer: 'Alice Johnson', date: '2025-04-08', items: 1, total: 2200, status: 'Delivered' },
  { id: 'TTS-20250407-0002', customer: 'Bob Brown', date: '2025-04-07', items: 4, total: 9800, status: 'Pending' },
  { id: 'TTS-20250407-0001', customer: 'Sarah Wilson', date: '2025-04-07', items: 2, total: 5300, status: 'Delivered' },
];

interface OrdersTableProps {
  onRowClick?: (orderId: string) => void;
}

export function OrdersTable({ onRowClick }: OrdersTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-500';
      case 'Processing': return 'bg-blue-500';
      case 'Ready': return 'bg-purple-500';
      case 'Delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>Manage customer orders</CardDescription>
        <div className="flex items-center gap-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Ready">Ready</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total (KSh)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow 
                  key={order.id} 
                  onClick={() => onRowClick && onRowClick(order.id)}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                >
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{order.total.toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  No orders found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
