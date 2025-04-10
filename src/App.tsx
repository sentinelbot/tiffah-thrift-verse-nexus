
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import AdminRoutes from '@/routes/AdminRoutes';
import StaffRoutes from '@/routes/StaffRoutes';
import Products from '@/pages/admin/Products';
import Orders from '@/pages/admin/Orders';
import Scanning from '@/pages/admin/Scanning';
import Analytics from '@/pages/admin/Analytics';
import Staff from '@/components/admin/staff/StaffManagement';
import Settings from '@/pages/admin/Settings';
import AdminAuth from '@/pages/admin/Auth';
import Auth from '@/pages/Auth';
import Unauthorized from '@/pages/Unauthorized';
import ProductDetails from '@/pages/ProductDetails';
import ProductNew from '@/pages/admin/ProductNew';
import ProductEdit from '@/pages/admin/ProductEdit';
import Dashboard from '@/pages/staff/Dashboard';
import ProductManager from '@/pages/staff/ProductManager';
import OrderPreparer from '@/pages/staff/OrderPreparer';
import DeliveryStaff from '@/pages/staff/DeliveryStaff';
import StaffProfile from '@/pages/staff/Profile';
import Communications from '@/pages/staff/Communications';
import Schedule from '@/pages/staff/Schedule';
import OrderDetail from '@/pages/OrderDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/admin/auth" element={<AdminAuth />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoutes />}>
            <Route index element={<Analytics />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="products" element={<Products />} />
            <Route path="products/new" element={<ProductNew />} />
            <Route path="products/:id" element={<ProductEdit />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="scanning" element={<Scanning />} />
            <Route path="staff" element={<Staff />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Staff Routes */}
          <Route path="/staff" element={<StaffRoutes />}>
            <Route index element={<Dashboard />} />
            <Route path="product-manager" element={<ProductManager />} />
            <Route path="order-preparer" element={<OrderPreparer />} />
            <Route path="delivery-staff" element={<DeliveryStaff />} />
            <Route path="scanning" element={<Scanning />} />
            <Route path="profile" element={<StaffProfile />} />
            <Route path="communications" element={<Communications />} />
            <Route path="schedule" element={<Schedule />} />
          </Route>

          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/order/:id" element={<OrderDetail />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
