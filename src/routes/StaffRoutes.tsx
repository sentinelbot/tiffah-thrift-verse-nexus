
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Define which routes each staff role can access
const roleAccessMap: Record<string, string[]> = {
  'admin': ['*'], // Admin can access all routes
  'productManager': ['/staff/products', '/staff/categories', '/staff/ai', '/staff/printing', '/staff/scanning', '/staff/communications'],
  'orderPreparer': ['/staff/orders', '/staff/printing', '/staff/scanning', '/staff/communications'],
  'deliveryStaff': ['/staff/orders', '/staff/printing', '/staff/scanning', '/staff/communications'],
};

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
  
  // If user is not logged in or not a staff member, redirect to login
  if (!user || !['admin', 'productManager', 'orderPreparer', 'deliveryStaff'].includes(user.role)) {
    // Save the attempted URL for redirecting after login
    return <Navigate to={`/auth?from=${encodeURIComponent(location.pathname)}`} replace />;
  }
  
  // If admin, allow access to all routes
  if (user.role === 'admin') {
    return <Outlet />;
  }
  
  // Check if current path is allowed for user's role
  const allowedPaths = roleAccessMap[user.role] || [];
  const hasAccess = allowedPaths.some(path => {
    if (path === '*') return true;
    return currentPath.startsWith(path);
  });
  
  // If not allowed, redirect to appropriate dashboard
  if (!hasAccess) {
    // Redirect to their role-specific dashboard or main admin page
    switch (user.role) {
      case 'productManager':
        return <Navigate to="/staff/products" replace />;
      case 'orderPreparer':
        return <Navigate to="/staff/orders" replace />;
      case 'deliveryStaff':
        return <Navigate to="/staff/orders" replace />;
      default:
        return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // Return outlet for nested routes
  return <Outlet />;
};

export default StaffRoutes;
