
import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Sample data - would be replaced with real data from API
const dailyData = [
  { name: 'Mon', sales: 1200 },
  { name: 'Tue', sales: 1800 },
  { name: 'Wed', sales: 1500 },
  { name: 'Thu', sales: 2000 },
  { name: 'Fri', sales: 2400 },
  { name: 'Sat', sales: 2800 },
  { name: 'Sun', sales: 1900 },
];

const weeklyData = [
  { name: 'Week 1', sales: 12000 },
  { name: 'Week 2', sales: 18000 },
  { name: 'Week 3', sales: 15000 },
  { name: 'Week 4', sales: 20000 },
];

const monthlyData = [
  { name: 'Jan', sales: 45000 },
  { name: 'Feb', sales: 52000 },
  { name: 'Mar', sales: 49000 },
  { name: 'Apr', sales: 60000 },
  { name: 'May', sales: 55000 },
  { name: 'Jun', sales: 70000 },
];

type TimeRange = 'daily' | 'weekly' | 'monthly';

export function SalesChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  
  const getChartData = () => {
    switch(timeRange) {
      case 'daily': return dailyData;
      case 'weekly': return weeklyData;
      case 'monthly': return monthlyData;
      default: return dailyData;
    }
  };
  
  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Sales performance over time</CardDescription>
        </div>
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
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={getChartData()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
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
                formatter={(value) => [`KSh ${Number(value).toLocaleString()}`, 'Sales']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#ec4899" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
