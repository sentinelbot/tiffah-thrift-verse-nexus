
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Define which routes each staff role can access
const roleAccessMap: Record<string, string[]> = {
  'admin': ['*'], // Admin can access all routes
  'productManager': ['/staff/products', '/staff/categories', '/staff/ai', '/staff/printing', '/staff/scanning', '/staff/communications'],
  'orderPreparer': ['/staff/orders', '/staff/printing', '/staff/scanning', '/staff/communications'],
  'deliveryStaff': ['/staff/deliveries', '/staff/printing', '/staff/scanning', '/staff/communications'],
};

// Routes that all staff can access
const commonStaffRoutes = ['/staff', '/staff/profile', '/staff/schedule', '/staff/training'];

const StaffRoutes = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Show loading indicator while authentication status is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Verifying staff access...</p>
        </div>
      </div>
    );
  }
  
  // If user is not logged in, redirect to login
  if (!user) {
    toast.error("Please sign in to access the staff dashboard");
    return <Navigate to={`/auth?from=${encodeURIComponent(location.pathname)}`} replace />;
  }
  
  // If user is not a staff member, redirect to unauthorized
  if (!['admin', 'productManager', 'orderPreparer', 'deliveryStaff'].includes(user.role)) {
    toast.error("You don't have permission to access the staff dashboard");
    return <Navigate to="/unauthorized" replace />;
  }
  
  // If admin, allow them to view staff routes but redirect to admin dashboard if they try to access staff home
  if (user.role === 'admin') {
    if (currentPath === '/staff') {
      toast.info("Redirecting to admin dashboard");
      return <Navigate to="/admin" replace />;
    }
    return <Outlet />;
  }
  
  // Check if current path is allowed for user's role
  const allowedPaths = [...(roleAccessMap[user.role] || []), ...commonStaffRoutes];
  const hasAccess = allowedPaths.some(path => {
    if (path === '*') return true;
    return currentPath.startsWith(path);
  });
  
  // If not allowed, redirect to appropriate dashboard
  if (!hasAccess) {
    let redirectPath = '/unauthorized';
    
    // Redirect to their role-specific dashboard
    switch (user.role) {
      case 'productManager':
        redirectPath = '/staff/products';
        break;
      case 'orderPreparer':
        redirectPath = '/staff/orders';
        break;
      case 'deliveryStaff':
        redirectPath = '/staff/deliveries';
        break;
    }
    
    toast.info("Redirecting to your authorized dashboard");
    return <Navigate to={redirectPath} replace />;
  }
  
  // Return outlet for nested routes
  return <Outlet />;
};

export default StaffRoutes;
