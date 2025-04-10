
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package, ShoppingBag, Truck, Search, FileText, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock scan history data
const mockScanHistory = [
  {
    id: '1',
    barcode: 'TTS-PROD-001',
    scanType: 'product',
    timestamp: new Date().toISOString(),
    location: 'Warehouse',
    deviceInfo: 'Mobile App',
    result: 'Vintage Denim Jacket'
  },
  {
    id: '2',
    barcode: 'TTS-ORDER-123',
    scanType: 'order',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    location: 'Packing Area',
    deviceInfo: 'Mobile App',
    result: 'Order #TTS-20230101-1234'
  },
  {
    id: '3',
    barcode: 'TTS-DEL-456',
    scanType: 'delivery',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    location: 'Delivery Van',
    deviceInfo: 'Mobile App',
    result: 'Delivery Confirmed'
  },
  {
    id: '4',
    barcode: 'TTS-PROD-002',
    scanType: 'product',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    location: 'Store Front',
    deviceInfo: 'Desktop Scanner',
    result: 'Floral Summer Dress'
  },
];

const ScanHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [scanHistory, setScanHistory] = useState(mockScanHistory);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter scan history based on search query
    const filtered = mockScanHistory.filter(scan => 
      scan.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.result.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setScanHistory(filtered);
  };
  
  const handleDownloadHistory = () => {
    // In a real app, this would create a CSV and trigger a download
    const csvContent = 'data:text/csv;charset=utf-8,' 
      + 'Barcode,Type,Timestamp,Location,Device,Result\n'
      + scanHistory.map(scan => 
          `${scan.barcode},${scan.scanType},${scan.timestamp},${scan.location},${scan.deviceInfo},${scan.result}`
        ).join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'scan_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const getScanTypeIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'order':
        return <ShoppingBag className="h-4 w-4 text-purple-500" />;
      case 'delivery':
        return <Truck className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getScanTypeBadge = (type: string) => {
    switch (type) {
      case 'product':
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-700">Product</Badge>;
      case 'order':
        return <Badge variant="outline" className="bg-purple-500/20 text-purple-700">Order</Badge>;
      case 'delivery':
        return <Badge variant="outline" className="bg-green-500/20 text-green-700">Delivery</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle>Scan History</CardTitle>
          <CardDescription>Recent barcode scans across all devices</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownloadHistory}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search scans..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Barcode</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scanHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No scan history found
                  </TableCell>
                </TableRow>
              ) : (
                scanHistory.map((scan) => (
                  <TableRow key={scan.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {getScanTypeIcon(scan.scanType)}
                        <span className="ml-2">{scan.barcode}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getScanTypeBadge(scan.scanType)}</TableCell>
                    <TableCell>{new Date(scan.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{scan.location}</TableCell>
                    <TableCell>{scan.result}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanHistory;
