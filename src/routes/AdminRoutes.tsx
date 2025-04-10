
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Admin Pages
import Dashboard from '@/pages/admin/Dashboard';
import Products from '@/pages/admin/Products';
import ProductForm from '@/pages/admin/ProductForm';
import Categories from '@/pages/admin/Categories';
import Orders from '@/pages/admin/Orders';
import Analytics from '@/pages/admin/Analytics';
import Settings from '@/pages/admin/Settings';
import Printing from '@/pages/admin/Printing';
import Scanning from '@/pages/admin/Scanning';
import Users from '@/pages/admin/Users';
import StaffManagement from '@/pages/admin/StaffManagement';
import UserManagement from '@/pages/admin/UserManagement';
import ContentManagement from '@/pages/admin/ContentManagement';
import Marketing from '@/pages/admin/Marketing';
import AiDashboard from '@/pages/admin/AiDashboard';
import FeatureToggles from '@/pages/admin/FeatureToggles';
import CustomerFeedback from '@/pages/admin/CustomerFeedback';
import Communications from '@/pages/admin/Communications';
import StaffCommunications from '@/pages/admin/StaffCommunications';

const AdminRoutes = () => {
  const { user, isLoading } = useAuth();
  
  // While checking authentication, show nothing
  if (isLoading) {
    return null;
  }
  
  // Check if user is logged in and has admin role
  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');
  
  // If not admin, redirect to unauthorized page
  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/new" element={<ProductForm />} />
      <Route path="/products/edit/:id" element={<ProductForm />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/scanning" element={<Scanning />} />
      <Route path="/printing" element={<Printing />} />
      <Route path="/users" element={<Users />} />
      <Route path="/staff" element={<StaffManagement />} />
      <Route path="/customers" element={<UserManagement />} />
      <Route path="/content" element={<ContentManagement />} />
      <Route path="/marketing" element={<Marketing />} />
      <Route path="/ai-dashboard" element={<AiDashboard />} />
      <Route path="/features" element={<FeatureToggles />} />
      <Route path="/feedback" element={<CustomerFeedback />} />
      <Route path="/communications" element={<Communications />} />
      <Route path="/staff-communications" element={<StaffCommunications />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
