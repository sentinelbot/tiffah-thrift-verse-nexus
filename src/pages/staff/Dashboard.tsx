
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Package, Clock, ShoppingBag, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const StaffDashboard = () => {
  const { user } = useAuth();
  
  // Stats based on staff role
  const getRoleBasedStats = () => {
    switch (user?.role) {
      case 'productManager':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">86</CardTitle>
                <CardDescription>Products Processed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Package className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-xs text-muted-foreground">
                    48 added this month
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">14.2 min</CardTitle>
                <CardDescription>Average Processing Time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-xs text-muted-foreground">
                    -2.1 min from last week
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">12</CardTitle>
                <CardDescription>Scheduled For Today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-green-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-xs">On track</span>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'orderPreparer':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">8</CardTitle>
                <CardDescription>Pending Orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="text-xs text-muted-foreground">
                    Awaiting processing
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">15</CardTitle>
                <CardDescription>Processed Today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-muted-foreground">
                    +3 more than yesterday
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">6.4 min</CardTitle>
                <CardDescription>Average Time Per Order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-xs text-muted-foreground">
                    On target for daily goal
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'deliveryStaff':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">6</CardTitle>
                <CardDescription>Orders To Deliver</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-xs text-muted-foreground">
                    Scheduled for today
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">4 / 10</CardTitle>
                <CardDescription>Delivered Today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-muted-foreground">
                    40% completed
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">28 min</CardTitle>
                <CardDescription>Average Delivery Time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-xs text-muted-foreground">
                    -5 min from target
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };
  
  const getQuickActions = () => {
    switch (user?.role) {
      case 'productManager':
        return (
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/staff/products/new">Add New Product</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/staff/scanning">Scan Product</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/staff/ai">Use AI Tools</Link>
            </Button>
          </div>
        );
      case 'orderPreparer':
        return (
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/staff/orders">Process Orders</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/staff/scanning">Scan Order</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/staff/printing">Print Receipt</Link>
            </Button>
          </div>
        );
      case 'deliveryStaff':
        return (
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/staff/deliveries">View Deliveries</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/staff/scanning">Scan Package</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/staff/printing">Print Delivery Label</Link>
            </Button>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Staff Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}. Here's your overview for today.</p>
        </div>
        <div className="mt-4 md:mt-0">
          {getQuickActions()}
        </div>
      </div>
      
      {getRoleBasedStats()}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent tasks and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Task completed</p>
                  <p className="text-sm text-muted-foreground">You processed order #TTS-20250409-1234</p>
                  <p className="text-xs text-muted-foreground">10 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">New item added</p>
                  <p className="text-sm text-muted-foreground">You added "Vintage Denim Jacket" to inventory</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Performance notification</p>
                  <p className="text-sm text-muted-foreground">Your processing speed improved by 12% this week</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
            <CardDescription>Your upcoming shifts and tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Today, 2:00 PM - 7:00 PM</p>
                  <p className="text-sm text-muted-foreground">Regular shift</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Tomorrow, 9:00 AM - 3:00 PM</p>
                  <p className="text-sm text-muted-foreground">Processing new arrivals</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium">Team meeting</p>
                  <p className="text-sm text-muted-foreground">Friday, 10:00 AM - Weekly review</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/staff/schedule">View Full Schedule</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StaffDashboard;
