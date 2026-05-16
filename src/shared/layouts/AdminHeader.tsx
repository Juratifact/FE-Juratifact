import { NavLink } from "react-router-dom";
import { useLogoutMutation } from "@/features/auth/hooks/useAuthMutation";
import { useAuthStore } from "@/features/auth/store";
import { Button } from "@/shared/components/ui/button";
import {
  LayoutDashboard,
  FlagTriangleRight,
  Users,
  FileCheck,
  Truck,
  Sun,
  Moon,
  Zap,
  ArrowRightLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/app/store";

const adminNavItems = [
  { label: "Bảng điều khiển", to: "/admin", icon: LayoutDashboard },
  { label: "Báo cáo vi phạm", to: "/admin/reports", icon: FlagTriangleRight },
  { label: "Xác minh tài liệu", to: "/admin/identify", icon: FileCheck },
  { label: "Người dùng", to: "/admin/users", icon: Users },
  { label: "Gói ưu đãi", to: "/admin/promotions", icon: Zap },
  { label: "Lịch sử giao dịch", to: "/admin/transactions", icon: ArrowRightLeft },
];

const shipperNavItems = [
  { label: "Đơn hàng khả dụng", to: "/admin/shipper/orders", icon: Truck },
  {
    label: "Đơn hàng đã nhận",
    to: "/admin/shipper/my-orders",
    icon: FileCheck,
  },
];

export default function AdminHeader() {
  const logoutMutation = useLogoutMutation();
  const role = useAuthStore((s) => s.role);
  const { theme, toggleTheme } = useThemeStore();
  const navItems = role === "Shipper" ? shipperNavItems : adminNavItems;
  return (
    <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:sticky lg:top-0 lg:h-screen bg-card border-r border-border/50">
      <div className="flex h-full flex-col px-6 py-8">
        {/* Logo Section*/}
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary shadow-sm ring-1 ring-primary">
            <img
              src="/juralogo.png"
              alt="Juratifact Admin"
              className="size-6 object-contain brightness-0 invert"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight leading-none">
              Juratifact
            </h1>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground mt-1">
              {role === "Shipper" ? "Bảng điều khiển Shipper" : "Hệ thống quản trị"}
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-2 mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Menu chính
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/admin"}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-200 border border-transparent",
                      isActive
                        ? "bg-secondary text-secondary-foreground shadow-sm border-border/50"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "size-4.5 transition-colors",
                        "group-hover:text-foreground",
                      )}
                    />
                    <span className="text-sm font-medium tracking-tight">
                      {item.label}
                    </span>
                  </div>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between gap-2 px-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full size-9 text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="size-4.5" />
              ) : (
                <Moon className="size-4.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-9 px-4 text-xs font-medium text-destructive/80 hover:bg-destructive/10 hover:text-destructive transition-colors duration-300"
              onClick={() => logoutMutation.mutate()}
            >
              Đăng xuất
            </Button>
          </div>
          <div className="rounded-2xl bg-muted/40 p-4 border border-border/40">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium text-muted-foreground">
                Hệ thống trực tuyến
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground/80">
              Phiên bản v2.4.0 <br />© 2026 Juratifact Inc.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
