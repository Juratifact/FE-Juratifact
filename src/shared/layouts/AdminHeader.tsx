import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FlagTriangleRight,
  Users,
  Layers3,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Reports", to: "/admin/reports", icon: FlagTriangleRight },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Categories", to: "/admin/categories", icon: Layers3 },
  { label: "Upgrade", to: "/admin/upgrade", icon: Sparkles },
];

export default function AdminHeader() {
  return (
    <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:sticky lg:top-0 lg:h-screen bg-slate-950 text-slate-50 border-r border-white/10">
      <div className="flex h-full flex-col p-5">
        <div className="rounded-3xl bg-linear-to-br from-orange-500 via-orange-600 to-rose-600 p-5 shadow-2xl shadow-orange-950/30">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
              <img
                src="/juralogo.png"
                alt="Juratifact Admin"
                className="size-8 object-contain brightness-0 invert"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/75">
                Admin Center
              </p>
              <h1 className="text-2xl font-black italic uppercase leading-none">
                Juratifact
              </h1>
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-white/10 p-3 text-xs font-medium text-white/90">
            Quản lý báo cáo, người dùng và danh mục theo phong cách marketplace.
          </div>
        </div>

        <nav className="mt-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/admin"}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-200",
                    isActive
                      ? "bg-white text-slate-950 shadow-lg shadow-orange-950/20"
                      : "text-slate-300 hover:bg-white/5 hover:text-white",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-3 font-semibold">
                      <span
                        className={cn(
                          "grid size-9 place-items-center rounded-xl transition-colors",
                          isActive
                            ? "bg-orange-100 text-orange-600"
                            : "bg-white/5 text-white/80",
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <span className="text-sm">{item.label}</span>
                    </span>
                    <ChevronRight
                      className={cn(
                        "size-4 transition-transform",
                        isActive
                          ? "text-orange-500"
                          : "text-slate-500 group-hover:translate-x-1",
                      )}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                Growth mode
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                Boost admin workflow
              </p>
            </div>
            <Sparkles className="size-5 text-orange-400" />
          </div>
          <button className="mt-4 w-full rounded-2xl bg-linear-to-r from-orange-500 to-rose-500 px-4 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-orange-950/30 transition-transform hover:scale-[1.01]">
            Upgrade tools
          </button>
        </div>
      </div>
    </aside>
  );
}
