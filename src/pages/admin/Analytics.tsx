
import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { EnhancedSalesChart } from '@/components/admin/charts/EnhancedSalesChart';
import { CategorySalesChart } from '@/components/admin/charts/CategorySalesChart';
import { InventoryChart } from '@/components/admin/charts/InventoryChart';
import { CustomerAnalytics } from '@/components/admin/analytics/CustomerAnalytics';
import { PerformanceMetrics } from '@/components/admin/analytics/PerformanceMetrics';
import { CalendarRange, Download, FileDown, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { SalesData } from '@/types';

// Mock data
const mockSalesData: SalesData[] = [
  { date: '2025-03-01', revenue: 25000, orders: 42, averageOrderValue: 595 },
  { date: '2025-03-02', revenue: 32000, orders: 58, averageOrderValue: 552 },
  { date: '2025-03-03', revenue: 19500, orders: 30, averageOrderValue: 650 },
  { date: '2025-03-04', revenue: 28700, orders: 44, averageOrderValue: 652 },
  { date: '2025-03-05', revenue: 35200, orders: 52, averageOrderValue: 677 },
  { date: '2025-03-06', revenue: 42100, orders: 66, averageOrderValue: 638 },
  { date: '2025-03-07', revenue: 38900, orders: 58, averageOrderValue: 671 },
  { date: '2025-03-08', revenue: 22800, orders: 38, averageOrderValue: 600 },
  { date: '2025-03-09', revenue: 29500, orders: 45, averageOrderValue: 656 },
  { date: '2025-03-10', revenue: 34200, orders: 50, averageOrderValue: 684 },
  { date: '2025-03-11', revenue: 31000, orders: 48, averageOrderValue: 646 },
  { date: '2025-03-12', revenue: 28900, orders: 42, averageOrderValue: 688 },
  { date: '2025-03-13', revenue: 33500, orders: 52, averageOrderValue: 644 },
  { date: '2025-03-14', revenue: 39800, orders: 60, averageOrderValue: 663 },
];

const Analytics = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("sales");
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Monitor performance metrics and insights</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <CalendarRange className="h-4 w-4" />
                  <span>{date ? format(date, 'PPP') : 'Pick a date'}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            
            <Button variant="outline" className="gap-2">
              <FileDown className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Sales performance analysis</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <EnhancedSalesChart salesData={mockSalesData} />
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                  <CardDescription>Category performance analysis</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <CategorySalesChart />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sales Details</CardTitle>
                  <CardDescription>Detailed sales metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-muted-foreground text-sm">Total Revenue</h3>
                        <p className="text-2xl font-bold">KSh 156,842</p>
                        <div className="text-xs text-green-500">+12.5% from last month</div>
                      </div>
                      <div>
                        <h3 className="text-muted-foreground text-sm">Orders</h3>
                        <p className="text-2xl font-bold">245</p>
                        <div className="text-xs text-green-500">+8.2% from last month</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-muted-foreground text-sm">Average Order Value</h3>
                        <p className="text-2xl font-bold">KSh 640</p>
                        <div className="text-xs text-green-500">+3.7% from last month</div>
                      </div>
                      <div>
                        <h3 className="text-muted-foreground text-sm">Conversion Rate</h3>
                        <p className="text-2xl font-bold">3.2%</p>
                        <div className="text-xs text-red-500">-0.5% from last month</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
                <CardDescription>Current inventory levels and distribution</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <InventoryChart />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Analytics</CardTitle>
                <CardDescription>Customer acquisition and retention metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomerAnalytics />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="staff" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Staff Performance</CardTitle>
                <CardDescription>Staff productivity and efficiency metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceMetrics />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
