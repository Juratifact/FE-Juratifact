import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import AdminPage from "./AdminPage";

export default function AdminLandingRoute() {
  const role = useAuthStore((s) => s.role);

  if (role === "Shipper") {
    return <Navigate to="/admin/shipper/orders" replace />;
  }

  return <AdminPage />;
}
