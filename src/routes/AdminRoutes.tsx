
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AdminRoutes = () => {
  const { user, isLoading } = useAuth();
  
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
  
  // If user is not admin, redirect to unauthorized
  if (!user || user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // Return an outlet for nested routes
  return <Outlet />;
};

export default AdminRoutes;
