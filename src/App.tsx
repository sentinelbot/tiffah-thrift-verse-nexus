
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { ThemeProvider } from '@/components/ui/theme-provider';

// Base Layout Components
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Pages
import Index from '@/pages/Index';
import Shop from '@/pages/Shop';
import ProductDetails from '@/pages/ProductDetails';
import CategoryPage from '@/pages/CategoryPage';
import NewArrivals from '@/pages/NewArrivals';
import Cart from '@/pages/Cart';
import Wishlist from '@/pages/Wishlist';
import Checkout from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';
import OrderDetail from '@/pages/OrderDetail';
import Account from '@/pages/Account';
import Auth from '@/pages/Auth';
import HelpCenter from '@/pages/HelpCenter';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';

// Admin Routes
import AdminRoutes from '@/routes/AdminRoutes';

// Staff Routes
import StaffRoutes from '@/routes/StaffRoutes';

// Protected Route Component
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Initialize services
import { initializeOfflineService } from '@/services/offlineService';

// Initialize offline capability
initializeOfflineService().catch(console.error);

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="tiffah-ui-theme">
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/category/:id" element={<CategoryPage />} />
                <Route path="/new-arrivals" element={<NewArrivals />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Protected Customer Routes */}
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/order-confirmation/:id" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
                <Route path="/order/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                <Route path="/account/*" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                
                {/* Admin Routes */}
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute 
                      requiredRoles={['admin', 'superadmin']}
                      redirectTo="/unauthorized"
                    >
                      <AdminRoutes />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Staff Routes */}
                <Route 
                  path="/staff/*" 
                  element={
                    <ProtectedRoute 
                      requiredRoles={['admin', 'productManager', 'orderPreparer', 'deliveryStaff']}
                      redirectTo="/unauthorized"
                    >
                      <StaffRoutes />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Fallback */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </main>
            <Footer />
            <Toaster />
            <SonnerToaster position="top-right" closeButton />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
