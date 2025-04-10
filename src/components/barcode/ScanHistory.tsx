
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, ShoppingBag, Truck } from 'lucide-react';
import { getScanHistory } from '@/utils/scannerUtils';

interface ScanRecord {
  id: string;
  type: 'product' | 'order' | 'delivery';
  code: string;
  timestamp: string;
  status: 'success' | 'error' | 'pending';
}

const ScanHistory = () => {
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [filter, setFilter] = useState<string>('all');
  
  useEffect(() => {
    // Load scan history on mount
    const loadHistory = () => {
      const scanHistory = getScanHistory();
      setHistory(scanHistory);
    };
    
    loadHistory();
    
    // Set up interval to refresh history (simulating real-time updates)
    const interval = setInterval(loadHistory, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'product':
        return <Package className="h-4 w-4" />;
      case 'order':
        return <ShoppingBag className="h-4 w-4" />;
      case 'delivery':
        return <Truck className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Scan History</CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="product">Products</SelectItem>
              <SelectItem value="order">Orders</SelectItem>
              <SelectItem value="delivery">Deliveries</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {history.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <span className="capitalize">{item.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{item.code}</TableCell>
                  <TableCell>{format(new Date(item.timestamp), 'PPp')}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No scan history found.</p>
            <p className="text-sm mt-1">Scanned barcodes will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScanHistory;
