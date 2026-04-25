import LoginPage from "@/features/auth/pages/LoginPage";
import NotFoundPage from "@/features/auth/pages/NotFoundPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import UnauthorizedPage from "@/features/auth/pages/UnauthorizedPage";
import AdminPage from "@/features/landing/pages/AdminPage";
import HomePage from "@/features/landing/pages/HomePage";
import MapPage from "@/features/map/pages/MapPage";
import ProductCatalog from "@/features/products/pages/ProductCatalog";
import ManageProductCreate from "@/features/products/pages/ManageProductCreate";
import ManageProductEdit from "@/features/products/pages/ManageProductEdit";
import { GuestRoute } from "@/shared/components/common/GuestRoute";
import { ProtectedRoute } from "@/shared/components/common/ProtectedRoute";
import AdminLayout from "@/shared/layouts/AdminLayout";
import { UserLayout } from "@/shared/layouts/UserLayout";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    element: <UserLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "map", element: <MapPage /> },
      { path: "products", element: <ProductCatalog /> },
      {
        path: "products/create",
        element: (
          <ProtectedRoute allowedRoles={["Buyer", "Seller"]}>
            <ManageProductCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "products/:id/edit",
        element: (
          <ProtectedRoute allowedRoles={["Buyer", "Seller"]}>
            <ManageProductEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "login",
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },
      {
        path: "register",
        element: (
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        ),
      },
      { path: "unauthorized", element: <UnauthorizedPage /> },
      //404 fallback
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "admin",
    element: (
      <ProtectedRoute allowedRoles={["Admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
