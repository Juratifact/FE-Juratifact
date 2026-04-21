import LoginPage from "@/features/auth/pages/LoginPage";
import NotFoundPage from "@/features/auth/pages/NotFoundPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import UnauthorizedPage from "@/features/auth/pages/UnauthorizedPage";
import AdminPage from "@/features/landing/pages/AdminPage";
import HomePage from "@/features/landing/pages/HomePage";
import MapPage from "@/features/map/pages/MapPage";
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
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
