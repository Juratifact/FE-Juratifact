import { Footer } from "./Footer";
import Header from "./Header";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
export function UserLayout() {
  const access_token = useAuthStore((s) => s.access_token);
  const role = useAuthStore((s) => s.role);

  if (access_token && role === "Shipper") {
    return <Navigate to="/admin/shipper/orders" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ====== Header - Tuong nha (co dinh) ===== */}
      <Header />

      {/* MAIN CONTAIN - Outlet (thay doi theo url) */}
      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>

      {/* FOOTER - nen nha (co dinh) */}

      <Footer />
    </div>
  );
}
