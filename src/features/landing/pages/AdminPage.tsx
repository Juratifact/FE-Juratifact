import { useMemo } from "react";
import {
  Package,
  Users,
  ShoppingCart,
  Search,
  MoreHorizontal,
  ArrowUpRight,
  LayoutDashboard,
  FlagTriangleRight,
  Layers3,
  Sparkles,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Badge } from "@/shared/components/ui/badge";

const stats = [
  {
    label: "Doanh thu",
    value: "$45,230",
    grow: "+12%",
    icon: <ShoppingCart className="size-4" />,
  },
  {
    label: "Tin đăng",
    value: "1,240",
    grow: "+5%",
    icon: <Package className="size-4" />,
  },
  {
    label: "Người dùng",
    value: "862",
    grow: "+18%",
    icon: <Users className="size-4" />,
  },
  {
    label: "Truy cập",
    value: "12.4K",
    grow: "+22%",
    icon: <LayoutDashboard className="size-4" />,
  },
];

const shortcuts = [
  { label: "Reports", icon: FlagTriangleRight, href: "/admin/reports" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Categories", icon: Layers3, href: "/admin/categories" },
  { label: "Upgrade", icon: Sparkles, href: "/admin/upgrade" },
];

export default function AdminPage() {
  const summary = useMemo(
    () => [
      { label: "Pending reports", value: 18, tone: "amber" },
      { label: "Active users", value: 862, tone: "emerald" },
      { label: "Categories", value: 24, tone: "sky" },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-orange-100 bg-linear-to-r from-orange-500 via-orange-400 to-rose-500 p-6 text-white shadow-xl shadow-orange-200/40">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-white/15">
              Marketplace control center
            </Badge>
            <h1 className="mt-4 text-3xl font-black italic uppercase tracking-tight sm:text-5xl">
              Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base">
              Giám sát hoạt động theo phong cách chợ tốt / shopee: gọn, sáng,
              nhiều điểm chạm hành động.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            {summary.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm"
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/75">
                  {item.label}
                </p>
                <p className="mt-1 text-2xl font-black">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">
                {stat.label}
              </CardTitle>
              <div className="grid size-10 place-items-center rounded-2xl bg-orange-50 text-orange-600">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black italic uppercase text-slate-950">
                {stat.value}
              </div>
              <p className="mt-1 flex items-center text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                {stat.grow} <ArrowUpRight className="ml-1 size-3" />
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-7">
        <Card className="col-span-4 rounded-3xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100">
            <div>
              <CardTitle className="text-2xl font-black italic uppercase">
                Tin đăng mới
              </CardTitle>
              <p className="text-sm text-slate-500">
                Dữ liệu mô phỏng theo kiểu marketplace dashboard
              </p>
            </div>
            <Badge className="rounded-full bg-orange-100 px-3 py-2 text-xs font-bold text-orange-600 hover:bg-orange-100">
              Live data
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100 hover:bg-transparent">
                  <TableHead className="font-black uppercase text-[10px] tracking-[0.2em] text-slate-500">
                    Sản phẩm
                  </TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-[0.2em] text-slate-500 text-right">
                    Giá
                  </TableHead>
                  <TableHead className="w-12.5"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: "iPhone 13 128GB", status: "Active", price: "$450" },
                  { name: "MacBook Air M1", status: "Pending", price: "$620" },
                ].map((item) => (
                  <TableRow
                    key={item.name}
                    className="group border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <TableCell className="py-4 text-xs font-black italic uppercase">
                      <div>
                        <div>{item.name}</div>
                        <div className="mt-1 text-[10px] font-semibold text-slate-400">
                          {item.status}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-sm text-slate-900">
                      {item.price}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 rounded-2xl p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-2xl border border-slate-200 font-bold uppercase text-[10px]"
                        >
                          <DropdownMenuItem>Sửa</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="col-span-3 rounded-3xl border border-slate-200 bg-slate-950 text-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-black italic uppercase">
              Quick search
            </CardTitle>
            <p className="text-sm text-slate-300">
              Lọc nhanh dữ liệu theo SKU / ID / report
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Nhập SKU hoặc ID
              </label>
              <Input
                placeholder="SEARCH ID..."
                className="h-11 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-slate-400 focus-visible:ring-orange-400"
              />
            </div>
            <Button className="w-full rounded-2xl bg-linear-to-r from-orange-500 to-rose-500 py-6 font-black italic uppercase text-white hover:opacity-95">
              <Search className="mr-2 size-4" /> Lọc kết quả
            </Button>

            <div className="grid gap-3 pt-2">
              {shortcuts.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-xl bg-white/10">
                        <Icon className="size-4" />
                      </span>
                      {item.label}
                    </span>
                    <ArrowUpRight className="size-4 text-white/50" />
                  </a>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
