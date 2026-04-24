import {
  Package,
  Users,
  ShoppingCart,
  Search,
  MoreHorizontal,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
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

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const stats = [
  {
    label: "Doanh Thu",
    value: "$45,230",
    grow: "+12%",
    icon: <ShoppingCart className="size-4" />,
  },
  {
    label: "Tin Đăng",
    value: "1,240",
    grow: "+5%",
    icon: <Package className="size-4" />,
  },
  {
    label: "Người Dùng",
    value: "862",
    grow: "+18%",
    icon: <Users className="size-4" />,
  },
  {
    label: "Truy Cập",
    value: "12.4K",
    grow: "+22%",
    icon: <LayoutDashboard className="size-4" />,
  },
];

export default function AdminPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-background text-foreground antialiased">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter">
            Dashboard
          </h2>
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em]">
            Hệ thống quản trị Juratifact
          </p>
        </div>
      </div>

      {/* Stats Carousel (Sử dụng màu biến số) */}
      <div className="relative group">
        <div className="flex gap-2 absolute -top-12 right-0">
          <Button
            variant="outline"
            size="icon"
            className="prev-s rounded-none size-8 border-foreground/20"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="next-s rounded-none size-8 border-foreground/20"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{ prevEl: ".prev-s", nextEl: ".next-s" }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
          }}
        >
          {stats.map((stat, i) => (
            <SwiperSlide key={i}>
              <Card className="rounded-none border-2 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground)/0.1)] bg-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <div className="p-2 bg-muted text-foreground">
                    {stat.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black italic uppercase text-foreground">
                    {stat.value}
                  </div>
                  <p className="text-[10px] font-bold text-primary flex items-center mt-1">
                    {stat.grow} <ArrowUpRight className="ml-1 size-3" />
                  </p>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Tables Section */}
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="col-span-4 rounded-none border-2 border-foreground bg-card">
          <CardHeader className="border-b-2 border-foreground/10">
            <CardTitle className="text-xl font-black italic uppercase">
              Tin đăng mới
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-foreground/20 hover:bg-transparent">
                  <TableHead className="font-black uppercase text-[10px] text-foreground">
                    Sản phẩm
                  </TableHead>
                  <TableHead className="font-black uppercase text-[10px] text-foreground text-right">
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
                    className="group border-b border-foreground/5 hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-black italic uppercase text-xs py-4">
                      {item.name}
                    </TableCell>
                    <TableCell className="text-right font-bold text-sm">
                      {item.price}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 rounded-none"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-none border-2 border-foreground font-bold uppercase text-[10px]"
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

        <Card className="col-span-3 rounded-none border-2 border-foreground bg-muted/20">
          <CardHeader>
            <CardTitle className="text-xl font-black italic uppercase text-foreground">
              Truy vấn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Nhập SKU hoặc ID
              </label>
              <Input
                placeholder="SEARCH ID..."
                className="rounded-none border-foreground/20 border-2 bg-background focus-visible:ring-primary"
              />
            </div>
            <Button className="w-full rounded-none font-black italic uppercase py-6 bg-foreground text-background hover:bg-foreground/90 transition-all">
              <Search className="mr-2 size-4" /> Lọc kết quả
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
