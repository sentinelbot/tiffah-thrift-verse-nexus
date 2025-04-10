
import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Area,
  ComposedChart,
  Bar
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SalesData } from '@/types';
import { fetchSalesData, exportToCSV, exportToPDF, formatCurrency } from '@/services/analyticsService';
import { Download, FileText, BarChart3, TrendingUp, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type TimeRange = 'daily' | 'weekly' | 'monthly';
type ViewMode = 'line' | 'area' | 'bar' | 'combo';

export function EnhancedSalesChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const [viewMode, setViewMode] = useState<ViewMode>('line');
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchSalesData(timeRange);
        setSalesData(data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [timeRange]);
  
  const handleExport = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      exportToCSV(salesData, `sales_${timeRange}_${new Date().toISOString().split('T')[0]}`);
    } else {
      exportToPDF(salesData, `sales_${timeRange}_${new Date().toISOString().split('T')[0]}`);
    }
  };
  
  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-80">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading data...</span>
        </div>
      );
    }
    
    if (viewMode === 'line') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={salesData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="period" stroke="#888" />
            <YAxis 
              stroke="#888"
              tickFormatter={(value) => `KSh ${value.toLocaleString()}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e1e1e', 
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#f5f5f5'
              }}
              formatter={(value: any) => [`KSh ${Number(value).toLocaleString()}`, 'Revenue']}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#ec4899" 
              activeDot={{ r: 8 }} 
              strokeWidth={2}
              name="Revenue"
            />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="#3b82f6" 
              activeDot={{ r: 6 }} 
              strokeWidth={2}
              name="Orders"
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }
    
    if (viewMode === 'area') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={salesData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="period" stroke="#888" />
            <YAxis 
              stroke="#888"
              tickFormatter={(value) => `KSh ${value.toLocaleString()}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e1e1e', 
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#f5f5f5'
              }}
              formatter={(value: any) => [`KSh ${Number(value).toLocaleString()}`, 'Revenue']}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              fill="#ec4899" 
              stroke="#ec4899" 
              fillOpacity={0.3}
              name="Revenue" 
            />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="#3b82f6"
              name="Orders"
            />
          </ComposedChart>
        </ResponsiveContainer>
      );
    }
    
    if (viewMode === 'bar') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={salesData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="period" stroke="#888" />
            <YAxis 
              stroke="#888"
              tickFormatter={(value) => `KSh ${value.toLocaleString()}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e1e1e', 
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#f5f5f5'
              }}
              formatter={(value: any) => [`KSh ${Number(value).toLocaleString()}`, 'Revenue']}
            />
            <Legend />
            <Bar 
              dataKey="revenue" 
              fill="#ec4899" 
              name="Revenue" 
            />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="#3b82f6"
              name="Orders"
            />
          </ComposedChart>
        </ResponsiveContainer>
      );
    }
    
    // Combo chart
    return (
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={salesData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="period" stroke="#888" />
          <YAxis 
            stroke="#888"
            tickFormatter={(value) => `KSh ${value.toLocaleString()}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e1e1e', 
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#f5f5f5'
            }}
            formatter={(value: any, name: any) => {
              if (name === 'Revenue') return [`KSh ${Number(value).toLocaleString()}`, name];
              if (name === 'Orders') return [value, name];
              if (name === 'Avg Order Value') return [`KSh ${Number(value).toLocaleString()}`, name];
              return [value, name];
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="revenue"
            fill="#ec4899"
            stroke="#ec4899"
            fillOpacity={0.2}
            name="Revenue"
          />
          <Bar 
            dataKey="orders" 
            fill="#3b82f6" 
            name="Orders" 
          />
          <Line
            type="monotone"
            dataKey="averageOrderValue"
            stroke="#10b981"
            name="Avg Order Value"
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };
  
  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>
            Sales performance over time
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="area">Area Chart</SelectItem>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="combo">Combo Chart</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button 
              variant={timeRange === 'daily' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeRange('daily')}
            >
              Daily
            </Button>
            <Button 
              variant={timeRange === 'weekly' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeRange('weekly')}
            >
              Weekly
            </Button>
            <Button 
              variant={timeRange === 'monthly' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeRange('monthly')}
            >
              Monthly
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {renderChart()}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {!isLoading && (
            <>
              Total Revenue: {formatCurrency(salesData.reduce((sum, item) => sum + item.revenue, 0))}
              <span className="mx-2">|</span>
              Total Orders: {salesData.reduce((sum, item) => sum + item.orders, 0)}
              <span className="mx-2">|</span>
              Avg Order Value: {formatCurrency(salesData.reduce((sum, item) => sum + item.averageOrderValue, 0) / salesData.length)}
            </>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
            <FileText className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
