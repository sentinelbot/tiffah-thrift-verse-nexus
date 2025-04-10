
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

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

// Import App last to avoid circular dependencies
import App from "./App";

// Define the router configuration without directly referencing App
const routes = [
  {
    path: "/",
    element: null, // Will be replaced with App component when router is created
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
];

// Create the router with App component as the root element
const router = createBrowserRouter(
  routes.map(route => {
    if (route.path === "/") {
      return {
        ...route,
        element: <App />, // Set the App component here after all imports are processed
      };
    }
    return route;
  })
);

export { router };
