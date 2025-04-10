
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

// Import App component first to prevent initialization issues
import App from "./App";
// Import all other page components
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

// Define the router after importing all components
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
      },
      {
        path: "track",
        element: <TrackOrderPage />,
      },
      {
        path: "admin",
        element: <AdminRoutes />,
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
        ],
      },
      {
        path: "staff",
        element: <StaffRoutes />,
        children: [
          {
            index: true,
            element: <StaffDashboard />,
          },
          {
            path: "product-manager",
            element: <ProductManager />,
          },
          {
            path: "order-preparer",
            element: <OrderPreparer />,
          },
          {
            path: "delivery",
            element: <DeliveryStaff />,
          },
          {
            path: "delivery/reports",
            element: <DeliveryReports />,
          },
          {
            path: "communications",
            element: <Communications />,
          },
        ],
      },
    ],
  },
]);

export { router };
