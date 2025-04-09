import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import AdminRoutes from '@/routes/AdminRoutes';
import Products from '@/pages/admin/Products';
import Orders from '@/pages/admin/Orders';
import Scanning from '@/pages/admin/Scanning';
import Analytics from '@/pages/admin/Analytics';
import Staff from '@/pages/admin/Staff';
import Settings from '@/pages/admin/Settings';
import AdminAuth from '@/pages/admin/Auth';
import Unauthorized from '@/pages/Unauthorized';
import ProductDetails from '@/pages/ProductDetails';
import ProductNew from '@/pages/admin/ProductNew';
import ProductEdit from '@/pages/admin/ProductEdit';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/admin/auth" element={<AdminAuth />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="/admin" element={<AdminRoutes />}>
            <Route index element={<Analytics />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="products" element={<Products />} />
            <Route path="products/new" element={<ProductNew />} />
            <Route path="products/:id" element={<ProductEdit />} />
            <Route path="orders" element={<Orders />} />
            <Route path="scanning" element={<Scanning />} />
            <Route path="staff" element={<Staff />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
