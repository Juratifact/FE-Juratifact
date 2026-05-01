import { Outlet, useLocation } from "react-router-dom";
import { Search, Bell, MessageSquare, CircleUserRound } from "lucide-react";
import AdminHeader from "./AdminHeader";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

export default function AdminLayout() {
  const location = useLocation();

  const titleMap: Record<string, { title: string; subtitle: string }> = {
    "/admin": {
      title: "Dashboard",
      subtitle: "Theo dõi tình hình vận hành của sàn",
    },
    "/admin/users": {
      title: "Users",
      subtitle: "Quản lý tài khoản người dùng",
    },
    "/admin/reports": {
      title: "Reports",
      subtitle: "Duyệt và xử lý báo cáo",
    },
    "/admin/categories": {
      title: "Categories",
      subtitle: "Danh mục nội dung và hiển thị",
    },
    "/admin/upgrade": {
      title: "Upgrade",
      subtitle: "Mở rộng gói quản trị và tính năng",
    },
  };

  const current = titleMap[location.pathname] ?? titleMap["/admin"];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
      <AdminHeader />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-slate-50/90 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-orange-500">
                Marketplace admin
              </p>
              <h2 className="mt-1 text-2xl font-black italic uppercase tracking-tight">
                {current.title}
              </h2>
              <p className="text-sm text-slate-500">{current.subtitle}</p>
            </div>

            <div className="hidden xl:flex flex-1 max-w-xl items-center gap-3 px-8">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Tìm người dùng, báo cáo, danh mục..."
                  className="h-11 rounded-2xl border-slate-200 bg-white pl-10 shadow-sm"
                />
              </div>
              <Badge className="rounded-full bg-orange-100 px-3 py-2 text-xs font-bold text-orange-600 hover:bg-orange-100">
                Live ops
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-2xl border-slate-200 bg-white"
              >
                <MessageSquare className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-2xl border-slate-200 bg-white relative"
              >
                <Bell className="size-4" />
                <span className="absolute right-2 top-2 size-2 rounded-full bg-orange-500" />
              </Button>
              <div className="hidden sm:flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <div className="grid size-9 place-items-center rounded-xl bg-slate-950 text-white">
                  <CircleUserRound className="size-4" />
                </div>
                <div className="leading-tight">
                  <p className="text-xs font-semibold uppercase tracking-wide">
                    Administrator
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Shopee-style control
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
