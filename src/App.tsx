
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
import Shop from '@/pages/Shop';
import CategoryPage from '@/pages/CategoryPage';
import Cart from '@/pages/Cart';
import Wishlist from '@/pages/Wishlist';
import Checkout from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';
import OrderDetail from '@/pages/OrderDetail';
import Account from '@/pages/Account';
import NotFound from '@/pages/NotFound';
import Printing from '@/pages/admin/Printing';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/shipping" element={<ShippingReturns />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          
          {/* Shop Routes */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/order/:id" element={<OrderDetail />} />
          
          {/* User Account Routes */}
          <Route path="/account" element={<Account />} />
          
          {/* Admin Authentication */}
          <Route path="/admin/auth" element={<AdminAuth />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoutes />}>
            <Route index element={<Analytics />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="products" element={<Products />} />
            <Route path="products/new" element={<ProductNew />} />
            <Route path="products/:id" element={<ProductEdit />} />
            <Route path="orders" element={<Orders />} />
            <Route path="scanning" element={<Scanning />} />
            <Route path="printing" element={<Printing />} />
            <Route path="staff" element={<Staff />} />
            <Route path="users" element={<Users />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Catch all for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
