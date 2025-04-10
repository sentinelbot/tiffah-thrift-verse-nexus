
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { getScanHistory } from '@/utils/scannerUtils';
import { Search, Download, RefreshCw, Package, ShoppingBag, Truck } from 'lucide-react';
import { formatDateTime } from '@/utils/formatters';

const ScanHistory = () => {
  const { user } = useAuth();
  const [scanType, setScanType] = useState<'all' | 'product' | 'order' | 'delivery'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [scanHistory, setScanHistory] = useState<any[]>([]);

  // Load scan history
  const loadScanHistory = async () => {
    setIsLoading(true);
    try {
      const type = scanType !== 'all' ? scanType : undefined;
      const history = await getScanHistory(type as any, user?.id);
      setScanHistory(history);
    } catch (error) {
      console.error('Error loading scan history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load history on mount and when scan type changes
  useEffect(() => {
    if (user) {
      loadScanHistory();
    }
  }, [user, scanType]);

  // Filter history based on search query
  const filteredHistory = scanHistory.filter(scan => 
    scan.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Export scan history to CSV
  const exportToCsv = () => {
    if (scanHistory.length === 0) return;
    
    const headers = ['Code', 'Type', 'Timestamp', 'Scanned By', 'Synced'];
    const rows = scanHistory.map(scan => [
      scan.code,
      scan.type,
      new Date(scan.timestamp).toLocaleString(),
      scan.scanBy,
      scan.synced ? 'Yes' : 'No'
    ]);
    
    const csvContent = 
      headers.join(',') + '\n' + 
      rows.map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `scan-history-${scanType}-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render scan type badge
  const renderScanTypeBadge = (type: string) => {
    switch (type) {
      case 'product':
        return <Badge variant="secondary" className="flex items-center gap-1"><Package className="h-3 w-3" /> Product</Badge>;
      case 'order':
        return <Badge variant="secondary" className="flex items-center gap-1"><ShoppingBag className="h-3 w-3" /> Order</Badge>;
      case 'delivery':
        return <Badge variant="secondary" className="flex items-center gap-1"><Truck className="h-3 w-3" /> Delivery</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <Tabs value={scanType} onValueChange={(v) => setScanType(v as any)} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all">All Scans</TabsTrigger>
              <TabsTrigger value="product">Products</TabsTrigger>
              <TabsTrigger value="order">Orders</TabsTrigger>
              <TabsTrigger value="delivery">Deliveries</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search codes..." 
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" onClick={loadScanHistory}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={exportToCsv}
              disabled={scanHistory.length === 0}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">Loading scan history...</TableCell>
                </TableRow>
              ) : filteredHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">No scan history found</TableCell>
                </TableRow>
              ) : (
                filteredHistory.map((scan, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono">{scan.code}</TableCell>
                    <TableCell>{renderScanTypeBadge(scan.type)}</TableCell>
                    <TableCell>{formatDateTime(new Date(scan.timestamp))}</TableCell>
                    <TableCell className="text-right">
                      {scan.synced ? (
                        <Badge variant="outline" className="bg-green-500/20 text-green-500">Synced</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500">Pending</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {scanHistory.length > 0 && (
          <div className="text-sm text-muted-foreground mt-4">
            Showing {filteredHistory.length} of {scanHistory.length} scans
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScanHistory;
