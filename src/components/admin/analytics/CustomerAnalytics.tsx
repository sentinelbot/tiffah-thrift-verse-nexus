
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CustomerBehavior } from '@/types';
import { fetchCustomerBehavior, formatCurrency } from '@/services/analyticsService';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, Users, CreditCard, Repeat, ShoppingCart } from 'lucide-react';

export function CustomerAnalytics() {
  const [customerData, setCustomerData] = useState<CustomerBehavior[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCustomerBehavior();
        setCustomerData(data);
      } catch (error) {
        console.error('Error fetching customer behavior data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const COLORS = ['#ec4899', '#3b82f6', '#10b981', '#f97316'];
  
  const renderPieChart = (dataKey: keyof CustomerBehavior, formatter?: (value: number) => string) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    return (
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={customerData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey="segment"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {customerData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e1e1e', 
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#f5f5f5'
            }}
            formatter={(value: number) => [
              formatter ? formatter(value) : value,
              ''
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };
  
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Customer Behavior Analysis
        </CardTitle>
        <CardDescription>Understanding customer segments and behavior patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="count">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="count" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Customer Count
            </TabsTrigger>
            <TabsTrigger value="spend" className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Average Spend
            </TabsTrigger>
            <TabsTrigger value="repeat" className="flex items-center">
              <Repeat className="h-4 w-4 mr-2" />
              Repeat Rate
            </TabsTrigger>
            <TabsTrigger value="items" className="flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Items Per Order
            </TabsTrigger>
          </TabsList>
          <TabsContent value="count">
            {renderPieChart('count')}
          </TabsContent>
          <TabsContent value="spend">
            {renderPieChart('averageSpend', (value) => formatCurrency(value))}
          </TabsContent>
          <TabsContent value="repeat">
            {renderPieChart('repeatRate', (value) => `${value}%`)}
          </TabsContent>
          <TabsContent value="items">
            {renderPieChart('averageItemsPerOrder')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
