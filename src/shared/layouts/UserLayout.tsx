import { Footer } from "./Footer";
import Header from "./Header";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import { VerificationPoller } from "@/shared/components/common/VerificationPoller";
export function UserLayout() {
  const access_token = useAuthStore((s) => s.access_token);
  const role = useAuthStore((s) => s.role);
  const isVerify = useAuthStore((s) => s.isVerify);
  const isLoggedIn = !!access_token && !!role;
  const location = useLocation();
  const isIdentifyRoute = location.pathname.startsWith("/identify");

  if (access_token && role) {
    if (role === "Shipper") {
      if (!isVerify) {
        if (!isIdentifyRoute) {
          return <Navigate to="/identify/create" replace />;
        }
      } else if (!location.pathname.startsWith("/admin/shipper")) {
        return <Navigate to="/admin/shipper/orders" replace />;
      }
    }

    if (role === "Admin" && !location.pathname.startsWith("/admin")) {
      return <Navigate to="/admin" replace />;
    }

    if (!isVerify && !isIdentifyRoute && role !== "Admin") {
      return <Navigate to="/identify/create" replace />;
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ====== Header - Tuong nha (co dinh) ===== */}
      <Header />
      {isLoggedIn && <VerificationPoller />}

      {/* MAIN CONTAIN - Outlet (thay doi theo url) */}
      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>

      {/* FOOTER - nen nha (co dinh) */}

      <Footer />
    </div>
  );
}
