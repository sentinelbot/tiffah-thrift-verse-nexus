
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Users,
  Package,
  Truck,
  CreditCard,
  DollarSign,
  CalendarDays,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Layers,
  AlertCircle,
  Clock,
  CheckCircle,
  BarChart2,
  PieChart,
  LineChart,
  BarChart
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back to your admin dashboard
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => window.location.reload()}>Refresh Data</Button>
            <Button variant="outline">
              <CalendarDays className="mr-2 h-4 w-4" />
              Apr 10 - Apr 16, 2025
            </Button>
          </div>
        </div>
        
        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KSh 452,675</div>
              <div className="flex items-center pt-1 text-xs text-muted-foreground">
                <span className="text-green-500 flex gap-0.5 items-center">
                  <ArrowUpRight className="h-3 w-3" />
                  +15.8%
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Orders
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">246</div>
              <div className="flex items-center pt-1 text-xs text-muted-foreground">
                <span className="text-red-500 flex gap-0.5 items-center">
                  <ArrowDownRight className="h-3 w-3" />
                  -2.5%
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Customers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,402</div>
              <div className="flex items-center pt-1 text-xs text-muted-foreground">
                <span className="text-green-500 flex gap-0.5 items-center">
                  <ArrowUpRight className="h-3 w-3" />
                  +24.3%
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Inventory Value
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KSh 935,250</div>
              <div className="flex items-center pt-1 text-xs text-muted-foreground">
                <span className="text-green-500 flex gap-0.5 items-center">
                  <ArrowUpRight className="h-3 w-3" />
                  +8.2%
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Sales Chart */}
          <Card className="col-span-7 lg:col-span-4">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>
                Daily orders and revenue from April 1-16, 2025
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] flex items-center justify-center">
                <BarChart className="h-16 w-16 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Sales chart goes here</span>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Activity */}
          <Card className="col-span-7 lg:col-span-3">
            <CardHeader className="pb-3">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest transactions and system events
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[300px] overflow-auto">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-green-100 text-green-600">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">New order #TTS-20250416-0067</p>
                    <p className="text-xs text-muted-foreground">
                      Customer: Maria Garcia - KSh 8,350
                    </p>
                    <p className="text-xs text-muted-foreground">5 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-yellow-100 text-yellow-600">
                    <Truck className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Order ready for delivery</p>
                    <p className="text-xs text-muted-foreground">
                      Order #TTS-20250416-0060 - 3 items
                    </p>
                    <p className="text-xs text-muted-foreground">43 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-blue-100 text-blue-600">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">New customer registered</p>
                    <p className="text-xs text-muted-foreground">
                      James Wilson - james.wilson@example.com
                    </p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-purple-100 text-purple-600">
                    <Package className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">New inventory added</p>
                    <p className="text-xs text-muted-foreground">
                      15 new items - KSh 42,350 total value
                    </p>
                    <p className="text-xs text-muted-foreground">3 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-green-100 text-green-600">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Payment received</p>
                    <p className="text-xs text-muted-foreground">
                      Order #TTS-20250416-0053 - KSh 12,800
                    </p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">
                View All Activity
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Inventory Status */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>
                Product stock levels by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm">Dresses</span>
                      <Badge variant="outline">124 items</Badge>
                    </div>
                    <span className="text-sm">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm">Pants</span>
                      <Badge variant="outline">86 items</Badge>
                    </div>
                    <span className="text-sm">62%</span>
                  </div>
                  <Progress value={62} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm">Shirts</span>
                      <Badge variant="outline">210 items</Badge>
                    </div>
                    <span className="text-sm">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm">Jackets</span>
                      <Badge variant="outline">52 items</Badge>
                    </div>
                    <span className="text-sm">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm">Accessories</span>
                      <Badge variant="outline">168 items</Badge>
                    </div>
                    <span className="text-sm">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Inventory Report
              </Button>
            </CardFooter>
          </Card>
          
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest customer orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Order #TTS-20250416-0067</p>
                    <p className="text-xs text-muted-foreground">Maria Garcia • 5 min ago</p>
                  </div>
                  <Badge>Pending</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Order #TTS-20250416-0066</p>
                    <p className="text-xs text-muted-foreground">John Smith • 32 min ago</p>
                  </div>
                  <Badge>Processing</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Order #TTS-20250416-0065</p>
                    <p className="text-xs text-muted-foreground">Robert Johnson • 1 hour ago</p>
                  </div>
                  <Badge>Ready</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Order #TTS-20250416-0064</p>
                    <p className="text-xs text-muted-foreground">Lisa Wong • 2 hours ago</p>
                  </div>
                  <Badge>Out for Delivery</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Order #TTS-20250416-0063</p>
                    <p className="text-xs text-muted-foreground">Alex Brown • 3 hours ago</p>
                  </div>
                  <Badge variant="outline" className="bg-green-500/20 text-green-600">Delivered</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Orders
              </Button>
            </CardFooter>
          </Card>
          
          {/* Staff Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Staff Performance</CardTitle>
              <CardDescription>
                Top performing staff members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Jane Doe</p>
                      <Badge variant="outline" className="bg-green-500/20 text-green-600">Product Manager</Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Products Processed: 253</span>
                      <span className="text-green-500 font-medium">+12%</span>
                    </div>
                    <Progress value={92} className="h-1" />
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">John Smith</p>
                      <Badge variant="outline" className="bg-blue-500/20 text-blue-600">Order Preparer</Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Orders Processed: 142</span>
                      <span className="text-green-500 font-medium">+8%</span>
                    </div>
                    <Progress value={86} className="h-1" />
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>RJ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Robert Johnson</p>
                      <Badge variant="outline" className="bg-indigo-500/20 text-indigo-600">Delivery Staff</Badge>
                    </div>
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>Deliveries: 95</span>
                      <span className="text-green-500 font-medium">+15%</span>
                    </div>
                    <Progress value={78} className="h-1" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Full Staff Report
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Operational metrics for the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Server Uptime</p>
                    <p className="text-xl font-bold">99.98%</p>
                    <Badge variant="outline" className="bg-green-500/20 text-green-600">Healthy</Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Response Time</p>
                    <p className="text-xl font-bold">235ms</p>
                    <Badge variant="outline" className="bg-green-500/20 text-green-600">Good</Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Error Rate</p>
                    <p className="text-xl font-bold">0.03%</p>
                    <Badge variant="outline" className="bg-green-500/20 text-green-600">Low</Badge>
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium">System Load</div>
                    <div className="text-sm">42%</div>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium">Database Performance</div>
                    <div className="text-sm">89%</div>
                  </div>
                  <Progress value={89} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium">Storage Capacity</div>
                    <div className="text-sm">56%</div>
                  </div>
                  <Progress value={56} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Alert Center */}
          <Card>
            <CardHeader>
              <CardTitle>Alert Center</CardTitle>
              <CardDescription>
                Important notifications requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-700">Low Stock Alert</h4>
                    <p className="text-sm text-yellow-600">12 products are below minimum stock threshold</p>
                    <Button variant="link" className="h-auto p-0 text-yellow-700">View products</Button>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-700">Failed Deliveries</h4>
                    <p className="text-sm text-red-600">3 deliveries failed in the last 24 hours</p>
                    <Button variant="link" className="h-auto p-0 text-red-700">Review failures</Button>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <Clock className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-700">Pending Approvals</h4>
                    <p className="text-sm text-blue-600">5 new products waiting for approval</p>
                    <Button variant="link" className="h-auto p-0 text-blue-700">Review now</Button>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-700">System Update Completed</h4>
                    <p className="text-sm text-green-600">The latest system update has been successfully installed</p>
                    <Button variant="link" className="h-auto p-0 text-green-700">View details</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
