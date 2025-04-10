import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Package, ClipboardList, Truck, MessageSquare } from 'lucide-react';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Determine available modules based on user role
  const getModules = () => {
    const allModules = [
      {
        title: 'Product Manager',
        description: 'Upload and manage product inventory',
        icon: <Package className="h-8 w-8" />,
        path: '/staff/product-manager',
        role: 'productManager'
      },
      {
        title: 'Order Preparer',
        description: 'Process and prepare orders for delivery',
        icon: <ClipboardList className="h-8 w-8" />,
        path: '/staff/order-preparer',
        role: 'orderPreparer'
      },
      {
        title: 'Delivery Staff',
        description: 'Manage deliveries and track shipments',
        icon: <Truck className="h-8 w-8" />,
        path: '/staff/delivery',
        role: 'deliveryStaff'
      },
      {
        title: 'Communications',
        description: 'Team messaging and announcements',
        icon: <MessageSquare className="h-8 w-8" />,
        path: '/staff/communications',
        role: 'all'
      }
    ];
    
    // If admin, show all modules
    if (user?.role === 'admin') {
      return allModules;
    }
    
    // Otherwise, filter modules based on user role or those marked as 'all'
    return allModules.filter(module => 
      module.role === 'all' || module.role === user?.role
    );
  };
  
  const modules = getModules();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Staff Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name || 'Staff Member'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card key={module.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                {module.icon}
              </div>
              <CardTitle>{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => navigate(module.path)}
              >
                Access Module
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StaffDashboard;
