
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SystemPerformance } from '@/types';
import { fetchSystemPerformance } from '@/services/analyticsService';
import { Progress } from '@/components/ui/progress';
import { Loader2, Gauge, Clock, AlertCircle, ThumbsUp } from 'lucide-react';

export function PerformanceMetrics() {
  const [metrics, setMetrics] = useState<SystemPerformance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchSystemPerformance();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching system performance data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Refresh every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  if (!metrics) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center min-h-[200px]">
          <p className="text-muted-foreground">No performance data available</p>
        </CardContent>
      </Card>
    );
  }
  
  const getPageLoadClass = () => {
    if (metrics.pageLoadTime < 1.0) return 'text-green-500';
    if (metrics.pageLoadTime < 2.0) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getServerResponseClass = () => {
    if (metrics.serverResponseTime < 0.2) return 'text-green-500';
    if (metrics.serverResponseTime < 0.5) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  const getErrorRateClass = () => {
    if (metrics.errorRate < 0.5) return 'text-green-500';
    if (metrics.errorRate < 1.0) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Gauge className="h-5 w-5 mr-2" />
          System Performance
        </CardTitle>
        <CardDescription>Real-time performance metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">Page Load Time</span>
            </div>
            <span className={`text-sm font-medium ${getPageLoadClass()}`}>
              {metrics.pageLoadTime}s
            </span>
          </div>
          <Progress value={Math.min(100, metrics.pageLoadTime * 33)} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">Server Response Time</span>
            </div>
            <span className={`text-sm font-medium ${getServerResponseClass()}`}>
              {metrics.serverResponseTime}s
            </span>
          </div>
          <Progress value={Math.min(100, metrics.serverResponseTime * 100)} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">Error Rate</span>
            </div>
            <span className={`text-sm font-medium ${getErrorRateClass()}`}>
              {metrics.errorRate}%
            </span>
          </div>
          <Progress value={Math.min(100, metrics.errorRate * 20)} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="flex items-center">
              <ThumbsUp className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">User Satisfaction</span>
            </div>
            <span className="text-sm font-medium text-green-500">
              {metrics.userSatisfaction}%
            </span>
          </div>
          <Progress value={metrics.userSatisfaction} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
