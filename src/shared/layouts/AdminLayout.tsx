import { Outlet, useLocation } from "react-router-dom";
import { CircleUserRound } from "lucide-react";
import AdminHeader from "./AdminHeader";
import { useAuthStore } from "@/features/auth/store";
import { useEffect } from "react";

export default function AdminLayout() {
  const location = useLocation();
  const role = useAuthStore((s) => s.role);
  const isShipper = role === "Shipper";

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  const titleMap: Record<string, { title: string; subtitle: string }> = {
    "/admin": {
      title: "Bảng điều khiển",
      subtitle: "Theo dõi tình hình vận hành của sàn",
    },
    "/admin/users": {
      title: "Người dùng",
      subtitle: "Quản lý tài khoản người dùng",
    },
    "/admin/reports": {
      title: "Báo cáo vi phạm",
      subtitle: "Duyệt và xử lý báo cáo",
    },
    "/admin/categories": {
      title: "Danh mục",
      subtitle: "Danh mục nội dung và hiển thị",
    },
    "/admin/upgrade": {
      title: "Nâng cấp",
      subtitle: "Mở rộng gói quản trị và tính năng",
    },
    "/admin/shipper/orders": {
      title: "Đơn khả dụng",
      subtitle: "Nhận đơn hàng đang chờ shipper",
    },
    "/admin/promotions": {
      title: "Gói ưu đãi",
      subtitle: "Quản lý và cập nhật các gói ưu đãi hiện có",
    },
    "/admin/transactions": {
      title: "Lịch sử giao dịch",
      subtitle: "Theo dõi và quản lý dòng tiền toàn hệ thống",
    },
  };

  const current = titleMap[location.pathname] ?? titleMap["/admin"];

  return (
    <div className="min-h-screen bg-background text-foreground lg:flex">
      <AdminHeader />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-orange-500">
                {isShipper ? "Giao hàng sàn" : "Quản trị viên sàn"}
              </p>
              <h2 className="mt-1 text-2xl font-black italic uppercase tracking-tight">
                {current.title}
              </h2>
              <p className="text-sm text-muted-foreground">{current.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2 shadow-sm">
                <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <CircleUserRound className="size-4" />
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-semibold uppercase tracking-wide">
                    {isShipper ? "Shipper" : "Quản trị viên"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
