
import { useState } from 'react';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SalesData } from '@/types';

interface EnhancedSalesChartProps {
  salesData: SalesData[];
}

export const EnhancedSalesChart = ({ salesData }: EnhancedSalesChartProps) => {
  const [period, setPeriod] = useState<'day' | 'month'>('day');
  
  // Function to format date on x-axis
  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    if (period === 'month') {
      return date.toLocaleDateString('en-US', { month: 'short' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Format for currency
  const formatCurrency = (value: number) => {
    return `KSh ${value.toLocaleString()}`;
  };
  
  // Calculate average revenue per day
  const avgRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0) / salesData.length;
  
  // Find peak revenue day
  const peakRevenueDay = salesData.reduce(
    (peak, day) => day.revenue > peak.revenue ? day : peak, 
    { revenue: 0, date: '', orders: 0, averageOrderValue: 0 }
  );
  
  // Find peak orders day
  const peakOrdersDay = salesData.reduce(
    (peak, day) => day.orders > peak.orders ? day : peak, 
    { revenue: 0, date: '', orders: 0, averageOrderValue: 0 }
  );
  
  // Calculate growth rate
  const calculateGrowth = () => {
    if (salesData.length < 2) return 0;
    const firstDay = salesData[0].revenue;
    const lastDay = salesData[salesData.length - 1].revenue;
    return ((lastDay - firstDay) / firstDay) * 100;
  };
  
  return (
    <Card className="col-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Sales Performance</CardTitle>
          <CardDescription>Overview of revenue and order trends</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={period === 'day' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setPeriod('day')}
          >
            Daily
          </Button>
          <Button 
            variant={period === 'month' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setPeriod('month')}
          >
            Monthly
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-3 border rounded-md">
            <div className="text-sm text-muted-foreground">Avg. Daily Revenue</div>
            <div className="text-2xl font-bold">{formatCurrency(avgRevenue)}</div>
          </div>
          <div className="p-3 border rounded-md">
            <div className="text-sm text-muted-foreground">Peak Revenue Day</div>
            <div className="text-2xl font-bold">{formatCurrency(peakRevenueDay.revenue)}</div>
            <div className="text-xs text-muted-foreground">{new Date(peakRevenueDay.date).toLocaleDateString()}</div>
          </div>
          <div className="p-3 border rounded-md">
            <div className="text-sm text-muted-foreground">Growth Rate</div>
            <div className="text-2xl font-bold">{calculateGrowth().toFixed(1)}%</div>
          </div>
        </div>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={salesData}
              margin={{
                top: 20,
                right: 20,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxis} 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                yAxisId="left" 
                tickFormatter={formatCurrency} 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                tick={{ fontSize: 12 }}
              />
              <Tooltip formatter={(value, name) => {
                if (name === 'revenue') return [formatCurrency(value as number), 'Revenue'];
                if (name === 'averageOrderValue') return [formatCurrency(value as number), 'Avg. Order Value'];
                return [value, name];
              }} />
              <Legend />
              <Bar 
                dataKey="revenue" 
                fill="#ec4899" 
                yAxisId="left" 
                barSize={20} 
                name="Revenue"
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#8884d8" 
                yAxisId="right" 
                name="Orders"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="averageOrderValue"
                stroke="#82ca9d" 
                yAxisId="left" 
                name="Avg. Order Value" 
                strokeDasharray="5 5"
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
