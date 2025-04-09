
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const StaffRoutes = () => {
  const { user } = useAuth();
  
  // If user is not staff, redirect to unauthorized
  if (!user || (user.role !== 'productManager' && user.role !== 'orderPreparer' && user.role !== 'deliveryStaff')) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // Return an outlet for nested routes
  return <Outlet />;
};

export default StaffRoutes;
