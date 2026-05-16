import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Layers3, Tag, ListFilter, Sparkles } from "lucide-react";

const categories = [
  { name: "Điện tử", count: 128, trend: "+18%" },
  { name: "Gia dụng", count: 84, trend: "+10%" },
  { name: "Thời trang", count: 96, trend: "+22%" },
  { name: "Nội thất", count: 52, trend: "+8%" },
];

export default function AdminCategoriesPage() {
  const total = useMemo(
    () => categories.reduce((sum, item) => sum + item.count, 0),
    [],
  );

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-orange-100 bg-linear-to-r from-orange-500 via-orange-400 to-rose-500 p-6 text-white shadow-xl shadow-orange-200/40">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-white/15">
              Trung tâm danh mục
            </Badge>
            <h1 className="mt-4 text-3xl font-black italic uppercase tracking-tight sm:text-5xl">
              Danh mục
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base">
              Quản lý nhóm sản phẩm theo kiểu marketplace với khối nội dung rõ
              ràng, ưu tiên thao tác nhanh.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/75">
                Tổng
              </p>
              <p className="mt-1 text-2xl font-black">{total}</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/75">
                Đang hoạt động
              </p>
              <p className="mt-1 text-2xl font-black">4</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/75">
                Hot
              </p>
              <p className="mt-1 text-2xl font-black">2</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => (
          <Card
            key={category.name}
            className="rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg font-black uppercase italic">
                  {category.name}
                </CardTitle>
                <p className="text-xs text-slate-500">
                  {category.count} tin đăng
                </p>
              </div>
              <div className="grid size-11 place-items-center rounded-2xl bg-orange-50 text-orange-600">
                <Layers3 className="size-5" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Tăng trưởng</span>
                <span className="font-bold text-emerald-600">
                  {category.trend}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-linear-to-r from-orange-500 to-rose-500"
                  style={{ width: `${Math.min(100, category.count)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-black italic uppercase">
              Quản lý nhanh
            </CardTitle>
            <p className="text-sm text-slate-500">
              Tạo, lọc và sắp xếp danh mục theo phong cách marketplace.
            </p>
          </div>
          <Button className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800">
            <Tag className="mr-2 size-4" /> Thêm danh mục
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <ListFilter className="size-5 text-orange-600" />
            <p className="mt-3 text-sm font-semibold uppercase tracking-wide">
              Bộ lọc
            </p>
            <p className="text-sm text-slate-500">
              Hiển thị nhanh các danh mục nổi bật.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <Sparkles className="size-5 text-orange-600" />
            <p className="mt-3 text-sm font-semibold uppercase tracking-wide">
              Xu hướng
            </p>
            <p className="text-sm text-slate-500">
              Ưu tiên danh mục đang tăng trưởng.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <Layers3 className="size-5 text-orange-600" />
            <p className="mt-3 text-sm font-semibold uppercase tracking-wide">
              Sắp xếp
            </p>
            <p className="text-sm text-slate-500">
              Tối ưu trật tự hiển thị trên web/app.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
