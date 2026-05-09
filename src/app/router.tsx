import LoginPage from "@/features/auth/pages/LoginPage";
import NotFoundPage from "@/features/auth/pages/NotFoundPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import UnauthorizedPage from "@/features/auth/pages/UnauthorizedPage";
import IdentifyCatalog from "@/features/identify/pages/IdentifyCatalog";
import ManageIdentifyCreate from "@/features/identify/pages/ManageIdentifyCreate";
import ManageIdentifyEdit from "@/features/identify/pages/ManageIdentifyEdit";
import IdentifyDetailPage from "@/features/identify/pages/IdentifyDetailPage";
import IdentifyList from "@/features/identify/pages/IdentifyList";
import AdminLandingRoute from "@/features/landing/pages/AdminLandingRoute";
import HomePage from "@/features/landing/pages/HomePage";
import MapPage from "@/features/map/pages/MapPage";
import ProductCatalog from "@/features/products/pages/ProductCatalog";
import ManageProductCreate from "@/features/products/pages/ManageProductCreate";
import ManageProductEdit from "@/features/products/pages/ManageProductEdit";
import CartPage from "@/features/cart/pages/CartPage";
import CheckoutPage from "@/features/orders/pages/CheckoutPage";
import MyOrdersPage from "@/features/orders/pages/MyOrdersPage";
import OrderDetailPage from "@/features/orders/pages/OrderDetailPage";
import PaymentConfirmationPage from "@/features/orders/pages/PaymentConfirmationPage";
import ManageReportList from "@/features/reports/pages/ManageReportList";
import ManageUserList from "@/features/users/pages/ManageUserList";
import ManageOrderList from "@/features/orders/pages/ManageOrderList";
import ProfilePage from "@/features/users/pages/ProfilePage";
import UserSearchPage from "@/features/users/pages/UserSearchPage";
import MyProductCatalog from "@/features/products/pages/MyProductCatalog";
import AvailableOrdersPage from "@/features/shipper/pages/AvailableOrdersPage";
import ShipperMyOrdersPage from "@/features/shipper/pages/MyOrdersPage";
import ShipperOrderDetail from "@/features/shipper/pages/ShipperOrderDetail";
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
        path: "cart",
        element: (
          <ProtectedRoute allowedRoles={["User", "Buyer", "Seller"]}>
            <CartPage />
          </ProtectedRoute>
        ),
      },
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
          <ProtectedRoute allowedRoles={["User", "Buyer", "Seller", "Admin"]}>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "my-products",
        element: (
          <ProtectedRoute allowedRoles={["Buyer", "Seller"]}>
            <MyProductCatalog />
          </ProtectedRoute>
        ),
      },
      {
        path: "users/search",
        element: (
          <ProtectedRoute allowedRoles={["User", "Buyer", "Seller", "Admin"]}>
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
        path: "checkout",
        element: (
          <ProtectedRoute allowedRoles={["User", "Buyer", "Seller"]}>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute allowedRoles={["User", "Buyer", "Seller"]}>
            <MyOrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "seller/orders",
        element: (
          <ProtectedRoute allowedRoles={["Seller"]}>
            <MyOrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "orders/:orderId",
        element: (
          <ProtectedRoute allowedRoles={["User", "Buyer", "Seller"]}>
            <OrderDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "payment-confirmation",
        element: (
          <ProtectedRoute allowedRoles={["User", "Buyer", "Seller"]}>
            <PaymentConfirmationPage />
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
      <ProtectedRoute allowedRoles={["Admin", "Shipper"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute allowedRoles={["Admin", "Shipper"]}>
            <AdminLandingRoute />
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
        path: "orders",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <ManageOrderList />
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
        path: "shipper/orders",
        element: (
          <ProtectedRoute allowedRoles={["Shipper"]}>
            <AvailableOrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "shipper/my-orders",
        element: (
          <ProtectedRoute allowedRoles={["Shipper"]}>
            <ShipperMyOrdersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "shipper/my-orders/:orderId",
        element: (
          <ProtectedRoute allowedRoles={["Shipper"]}>
            <ShipperOrderDetail />
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
