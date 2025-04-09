
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Admin Pages
import Dashboard from '@/pages/admin/Dashboard';
import Products from '@/pages/admin/Products';
import ProductForm from '@/pages/admin/ProductForm';
import Orders from '@/pages/admin/Orders';
import Categories from '@/pages/admin/Categories';
import Printing from '@/pages/admin/Printing';
import Scanning from '@/pages/admin/Scanning';
import Marketing from '@/pages/admin/Marketing';
import Users from '@/pages/admin/Users';
import AiDashboard from '@/pages/admin/AiDashboard';
import Analytics from '@/pages/admin/Analytics';
import Settings from '@/pages/admin/Settings';
import StaffManagement from '@/pages/admin/StaffManagement';
import ContentManagement from '@/pages/admin/ContentManagement';
import FeatureToggles from '@/pages/admin/FeatureToggles';
import Communications from '@/pages/admin/Communications';

const AdminRoutes = () => {
  const { user } = useAuth();
  
  // If user is not admin, redirect to unauthorized
  if (user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return (
    <>
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/products" element={<Products />} />
      <Route path="/admin/products/new" element={<ProductForm />} />
      <Route path="/admin/products/:id" element={<ProductForm />} />
      <Route path="/admin/orders" element={<Orders />} />
      <Route path="/admin/categories" element={<Categories />} />
      <Route path="/admin/printing" element={<Printing />} />
      <Route path="/admin/scanning" element={<Scanning />} />
      <Route path="/admin/analytics" element={<Analytics />} />
      <Route path="/admin/marketing" element={<Marketing />} />
      <Route path="/admin/users" element={<Users />} />
      <Route path="/admin/ai" element={<AiDashboard />} />
      <Route path="/admin/settings" element={<Settings />} />
      <Route path="/admin/staff" element={<StaffManagement />} />
      <Route path="/admin/content" element={<ContentManagement />} />
      <Route path="/admin/features" element={<FeatureToggles />} />
      <Route path="/admin/communications" element={<Communications />} />
    </>
  );
};

export default AdminRoutes;
