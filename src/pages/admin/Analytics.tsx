
import AdminLayout from '@/components/layout/AdminLayout';
import { EnhancedSalesChart } from '@/components/admin/charts/EnhancedSalesChart';
import { CategorySalesChart } from '@/components/admin/charts/CategorySalesChart';
import { InventoryChart } from '@/components/admin/charts/InventoryChart';
import { StaffPerformance } from '@/components/admin/staff/StaffPerformance';
import { CustomerAnalytics } from '@/components/admin/analytics/CustomerAnalytics';
import { PerformanceMetrics } from '@/components/admin/analytics/PerformanceMetrics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { StatsCard } from '@/components/admin/dashboard/StatsCard';
import { 
  ShoppingBag, Package, Users, TrendingUp, BarChart3, CreditCard
} from 'lucide-react';
import { useEffect } from 'react';
import { recordPageLoadTime } from '@/services/analyticsService';

const AnalyticsDashboard = () => {
  useEffect(() => {
    // Record page load time when the component mounts
    recordPageLoadTime();
  }, []);
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and reporting for Tiffah Thrift Store
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard 
            title="Total Sales" 
            value="KSh 112,385" 
            description="+15% from last month" 
            icon={ShoppingBag}
            trend={{ value: "15%", positive: true }}
          />
          <StatsCard 
            title="Inventory Value" 
            value="KSh 352,540" 
            description="425 items in stock" 
            icon={Package}
          />
          <StatsCard 
            title="Active Customers" 
            value="523" 
            description="+48 new this month" 
            icon={Users}
            trend={{ value: "48", positive: true }}
          />
          <StatsCard 
            title="Avg Order Value" 
            value="KSh 2,850" 
            description="+8% vs last month" 
            icon={CreditCard}
            trend={{ value: "8%", positive: true }}
          />
        </div>
        
        <Tabs defaultValue="sales">
          <TabsList className="grid grid-cols-4 w-[400px]">
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="space-y-4 mt-4">
            <EnhancedSalesChart />
            <div className="grid gap-4 md:grid-cols-2">
              <CategorySalesChart />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Key Performance Indicators
                  </CardTitle>
                  <CardDescription>Sales performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                      <p className="text-2xl font-bold">KSh 112,385</p>
                      <p className="text-xs text-green-500">↑ 15% vs last month</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Monthly Orders</p>
                      <p className="text-2xl font-bold">425</p>
                      <p className="text-xs text-green-500">↑ 12% vs last month</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Avg Order Value</p>
                      <p className="text-2xl font-bold">KSh 2,850</p>
                      <p className="text-xs text-green-500">↑ 8% vs last month</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Conversion Rate</p>
                      <p className="text-2xl font-bold">3.2%</p>
                      <p className="text-xs text-green-500">↑ 0.5% vs last month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="inventory" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <InventoryChart />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Inventory Metrics
                  </CardTitle>
                  <CardDescription>Inventory status and performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Items</p>
                      <p className="text-2xl font-bold">425</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Low Stock Items</p>
                      <p className="text-2xl font-bold">42</p>
                      <p className="text-xs text-yellow-500">9.8% of inventory</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Inventory Value</p>
                      <p className="text-2xl font-bold">KSh 352,540</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Avg Days to Sell</p>
                      <p className="text-2xl font-bold">12.5</p>
                      <p className="text-xs text-green-500">↓ 2.3 days vs last month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="customers" className="space-y-4 mt-4">
            <CustomerAnalytics />
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <StaffPerformance />
              <PerformanceMetrics />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsDashboard;
