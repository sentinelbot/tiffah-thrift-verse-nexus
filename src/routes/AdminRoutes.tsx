
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AdminRoutes = () => {
  const { user } = useAuth();
  
  // If user is not admin, redirect to unauthorized
  if (user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // Return an outlet for nested routes
  return <Outlet />;
};

export default AdminRoutes;
