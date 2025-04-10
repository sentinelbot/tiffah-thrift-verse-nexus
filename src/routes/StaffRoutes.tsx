
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import StaffLayout from '@/components/layout/StaffLayout';

const StaffRoutes = () => {
  const { user } = useAuth();
  
  // Check if user is a staff member
  const isStaff = user && ['productManager', 'orderPreparer', 'deliveryStaff'].includes(user.role);
  
  if (!isStaff) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return (
    <ProtectedRoute
      allowedRoles={['productManager', 'orderPreparer', 'deliveryStaff']}
      redirectPath="/auth"
    >
      <StaffLayout>
        <Outlet />
      </StaffLayout>
    </ProtectedRoute>
  );
};

export default StaffRoutes;
