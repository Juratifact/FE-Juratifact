import LoginPage from "@/features/auth/pages/LoginPage";
import NotFoundPage from "@/features/auth/pages/NotFoundPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import UnauthorizedPage from "@/features/auth/pages/UnauthorizedPage";
import IdentifyCatalog from "@/features/identify/pages/IdentifyCatalog";
import ManageIdentifyCreate from "@/features/identify/pages/ManageIdentifyCreate";
import ManageIdentifyEdit from "@/features/identify/pages/ManageIdentifyEdit";
import IdentifyDetailPage from "@/features/identify/pages/IdentifyDetailPage";
import IdentifyList from "@/features/identify/pages/IdentifyList";
import AdminPage from "@/features/landing/pages/AdminPage";
import HomePage from "@/features/landing/pages/HomePage";
import MapPage from "@/features/map/pages/MapPage";
import ProductCatalog from "@/features/products/pages/ProductCatalog";
import ManageProductCreate from "@/features/products/pages/ManageProductCreate";
import ManageProductEdit from "@/features/products/pages/ManageProductEdit";
import ManageReportList from "@/features/reports/pages/ManageReportList";
import ManageUserList from "@/features/users/pages/ManageUserList";
import ProfilePage from "@/features/users/pages/ProfilePage";
import UserSearchPage from "@/features/users/pages/UserSearchPage";
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
        path: "profile",
        element: (
          <ProtectedRoute
            allowedRoles={["User", "Buyer", "Seller", "Shipper", "Admin"]}
          >
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/search",
        element: (
          <ProtectedRoute
            allowedRoles={["User", "Buyer", "Seller", "Shipper", "Admin"]}
          >
            <UserSearchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "identify",
        element: (
          <ProtectedRoute allowedRoles={["User", "Buyer", "Seller"]}>
            <IdentifyCatalog />
          </ProtectedRoute>
        ),
      },
      {
        path: "identify/create",
        element: (
          <ProtectedRoute allowedRoles={["User", "Buyer", "Seller"]}>
            <ManageIdentifyCreate />
          </ProtectedRoute>
        ),
      },
      {
        path: "identify/edit/:id",
        element: (
          <ProtectedRoute allowedRoles={["User", "Buyer", "Seller"]}>
            <ManageIdentifyEdit />
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
      {
        path: "users",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <ManageUserList />
          </ProtectedRoute>
        ),
      },
      {
        path: "reports",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <ManageReportList />
          </ProtectedRoute>
        ),
      },
      {
        path: "identify",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <IdentifyList />
          </ProtectedRoute>
        ),
      },
      {
        path: "identify/:id",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <IdentifyDetailPage />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: "categories",
      //   element: (
      //     <ProtectedRoute allowedRoles={["Admin"]}>
      //       <AdminCategoriesPage />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "upgrade",
      //   element: (
      //     <ProtectedRoute allowedRoles={["Admin"]}>
      //       <AdminUpgradePage />
      //     </ProtectedRoute>
      //   ),
      // },
    ],
  },
]);
