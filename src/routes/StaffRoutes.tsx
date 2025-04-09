
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Staff Pages imports
import StaffDashboard from '@/pages/staff/Dashboard';
import ProductManager from '@/pages/staff/ProductManager';
import OrderPreparer from '@/pages/staff/OrderPreparer';
import DeliveryStaff from '@/pages/staff/DeliveryStaff';
import StaffProfile from '@/pages/staff/Profile';
import StaffCommunications from '@/pages/staff/Communications';
import StaffSchedule from '@/pages/staff/Schedule';
import StaffTraining from '@/pages/staff/Training';

const StaffRoutes = () => {
  const { user } = useAuth();
  
  // If user is not staff, redirect to unauthorized
  if (!user || (user.role !== 'productManager' && user.role !== 'orderPreparer' && user.role !== 'deliveryStaff')) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return (
    <>
      <Route path="/staff" element={<StaffDashboard />} />
      
      {/* Product Manager Routes */}
      {user.role === 'productManager' && (
        <>
          <Route path="/staff/products" element={<ProductManager />} />
          <Route path="/staff/products/new" element={<ProductManager />} />
          <Route path="/staff/products/:id" element={<ProductManager />} />
        </>
      )}
      
      {/* Order Preparer Routes */}
      {user.role === 'orderPreparer' && (
        <Route path="/staff/orders" element={<OrderPreparer />} />
      )}
      
      {/* Delivery Staff Routes */}
      {user.role === 'deliveryStaff' && (
        <Route path="/staff/deliveries" element={<DeliveryStaff />} />
      )}
      
      {/* Common Staff Routes */}
      <Route path="/staff/profile" element={<StaffProfile />} />
      <Route path="/staff/communications" element={<StaffCommunications />} />
      <Route path="/staff/schedule" element={<StaffSchedule />} />
      <Route path="/staff/training" element={<StaffTraining />} />
    </>
  );
};

export default StaffRoutes;
