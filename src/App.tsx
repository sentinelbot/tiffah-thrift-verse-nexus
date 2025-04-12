
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages
import Index from './pages/Index';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentConfirmation from './pages/PaymentConfirmation';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderDetail from './pages/OrderDetail';
import Account from './pages/Account';
import Wishlist from './pages/Wishlist';
import CategoryPage from './pages/CategoryPage';
import NewArrivals from './pages/NewArrivals';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import HelpCenter from './pages/HelpCenter';
import Unauthorized from './pages/Unauthorized';

// Admin Pages
import AdminAuth from './pages/AdminAuth';
import AdminRoutes from './routes/AdminRoutes';
import StaffRoutes from './routes/StaffRoutes';

import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <Router>
              <Toaster />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
                <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
                <Route path="/order/:id" element={<OrderDetail />} />
                <Route path="/account" element={<Account />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/category/:category" element={<CategoryPage />} />
                <Route path="/new-arrivals" element={<NewArrivals />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/register" element={<Auth />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminAuth />} />
                <Route path="/admin/*" element={<AdminRoutes />} />
                
                {/* Staff Routes */}
                <Route path="/staff/*" element={<StaffRoutes />} />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
