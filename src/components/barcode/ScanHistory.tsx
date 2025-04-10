
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getScanHistory } from '@/utils/authUtils'; 
import { formatDate } from '@/utils/dateUtils';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const ScanHistory = () => {
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScanHistory = async () => {
      setLoading(true);
      try {
        const history = await getScanHistory(50);
        setScanHistory(history || []);
      } catch (error) {
        console.error("Error fetching scan history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScanHistory();
  }, []);

  // Render scan type with appropriate styling
  const renderScanType = (type) => {
    const typeBadgeColors = {
      product: "bg-blue-100 text-blue-800",
      order: "bg-purple-100 text-purple-800",
      delivery: "bg-green-100 text-green-800",
      unknown: "bg-gray-100 text-gray-800"
    };

    const badgeColor = typeBadgeColors[type] || typeBadgeColors.unknown;
    
    return (
      <Badge className={badgeColor}>
        {type}
      </Badge>
    );
  };

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (scanHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No scan history found.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Scans</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Scan Time</TableHead>
              <TableHead>Barcode</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Scanned By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scanHistory.map((scan) => (
              <TableRow key={scan.id}>
                <TableCell>{formatDate(new Date(scan.scan_time))}</TableCell>
                <TableCell className="font-mono">{scan.barcode}</TableCell>
                <TableCell>{renderScanType(scan.scan_type)}</TableCell>
                <TableCell>{scan.scan_result || "N/A"}</TableCell>
                <TableCell>{scan.scanned_by_name || "Unknown"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ScanHistory;
