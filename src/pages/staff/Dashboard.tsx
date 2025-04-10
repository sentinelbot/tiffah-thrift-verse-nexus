
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, CheckSquare, PackageCheck, Truck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Role-specific content
  const getRoleContent = () => {
    switch(user?.role) {
      case 'productManager':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Products Added Today</CardTitle>
                <CardDescription>Total new inventory processed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mt-1">+20% from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Images Processed</CardTitle>
                <CardDescription>Product photos uploaded</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">48</div>
                <p className="text-xs text-muted-foreground mt-1">+5% from yesterday</p>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'orderPreparer':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Orders to Prepare</CardTitle>
                <CardDescription>Pending order preparation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">7</div>
                <p className="text-xs text-muted-foreground mt-1">3 high priority</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Orders Completed</CardTitle>
                <CardDescription>Today's fulfilled orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">15</div>
                <p className="text-xs text-muted-foreground mt-1">+3 from yesterday</p>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'deliveryStaff':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Pending Deliveries</CardTitle>
                <CardDescription>Orders ready for delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5</div>
                <p className="text-xs text-muted-foreground mt-1">2 express deliveries</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Completed Today</CardTitle>
                <CardDescription>Successfully delivered orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8</div>
                <p className="text-xs text-muted-foreground mt-1">100% on-time rate</p>
              </CardContent>
            </Card>
          </div>
        );
        
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Welcome</CardTitle>
              <CardDescription>Your role-specific dashboard is not available</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Please contact an administrator to update your role permissions.</p>
            </CardContent>
          </Card>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || 'Staff Member'}
        </p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <PackageCheck className="h-10 w-10 text-primary" />
            <div>
              <p className="text-sm font-medium">New Orders</p>
              <h3 className="text-2xl font-bold">18</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <CheckSquare className="h-10 w-10 text-primary" />
            <div>
              <p className="text-sm font-medium">Processing</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <Truck className="h-10 w-10 text-primary" />
            <div>
              <p className="text-sm font-medium">Deliveries</p>
              <h3 className="text-2xl font-bold">7</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <CalendarClock className="h-10 w-10 text-primary" />
            <div>
              <p className="text-sm font-medium">Today's Tasks</p>
              <h3 className="text-2xl font-bold">5</h3>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Role-specific dashboard content */}
      {getRoleContent()}
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest actions and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
              <div>
                <p className="font-medium">Order #TTS-20250409-1234 has been assigned to you</p>
                <p className="text-sm text-muted-foreground">10 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
              <div>
                <p className="font-medium">You completed processing Order #TTS-20250409-0987</p>
                <p className="text-sm text-muted-foreground">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
              <div>
                <p className="font-medium">New message from Admin regarding inventory update</p>
                <p className="text-sm text-muted-foreground">3 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
