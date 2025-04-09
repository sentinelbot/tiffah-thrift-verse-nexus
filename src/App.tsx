
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
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
import CustomerServiceChat from "./components/customer-service/CustomerServiceChat";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import Categories from "./pages/admin/Categories";
import Users from "./pages/admin/Users";
import Orders from "./pages/admin/Orders";
import Printing from "./pages/admin/Printing";
import Scanning from "./pages/admin/Scanning";
import AiDashboard from "./pages/admin/AiDashboard";
import Marketing from "./pages/admin/Marketing";

function App() {
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
                <Route path="/new-arrivals" element={<NewArrivals />} />
                <Route path="/category/:id" element={<CategoryPage />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Protected Customer Routes */}
                <Route element={<ProtectedRoute allowedRoles={['customer', 'admin']}>
                  <Outlet />
                </ProtectedRoute>}>
                  <Route path="/account" element={<Account />} />
                  <Route path="/order/:id" element={<OrderDetail />} />
                </Route>
                
                {/* Protected Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin', 'productManager', 'orderPreparer', 'deliveryStaff']}>
                  <Outlet />
                </ProtectedRoute>}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/products" element={<Products />} />
                  <Route path="/admin/products/new" element={<ProductForm />} />
                  <Route path="/admin/products/:id" element={<ProductForm />} />
                  <Route path="/admin/categories" element={<Categories />} />
                  <Route path="/admin/orders" element={<Orders />} />
                  <Route path="/admin/users" element={<Users />} />
                  <Route path="/admin/printing" element={<Printing />} />
                  <Route path="/admin/scanning" element={<Scanning />} />
                  <Route path="/admin/ai" element={<AiDashboard />} />
                  <Route path="/admin/marketing" element={<Marketing />} />
                </Route>
                
                {/* Error Routes */}
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<NotFound />} />
              </Routes>

              {/* Global customer service chat widget */}
              <CustomerServiceChat />
            </TooltipProvider>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
