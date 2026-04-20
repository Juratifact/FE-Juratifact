import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { ChevronRight, ShoppingBag, Star, ShieldCheck, Truck, CircleDollarSign } from "lucide-react";

const categories = [
  { name: "Điện thoại cũ", count: "1.2k tin" },
  { name: "Laptop cũ", count: "860 tin" },
  { name: "Thời trang", count: "2.4k tin" },
];

const featuredProducts = [
  { title: "iPhone 13 128GB", price: "10.900.000đ", location: "TP.HCM" },
  { title: "MacBook Air M1", price: "14.500.000đ", location: "Hà Nội" },
  { title: "Bàn làm việc gỗ", price: "1.250.000đ", location: "Đà Nẵng" },
  { title: "Áo khoác Vintage", price: "320.000đ", location: "Cần Thơ" },
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      {/* Hero Banner */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-hidden border-none bg-linear-to-br from-primary/20 via-primary/5 to-background">
          <CardContent className="space-y-4 p-8">
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Mua bán đồ cũ an tâm
            </h1>
            <p className="text-muted-foreground">
              Hệ thống xác thực tin đăng giúp bạn tránh rủi ro lừa đảo.
            </p>
            <div className="flex gap-3">
              <Button className="rounded-full">Mua ngay</Button>
              <Button variant="outline" className="rounded-full">Tìm hiểu thêm</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-lg">Tại sao chọn chúng tôi?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center gap-3"><ShieldCheck className="size-4" /> Kiểm duyệt 24/7</div>
            <div className="flex items-center gap-3"><Truck className="size-4" /> Ship toàn quốc</div>
            <div className="flex items-center gap-3"><CircleDollarSign className="size-4" /> Giá luôn tốt nhất</div>
          </CardContent>
        </Card>
      </section>

      {/* Danh mục */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Danh mục nổi bật</h2>
          <Button variant="ghost" size="sm">Tất cả <ChevronRight className="size-4" /></Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {categories.map((cat) => (
            <Card key={cat.name} className="hover:border-primary cursor-pointer transition-all">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-bold">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">{cat.count}</p>
                </div>
                <ShoppingBag className="size-5 text-muted-foreground" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Sản phẩm */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Dành cho bạn</h2>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((p) => (
            <Card key={p.title} className="group overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-muted group-hover:opacity-80 transition-opacity" />
                <div className="p-3 space-y-1">
                  <h3 className="line-clamp-1 font-medium text-sm">{p.title}</h3>
                  <p className="font-bold text-primary">{p.price}</p>
                  <p className="text-[10px] text-muted-foreground">{p.location}</p>
                </div>
              </CardContent>
              <CardFooter className="p-3 pt-0 flex justify-between items-center">
                <div className="flex items-center text-[10px]"><Star className="size-3 fill-yellow-400 text-yellow-400 mr-1" /> 5.0</div>
                <Button size="sm" variant="secondary" className="h-7 text-xs">Chi tiết</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}