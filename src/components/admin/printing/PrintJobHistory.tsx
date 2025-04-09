
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  FileText, 
  Package, 
  Truck,
  Check,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { PrintJob, retryPrintJob } from '@/services/printNodeService';
import { formatDate } from '@/utils/dateUtils';

// Mock data for demo purposes
const mockPrintJobs: PrintJob[] = [
  {
    id: '1001',
    type: 'label',
    content: '^XA...',
    printerId: 'pm_printer_id',
    status: 'completed',
    createdAt: new Date(Date.now() - 120000),
    processedAt: new Date(Date.now() - 115000),
    relatedId: 'prod-001',
    requestedBy: 'user-001'
  },
  {
    id: '1002',
    type: 'receipt',
    content: '<html>...</html>',
    printerId: 'op_printer_id',
    status: 'completed',
    createdAt: new Date(Date.now() - 90000),
    processedAt: new Date(Date.now() - 85000),
    relatedId: 'order-001',
    requestedBy: 'user-002'
  },
  {
    id: '1003',
    type: 'shippingLabel',
    content: '^XA...',
    printerId: 'ds_printer_id',
    status: 'failed',
    createdAt: new Date(Date.now() - 60000),
    error: 'Printer offline',
    relatedId: 'order-002',
    requestedBy: 'user-003'
  },
  {
    id: '1004',
    type: 'label',
    content: '^XA...',
    printerId: 'pm_printer_id',
    status: 'pending',
    createdAt: new Date(Date.now() - 30000),
    relatedId: 'prod-002',
    requestedBy: 'user-001'
  }
];

const PrintJobHistory = () => {
  const [printJobs, setPrintJobs] = useState<PrintJob[]>(mockPrintJobs);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch print jobs - in a real app, this would come from an API
  const fetchPrintJobs = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from an API or database
      // For demo purposes, we're using mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      setPrintJobs([...mockPrintJobs]);
    } catch (error) {
      console.error('Error fetching print jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPrintJobs();
  }, []);
  
  // Retry a failed print job
  const handleRetry = async (printJob: PrintJob) => {
    try {
      const success = await retryPrintJob(printJob);
      if (success) {
        // Update local state to show job as completed
        setPrintJobs(prevJobs => 
          prevJobs.map(job => 
            job.id === printJob.id 
              ? { ...job, status: 'completed', processedAt: new Date(), error: undefined } 
              : job
          )
        );
      }
    } catch (error) {
      console.error('Error retrying print job:', error);
    }
  };
  
  // Get icon based on print job type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'label':
        return <Package className="h-4 w-4" />;
      case 'receipt':
        return <FileText className="h-4 w-4" />;
      case 'shippingLabel':
        return <Truck className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  // Get badge based on print job status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-500">
            <Check className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case 'pending':
      case 'processing':
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
            <Clock className="h-3 w-3 mr-1" />
            {status === 'pending' ? 'Pending' : 'Processing'}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Print Job History</CardTitle>
          <CardDescription>Recent print jobs and their status</CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={fetchPrintJobs} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {printJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No print jobs found
                </TableCell>
              </TableRow>
            ) : (
              printJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(job.type)}
                      <span className="capitalize">
                        {job.type === 'shippingLabel' ? 'Shipping Label' : job.type}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(job.createdAt)}</TableCell>
                  <TableCell>{getStatusBadge(job.status)}</TableCell>
                  <TableCell>
                    <span className="font-mono text-xs">
                      {job.relatedId}
                    </span>
                  </TableCell>
                  <TableCell>
                    {job.status === 'failed' && (
                      <Button size="sm" variant="outline" onClick={() => handleRetry(job)}>
                        Retry
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PrintJobHistory;
