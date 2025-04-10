
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/context/CartContext';

// Pages
import Index from '@/pages/Index';
import Shop from '@/pages/Shop';
import ProductDetails from '@/pages/ProductDetails';
import CategoryPage from '@/pages/CategoryPage';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';
import Account from '@/pages/Account';
import OrderDetail from '@/pages/OrderDetail';
import OrderTracking from '@/pages/OrderTracking';
import TrackOrderPage from '@/pages/TrackOrderPage';
import Wishlist from '@/pages/Wishlist';
import Auth from '@/pages/Auth';
import AdminAuth from '@/pages/AdminAuth';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';
import HelpCenter from '@/pages/HelpCenter';

// Admin pages
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
import FeatureToggles from '@/pages/admin/FeatureToggles';
import Communications from '@/pages/admin/Communications';
import ContentManagement from '@/pages/admin/ContentManagement';
import StaffCommunications from '@/pages/admin/StaffCommunications';
import CustomerFeedback from '@/pages/admin/CustomerFeedback';
import UserManagement from '@/pages/admin/UserManagement';

// Staff pages
import StaffDashboard from '@/pages/staff/Dashboard';
import ProductManager from '@/pages/staff/ProductManager';
import OrderPreparer from '@/pages/staff/OrderPreparer';
import DeliveryStaff from '@/pages/staff/DeliveryStaff';
import StaffProfile from '@/pages/staff/Profile';
import StaffCommunicationsPage from '@/pages/staff/Communications';
import StaffSchedule from '@/pages/staff/Schedule';
import StaffTraining from '@/pages/staff/Training';

// Components
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminRoutes from '@/routes/AdminRoutes';
import StaffRoutes from '@/routes/StaffRoutes';
import { ConnectivityIndicator } from '@/components/ui/connectivity-indicator';
import HelpButton from '@/components/help/HelpButton';

// Initialize offline service
import { initializeOfflineService } from '@/services/offlineService';
import { recordPageLoadTime } from '@/services/analyticsService';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: true,
    },
  },
});

function App() {
  useEffect(() => {
    // Initialize offline capabilities
    initializeOfflineService().catch(console.error);
    
    // Record initial page load time
    recordPageLoadTime();
    
    // Add meta theme-color for PWA
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#ec4899';
    document.head.appendChild(meta);
    
    // Add link to manifest
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/manifest.json';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(meta);
      document.head.removeChild(link);
    };
  }, []);
  
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
                <Route path="/track" element={<TrackOrderPage />} />
                <Route path="/track/:orderNumber" element={<OrderTracking />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin/auth" element={<AdminAuth />} />
                <Route path="/help" element={<HelpCenter />} />
                
                {/* Protected customer routes */}
                <Route element={<ProtectedRoute allowedRoles={['customer', 'admin', 'productManager', 'orderPreparer', 'deliveryStaff']} />}>
                  <Route path="/account" element={<Account />} />
                  <Route path="/orders/:id" element={<OrderDetail />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                </Route>
                
                {/* Protected admin routes */}
                <Route path="/admin" element={<AdminRoutes />}>
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/new" element={<ProductForm />} />
                  <Route path="products/:id" element={<ProductForm />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="printing" element={<Printing />} />
                  <Route path="scanning" element={<Scanning />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="marketing" element={<Marketing />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="customer-feedback" element={<CustomerFeedback />} />
                  <Route path="ai" element={<AiDashboard />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="staff" element={<StaffManagement />} />
                  <Route path="content" element={<ContentManagement />} />
                  <Route path="features" element={<FeatureToggles />} />
                  <Route path="communications" element={<StaffCommunications />} />
                </Route>
                
                {/* Protected staff routes */}
                <Route path="/staff" element={<StaffRoutes />}>
                  <Route index element={<StaffDashboard />} />
                  
                  {/* Product Manager Routes */}
                  <Route path="products" element={<ProductManager />} />
                  <Route path="products/new" element={<ProductManager />} />
                  <Route path="products/:id" element={<ProductManager />} />
                  
                  {/* Order Preparer Routes */}
                  <Route path="orders" element={<OrderPreparer />} />
                  
                  {/* Delivery Staff Routes */}
                  <Route path="deliveries" element={<DeliveryStaff />} />
                  
                  {/* Common Staff Routes */}
                  <Route path="profile" element={<StaffProfile />} />
                  <Route path="communications" element={<StaffCommunicationsPage />} />
                  <Route path="schedule" element={<StaffSchedule />} />
                  <Route path="training" element={<StaffTraining />} />
                </Route>
                
                {/* Error routes */}
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              {/* Help Button */}
              <HelpButton />
              
              {/* Connectivity indicator */}
              <ConnectivityIndicator />
              
              {/* Toast notifications */}
              <Toaster position="top-right" />
            </Router>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
