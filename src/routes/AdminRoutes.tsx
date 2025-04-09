
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const AdminRoutes = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  // Show loading indicator while authentication status is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }
  
  // If user is not logged in, redirect to admin login
  if (!user) {
    // Save the attempted URL for redirecting after login
    toast.error("Please sign in to access the admin panel");
    return <Navigate to={`/admin/auth?from=${encodeURIComponent(location.pathname)}`} replace />;
  }
  
  // If user is not admin, handle appropriately
  if (user.role !== 'admin') {
    // If user has staff role, redirect to staff dashboard
    if (['productManager', 'orderPreparer', 'deliveryStaff'].includes(user.role)) {
      toast.info("Redirecting to staff dashboard based on your role");
      return <Navigate to="/staff" replace />;
    }
    
    // If user is a regular customer, redirect to unauthorized page
    toast.error("You don't have permission to access the admin panel");
    return <Navigate to="/unauthorized" replace />;
  }
  
  // Return an outlet for nested routes
  return <Outlet />;
};

export default AdminRoutes;
