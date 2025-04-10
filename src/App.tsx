
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';

// Public Pages
import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import CategoryPage from '@/pages/CategoryPage';
import ProductPage from '@/pages/ProductPage';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Account from '@/pages/Account';
import OrderDetails from '@/pages/OrderDetails';
import AboutUs from '@/pages/AboutUs';
import ContactUs from '@/pages/ContactUs';
import Auth from '@/pages/Auth';
import AdminAuth from '@/pages/AdminAuth';
import Unauthorized from '@/pages/Unauthorized';

// Protected Routes
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminRoutes from '@/routes/AdminRoutes';
import StaffRoutes from '@/routes/StaffRoutes';

// Admin Pages
import Dashboard from '@/pages/admin/Dashboard';
import Users from '@/pages/admin/Users';
import UserManagement from '@/pages/admin/UserManagement';
import Orders from '@/pages/admin/Orders';
import Scanning from '@/pages/admin/Scanning';
import SettingsPage from '@/pages/admin/Settings';

// Staff Pages
import ProductManager from '@/pages/staff/ProductManager';
import OrderPreparer from '@/pages/staff/OrderPreparer';
import DeliveryStaff from '@/pages/staff/DeliveryStaff';
import StaffScanningPage from '@/pages/staff/Scanning';
import Communications from '@/pages/staff/Communications';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/product/:productId" element={<ProductPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/auth" element={<AdminAuth />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected Customer Routes */}
            <Route 
              path="/account" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'customer', 'productManager', 'orderPreparer', 'deliveryStaff']}>
                  <Account />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/orders/:orderId" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'customer', 'productManager', 'orderPreparer', 'deliveryStaff']}>
                  <OrderDetails />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoutes />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route path="orders" element={<Orders />} />
              <Route path="products" element={<Dashboard />} />
              <Route path="deliveries" element={<Dashboard />} />
              <Route path="scanning" element={<Scanning />} />
              <Route path="reports" element={<Dashboard />} />
              <Route path="marketing" element={<Dashboard />} />
              <Route path="store" element={<Dashboard />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            
            {/* Staff Routes */}
            <Route path="/staff" element={<StaffRoutes />}>
              <Route index element={<Navigate to="/staff/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ProductManager />} />
              <Route path="orders" element={<OrderPreparer />} />
              <Route path="deliveries" element={<DeliveryStaff />} />
              <Route path="scanning" element={<StaffScanningPage />} />
              <Route path="communications" element={<Communications />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            
            {/* Fallback route for unmatched paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster richColors />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
