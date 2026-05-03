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
  CardDescription,
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
import { Separator } from "@/shared/components/ui/separator";

const stats = [
  {
    label: "Doanh thu",
    value: "$45,230",
    grow: "+12%",
    icon: ShoppingCart,
  },
  {
    label: "Tin đăng",
    value: "1,240",
    grow: "+5%",
    icon: Package,
  },
  {
    label: "Người dùng",
    value: "862",
    grow: "+18%",
    icon: Users,
  },
  {
    label: "Truy cập",
    value: "12.4K",
    grow: "+22%",
    icon: LayoutDashboard,
  },
];

const shortcuts = [
  { label: "Báo cáo vi phạm", icon: FlagTriangleRight, href: "/admin/reports" },
  { label: "Quản lý người dùng", icon: Users, href: "/admin/users" },
  { label: "Danh mục sản phẩm", icon: Layers3, href: "/admin/categories" },
  { label: "Nâng cấp hệ thống", icon: Sparkles, href: "/admin/upgrade" },
];

export default function AdminPage() {
  return (
    <div className="container mx-auto p-6 space-y-8 max-w-7xl">
      {/* Header Section */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Tổng quan hệ thống
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý hoạt động marketplace và theo dõi chỉ số tăng trưởng thực
            tế.
          </p>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm ring-1 ring-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center mt-1">
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                >
                  {stat.grow}
                </Badge>
                <span className="text-[10px] text-muted-foreground ml-2">
                  so với tháng trước
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Table Section */}
        <Card className="lg:col-span-8 border-none shadow-sm ring-1 ring-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl">Tin đăng mới nhất</CardTitle>
              <CardDescription>
                Danh sách các sản phẩm vừa được cập nhật trên sàn.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs font-medium">
              Xem tất cả
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-75">Sản phẩm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Giá trị</TableHead>
                  <TableHead className="w-12.5"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    name: "iPhone 13 128GB Blue",
                    status: "Active",
                    price: "$450",
                    sku: "IP13-128",
                  },
                  {
                    name: "MacBook Air M1 Space Gray",
                    status: "Pending",
                    price: "$620",
                    sku: "MBA-M1",
                  },
                  {
                    name: "Sony WH-1000XM4",
                    status: "Active",
                    price: "$280",
                    sku: "SNY-XM4",
                  },
                ].map((item) => (
                  <TableRow key={item.sku} className="group transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{item.name}</span>
                        <span className="text-[10px] text-muted-foreground tracking-tight">
                          SKU: {item.sku}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "Active" ? "outline" : "secondary"
                        }
                        className="text-[10px] font-normal"
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {item.price}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                          <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                          <Separator className="my-1" />
                          <DropdownMenuItem className="text-destructive">
                            Gỡ tin
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

        {/* Sidebar Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Search */}
          <Card className="border-none shadow-sm ring-1 ring-border bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg">Tìm kiếm nhanh</CardTitle>
              <CardDescription className="text-primary-foreground/70">
                Tra cứu nhanh mã sản phẩm hoặc người dùng.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-primary-foreground/50" />
                <Input
                  placeholder="Nhập mã định danh..."
                  className="bg-primary-foreground/10 border-none placeholder:text-primary-foreground/40 text-primary-foreground h-10 pl-10 focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-primary-foreground/30"
                />
              </div>
              <Button variant="secondary" className="w-full font-medium">
                Tìm kiếm ngay
              </Button>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="border-none shadow-sm ring-1 ring-border">
            <CardHeader>
              <CardTitle className="text-base">Lối tắt quản lý</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {shortcuts.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-md group-hover:bg-background transition-colors">
                      <item.icon className="size-4 text-foreground" />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                </a>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
