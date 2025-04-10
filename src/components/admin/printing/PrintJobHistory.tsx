
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
import { 
  Printer, 
  Loader2, 
  FileText, 
  Tag, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getPrintJobHistory, PrintJob } from '@/services/printNodeService';

const PrintJobHistory = () => {
  const [jobs, setJobs] = useState<PrintJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadJobHistory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const jobHistory = await getPrintJobHistory();
      setJobs(jobHistory);
    } catch (err) {
      console.error('Error fetching print job history:', err);
      setError('Failed to load print history');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadJobHistory();
  }, []);
  
  const getTypeIcon = (type: PrintJob['type']) => {
    switch (type) {
      case 'receipt':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'shippingLabel':
        return <Tag className="h-4 w-4 text-purple-500" />;
      case 'productLabel':
        return <Tag className="h-4 w-4 text-green-500" />;
      default:
        return <Printer className="h-4 w-4" />;
    }
  };
  
  const getStatusBadge = (status: PrintJob['status']) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatJobType = (type: PrintJob['type']) => {
    switch (type) {
      case 'receipt':
        return 'Order Receipt';
      case 'shippingLabel':
        return 'Shipping Label';
      case 'productLabel':
        return 'Product Label';
      default:
        return type;
    }
  };
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 24) {
      return `${Math.round(diffInHours)} hour${Math.round(diffInHours) !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg">Print Job History</CardTitle>
          <CardDescription>
            Recent print jobs and their status
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadJobHistory} 
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            <span>Loading print history...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 flex items-center justify-center py-8">
            <XCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-muted-foreground flex items-center justify-center py-8">
            No print jobs found
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="flex items-center">
                      {getTypeIcon(job.type)}
                      <span className="ml-2">{formatJobType(job.type)}</span>
                    </TableCell>
                    <TableCell>{formatDate(job.createdAt)}</TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {job.relatedId}
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

export default PrintJobHistory;
