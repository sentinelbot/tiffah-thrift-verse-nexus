
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Index from "./pages/Index";
import ProductDetails from "./pages/ProductDetails"; // Changed from ProductDetailPage
import TrackOrderPage from "./pages/TrackOrderPage";
import Products from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import AdminDashboard from "./pages/admin/Dashboard";
import ProductManager from "./pages/staff/ProductManager";
import InventoryManagement from "./pages/admin/InventoryManagement";
import Orders from "./pages/admin/Orders";
import Printing from "./pages/admin/Printing";

export const router = createBrowserRouter([
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
        element: <ProductDetails />, // Changed from ProductDetailPage
      },
      {
        path: "track",
        element: <TrackOrderPage />,
      },
      {
        path: "admin",
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
        ],
      },
      {
        path: "staff",
        children: [
          {
            path: "product-manager",
            element: <ProductManager />,
          },
        ],
      },
    ],
  },
]);
