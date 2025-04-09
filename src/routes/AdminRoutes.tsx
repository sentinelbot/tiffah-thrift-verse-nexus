
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const AdminRoutes = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  // Check if the user is on the unauthorized page and try to refresh their role
  useEffect(() => {
    const checkAndRefreshRole = async () => {
      if (user && user.role !== 'admin' && location.pathname === '/unauthorized') {
        try {
          // Get fresh user data from the database
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;
          
          if (data && data.role === 'admin') {
            // Role has been updated in the database but not in the local state
            // Refresh the page to update the user context
            window.location.href = '/admin';
          }
        } catch (error) {
          console.error('Error refreshing role:', error);
        }
      }
    };
    
    if (!isLoading && user) {
      checkAndRefreshRole();
    }
  }, [user, isLoading, location.pathname]);
  
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
