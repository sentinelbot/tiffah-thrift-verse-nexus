
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Index from "./pages/Index";
import ProductDetailPage from "./pages/ProductDetailPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import Products from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import AdminDashboard from "./pages/admin/Dashboard";
import ProductManager from "./pages/staff/ProductManager";
import InventoryManagement from "./pages/admin/InventoryManagement";

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
        element: <ProductDetailPage />,
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
