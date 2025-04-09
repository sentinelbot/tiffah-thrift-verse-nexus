
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/context/CartContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useState } from "react";
import Index from "./pages/Index";
import ProductDetails from "./pages/ProductDetails";
import NotFound from "./pages/NotFound";
import Shop from "./pages/Shop";
import CategoryPage from "./pages/CategoryPage";
import NewArrivals from "./pages/NewArrivals";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Account from "./pages/Account";
import Auth from "./pages/Auth";
import Unauthorized from "./pages/Unauthorized";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderDetail from "./pages/OrderDetail";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import Categories from "./pages/admin/Categories";
import Users from "./pages/admin/Users";

const App = () => {
  // Create a new QueryClient instance inside the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/category/:categoryId" element={<CategoryPage />} />
                <Route path="/new-arrivals" element={<NewArrivals />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/wishlist" element={<Wishlist />} />
                
                {/* Protected Customer Routes */}
                <Route 
                  path="/account" 
                  element={
                    <ProtectedRoute allowedRoles={['customer', 'admin', 'productManager', 'orderPreparer', 'deliveryStaff']}>
                      <Account />
                    </ProtectedRoute>
                  } 
                />
                <Route
                  path="/order-confirmation"
                  element={<OrderConfirmation />}
                />
                <Route
                  path="/order/:id"
                  element={
                    <ProtectedRoute allowedRoles={['customer', 'admin', 'productManager', 'orderPreparer', 'deliveryStaff']}>
                      <OrderDetail />
                    </ProtectedRoute>
                  }
                />
                
                <Route path="/auth" element={<Auth />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Admin Routes - Protected */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'productManager', 'orderPreparer', 'deliveryStaff']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/products" 
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'productManager']}>
                      <Products />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/products/new" 
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'productManager']}>
                      <ProductForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/products/:id" 
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'productManager']}>
                      <ProductForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/categories" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Categories />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Users />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Catch-all route - 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
