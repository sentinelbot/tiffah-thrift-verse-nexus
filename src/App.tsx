
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import AdminRoutes from '@/routes/AdminRoutes';
import Products from '@/pages/admin/Products';
import Orders from '@/pages/admin/Orders';
import Scanning from '@/pages/admin/Scanning';
import Analytics from '@/pages/admin/Analytics';
import Staff from '@/pages/admin/Staff';
import Users from '@/pages/admin/Users';
import Settings from '@/pages/admin/Settings';
import AdminAuth from '@/pages/admin/Auth';
import Unauthorized from '@/pages/Unauthorized';
import ProductDetails from '@/pages/ProductDetails';
import ProductNew from '@/pages/admin/ProductNew';
import ProductEdit from '@/pages/admin/ProductEdit';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import FAQ from '@/pages/FAQ';
import ShippingReturns from '@/pages/ShippingReturns';
import Terms from '@/pages/Terms';
import PrivacyPolicy from '@/pages/PrivacyPolicy';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shipping" element={<ShippingReturns />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          
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
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
