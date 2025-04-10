
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  ShoppingBag,
  Users,
  Truck,
  Package,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Summary analytics data for the dashboard
  const summaryData = {
    revenue: {
      total: 'KSh 325,400',
      change: '+12.5%',
      trend: 'up',
      period: 'from last month'
    },
    orders: {
      total: 137,
      change: '+18.2%',
      trend: 'up',
      period: 'from last month'
    },
    customers: {
      total: 945,
      change: '+6.8%',
      trend: 'up',
      period: 'from last month'
    },
    avgOrderValue: {
      total: 'KSh 2,375',
      change: '-2.3%',
      trend: 'down',
      period: 'from last month'
    }
  };
  
  // Recent orders data
  const recentOrders = [
    {
      id: 'TTS-20250410-1584',
      customer: 'Sarah Johnson',
      amount: 'KSh 4,250',
      status: 'processing',
      items: 3,
      date: '15 min ago',
    },
    {
      id: 'TTS-20250410-1583',
      customer: 'Michael Kimani',
      amount: 'KSh 1,800',
      status: 'delivered',
      items: 1,
      date: '1 hour ago',
    },
    {
      id: 'TTS-20250410-1582',
      customer: 'Amina Wanjiku',
      amount: 'KSh 7,500',
      status: 'ready',
      items: 5,
      date: '2 hours ago',
    },
    {
      id: 'TTS-20250409-1581',
      customer: 'David Omondi',
      amount: 'KSh 3,200',
      status: 'outForDelivery',
      items: 2,
      date: '5 hours ago',
    },
    {
      id: 'TTS-20250409-1580',
      customer: 'Lucy Mwangi',
      amount: 'KSh 2,750',
      status: 'delivered',
      items: 2,
      date: '8 hours ago',
    }
  ];
  
  // Inventory status data
  const inventoryStatus = {
    totalItems: 2540,
    lowStock: 124,
    outOfStock: 37,
    categories: [
      { name: 'Dresses', count: 320, percentage: 85 },
      { name: 'Jackets', count: 245, percentage: 72 },
      { name: 'Shoes', count: 410, percentage: 90 },
      { name: 'Bags', count: 185, percentage: 60 },
      { name: 'T-Shirts', count: 375, percentage: 78 },
    ]
  };
  
  // Pending tasks data
  const pendingTasks = [
    { id: 1, task: 'Process 18 new product uploads', icon: <Package className="h-4 w-4" /> },
    { id: 2, task: 'Review 5 order cancellation requests', icon: <ShoppingBag className="h-4 w-4" /> },
    { id: 3, task: 'Schedule 3 pending deliveries', icon: <Truck className="h-4 w-4" /> },
    { id: 4, task: 'Verify 8 customer account requests', icon: <Users className="h-4 w-4" /> },
    { id: 5, task: 'Prepare end of month sales report', icon: <BarChart3 className="h-4 w-4" /> },
  ];

  // Get status color based on order status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
      case 'ready':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
      case 'outForDelivery':
        return 'text-purple-500 bg-purple-100 dark:bg-purple-900/30';
      case 'delivered':
        return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      case 'cancelled':
        return 'text-red-500 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
    }
  };

  // Format status label
  const formatStatus = (status: string) => {
    switch (status) {
      case 'outForDelivery':
        return 'Out for Delivery';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Today
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryData.revenue.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className={`inline-flex items-center ${summaryData.revenue.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {summaryData.revenue.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {summaryData.revenue.change}
                </span>{' '}
                {summaryData.revenue.period}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryData.orders.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className={`inline-flex items-center ${summaryData.orders.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {summaryData.orders.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {summaryData.orders.change}
                </span>{' '}
                {summaryData.orders.period}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryData.customers.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className={`inline-flex items-center ${summaryData.customers.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {summaryData.customers.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {summaryData.customers.change}
                </span>{' '}
                {summaryData.customers.period}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
              <ShoppingBag className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryData.avgOrderValue.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className={`inline-flex items-center ${summaryData.avgOrderValue.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {summaryData.avgOrderValue.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {summaryData.avgOrderValue.change}
                </span>{' '}
                {summaryData.avgOrderValue.period}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Recent Orders */}
              <Card className="md:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest 5 orders from your store</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/admin/orders')}>
                    View All
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                              <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </div>
                          <div>
                            <p className="font-medium">{order.customer}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-muted-foreground">{order.id}</p>
                              <span className="text-sm text-muted-foreground">•</span>
                              <p className="text-sm text-muted-foreground">{order.items} items</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p>{order.amount}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{order.date}</span>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {formatStatus(order.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Pending Tasks */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Pending Tasks</CardTitle>
                  <CardDescription>Tasks that require your attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingTasks.map((task) => (
                      <div key={task.id} className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {task.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{task.task}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Inventory Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
                <CardDescription>Current stock levels by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Items</p>
                        <p className="text-2xl font-bold">{inventoryStatus.totalItems}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Low Stock Items</p>
                        <p className="text-2xl font-bold">{inventoryStatus.lowStock}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Out of Stock Items</p>
                        <p className="text-2xl font-bold">{inventoryStatus.outOfStock}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 space-y-4">
                    {inventoryStatus.categories.map((category) => (
                      <div key={category.name}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">{category.count} items</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Progress value={category.percentage} className="h-2 flex-1" />
                          <span className="text-sm text-muted-foreground w-10 text-right">
                            {category.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>Manage and track customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Detailed order content will be displayed here</p>
                  <Button onClick={() => navigate('/admin/orders')}>
                    Go to Orders
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>Track and manage your product inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Detailed inventory content will be displayed here</p>
                  <Button onClick={() => navigate('/admin/products')}>
                    Go to Products
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>Manage customer accounts and information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Detailed customer content will be displayed here</p>
                  <Button onClick={() => navigate('/admin/users')}>
                    Go to Customers
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
