
import React, { useState, useEffect } from 'react';
import { getScanHistory, ScanResult } from '@/utils/scannerUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';

const ScanHistory: React.FC = () => {
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getScanHistory(100);
        setScanHistory(history);
      } catch (error) {
        console.error('Failed to load scan history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  const filteredHistory = scanHistory.filter(scan => 
    scan.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scan.scanType.includes(searchTerm.toLowerCase()) ||
    scan.status.includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'pending-sync':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getScanTypeLabel = (type: string) => {
    switch (type) {
      case 'product':
        return 'Product';
      case 'order':
        return 'Order';
      case 'delivery':
        return 'Delivery';
      default:
        return type;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search scans..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {filteredHistory.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                {searchTerm ? 'No matching scans found' : 'No scan history yet'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.map((scan) => (
                      <TableRow key={scan.id}>
                        <TableCell>{formatTimestamp(scan.timestamp)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{getScanTypeLabel(scan.scanType)}</Badge>
                        </TableCell>
                        <TableCell className="font-mono">{scan.code}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(scan.status)}>
                            {scan.status === 'pending-sync' ? 'Pending' : scan.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ScanHistory;
