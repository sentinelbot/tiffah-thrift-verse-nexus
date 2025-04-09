
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
import Wishlist from '@/pages/Wishlist';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';

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

// Staff pages
import StaffDashboard from '@/pages/staff/Dashboard';
import ProductManager from '@/pages/staff/ProductManager';
import OrderPreparer from '@/pages/staff/OrderPreparer';
import DeliveryStaff from '@/pages/staff/DeliveryStaff';
import StaffProfile from '@/pages/staff/Profile';
import StaffCommunications from '@/pages/staff/Communications';
import StaffSchedule from '@/pages/staff/Schedule';
import StaffTraining from '@/pages/staff/Training';

// Components
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ConnectivityIndicator } from '@/components/ui/connectivity-indicator';

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
                <Route path="/auth" element={<Auth />} />
                
                {/* Protected customer routes */}
                <Route element={<ProtectedRoute allowedRoles={['customer', 'admin']} />}>
                  <Route path="/account" element={<Account />} />
                  <Route path="/orders/:id" element={<OrderDetail />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                </Route>
                
                {/* Protected admin routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
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
                  <Route path="/admin/features" element={<FeatureToggles />} />
                  <Route path="/admin/communications" element={<Communications />} />
                  <Route path="/admin/content" element={<ContentManagement />} />
                </Route>
                
                {/* Protected staff routes */}
                <Route element={<ProtectedRoute allowedRoles={['productManager', 'orderPreparer', 'deliveryStaff']} />}>
                  <Route path="/staff" element={<StaffDashboard />} />
                  
                  {/* Product Manager Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['productManager']} />}>
                    <Route path="/staff/products" element={<ProductManager />} />
                    <Route path="/staff/products/new" element={<ProductManager />} />
                    <Route path="/staff/products/:id" element={<ProductManager />} />
                  </Route>
                  
                  {/* Order Preparer Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['orderPreparer']} />}>
                    <Route path="/staff/orders" element={<OrderPreparer />} />
                  </Route>
                  
                  {/* Delivery Staff Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['deliveryStaff']} />}>
                    <Route path="/staff/deliveries" element={<DeliveryStaff />} />
                  </Route>
                  
                  {/* Common Staff Routes */}
                  <Route path="/staff/profile" element={<StaffProfile />} />
                  <Route path="/staff/communications" element={<StaffCommunications />} />
                  <Route path="/staff/schedule" element={<StaffSchedule />} />
                  <Route path="/staff/training" element={<StaffTraining />} />
                </Route>
                
                {/* Error routes */}
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              
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
