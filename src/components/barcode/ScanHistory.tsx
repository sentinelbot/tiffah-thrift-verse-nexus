
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getScanHistory } from '@/utils/authUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, PackageOpen, FileText, Truck } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface ScanHistoryItem {
  id: string;
  barcode: string;
  scan_type: 'product' | 'order' | 'delivery';
  scan_time: string;
  location?: string;
  device_info?: string;
}

const ScanHistory: React.FC = () => {
  const { user } = useAuth();
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadScanHistory();
    }
  }, [user]);

  const loadScanHistory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const history = await getScanHistory(50);
      setScanHistory(history);
    } catch (error) {
      console.error('Error loading scan history:', error);
      setError('Failed to load scan history');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getScanIcon = (scanType: string) => {
    switch (scanType) {
      case 'product':
        return <PackageOpen className="h-4 w-4" />;
      case 'order':
        return <FileText className="h-4 w-4" />;
      case 'delivery':
        return <Truck className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getScanTypeBadge = (scanType: string) => {
    switch (scanType) {
      case 'product':
        return <Badge variant="secondary">Product</Badge>;
      case 'order':
        return <Badge variant="default">Order</Badge>;
      case 'delivery':
        return <Badge variant="outline">Delivery</Badge>;
      default:
        return <Badge>{scanType}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Scan History</CardTitle>
          <Button variant="outline" size="sm" onClick={loadScanHistory} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            <p>{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={loadScanHistory}
            >
              Try Again
            </Button>
          </div>
        ) : scanHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No scan history found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Device</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scanHistory.map((scan) => (
                  <TableRow key={scan.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getScanIcon(scan.scan_type)}
                        {getScanTypeBadge(scan.scan_type)}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {scan.barcode}
                    </TableCell>
                    <TableCell>
                      {formatDate(scan.scan_time)}
                    </TableCell>
                    <TableCell className="truncate max-w-[200px]">
                      <span title={scan.device_info}>
                        {scan.device_info?.substring(0, 20)}...
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScanHistory;
