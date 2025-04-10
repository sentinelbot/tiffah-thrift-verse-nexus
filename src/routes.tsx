
import { createBrowserRouter } from "react-router-dom";
import App from "./App";

// Import all page components individually 
import Index from "./pages/Index";
import ProductDetails from "./pages/ProductDetails"; 
import TrackOrderPage from "./pages/TrackOrderPage";
import Products from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import AdminDashboard from "./pages/admin/Dashboard";
import ProductManager from "./pages/staff/ProductManager";
import InventoryManagement from "./pages/admin/InventoryManagement";
import Orders from "./pages/admin/Orders";
import Printing from "./pages/admin/Printing";
import StaffCommunications from "./pages/admin/StaffCommunications";
import OrderPreparer from "./pages/staff/OrderPreparer";
import DeliveryStaff from "./pages/staff/DeliveryStaff";
import StaffDashboard from "./pages/staff/Dashboard";
import Marketing from "./pages/admin/Marketing";
import Communications from "./pages/staff/Communications";
import AdminRoutes from "./routes/AdminRoutes";
import StaffRoutes from "./routes/StaffRoutes";
import DeliveryReports from "./pages/staff/DeliveryReports";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./context/CartContext";
import Users from "./pages/admin/Users";
import NotFound from "./pages/NotFound";
import HomePage from "./components/home/HomePage";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Shop from "./pages/Shop";

// Create the router with App as the root element
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
      },
      {
        path: "shop",
        element: <Shop />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "wishlist",
        element: <Wishlist />,
      },
      {
        path: "track",
        element: <TrackOrderPage />,
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "admin/auth",
        element: <AdminAuth />,
      },
      {
        path: "unauthorized",
        element: <Unauthorized />,
      },
      {
        path: "admin",
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: "products",
            element: <Products />,
          },
          {
            path: "products/new",
            element: <ProductForm />,
          },
          {
            path: "products/:id",
            element: <ProductForm />,
          },
          {
            path: "inventory",
            element: <InventoryManagement />,
          },
          {
            path: "orders",
            element: <Orders />,
          },
          {
            path: "printing",
            element: <Printing />,
          },
          {
            path: "communications",
            element: <StaffCommunications />,
          },
          {
            path: "marketing",
            element: <Marketing />,
          },
          {
            path: "users",
            element: <Users />,
          },
        ],
      },
      {
        path: "staff",
        element: <ProtectedRoute allowedRoles={['productManager', 'orderPreparer', 'deliveryStaff']} />,
        children: [
          {
            index: true,
            element: <StaffDashboard />,
          },
          {
            path: "product-manager",
            element: <ProtectedRoute allowedRoles={['productManager']} redirectPath="/staff">
              <ProductManager />
            </ProtectedRoute>,
          },
          {
            path: "order-preparer",
            element: <ProtectedRoute allowedRoles={['orderPreparer']} redirectPath="/staff">
              <OrderPreparer />
            </ProtectedRoute>,
          },
          {
            path: "delivery",
            element: <ProtectedRoute allowedRoles={['deliveryStaff']} redirectPath="/staff">
              <DeliveryStaff />
            </ProtectedRoute>,
          },
          {
            path: "delivery/reports",
            element: <ProtectedRoute allowedRoles={['deliveryStaff']} redirectPath="/staff">
              <DeliveryReports />
            </ProtectedRoute>,
          },
          {
            path: "communications",
            element: <Communications />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export { router };
