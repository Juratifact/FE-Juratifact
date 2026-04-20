import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  ChevronRight,
  CircleDollarSign,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { name: "Điện thoại cũ", count: "1.2k tin" },
  { name: "Laptop đã qua sử dụng", count: "860 tin" },
  { name: "Thời trang second-hand", count: "2.4k tin" },
  { name: "Nội thất", count: "740 tin" },
  { name: "Phụ kiện xe", count: "510 tin" },
  { name: "Sách & đồ sưu tầm", count: "980 tin" },
];

const featuredProducts = [
  {
    title: "iPhone 13 128GB",
    price: "10.900.000đ",
    condition: "Like new 99%",
    location: "Q. Bình Thạnh, TP.HCM",
  },
  {
    title: "MacBook Air M1",
    price: "14.500.000đ",
    condition: "Đẹp, pin tốt",
    location: "Q. Cầu Giấy, Hà Nội",
  },
  {
    title: "Bàn làm việc gỗ",
    price: "1.250.000đ",
    condition: "Đã dùng 8 tháng",
    location: "TP. Thủ Đức",
  },
  {
    title: "Áo khoác denim vintage",
    price: "320.000đ",
    condition: "Ít sử dụng",
    location: "Q. Hải Châu, Đà Nẵng",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="supports-backdrop-filter:bg-background/70 sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <p>Nền tảng mua bán đồ cũ minh bạch & nhanh chóng</p>
            <div className="flex items-center gap-2">
              <Link to="#" className="hover:text-foreground">
                Hỗ trợ
              </Link>
              <span>•</span>
              <Link to="#" className="hover:text-foreground">
                Trợ giúp
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/" className="text-2xl font-black tracking-tight">
              Juratifact
            </Link>

            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm đồ cũ bạn cần..."
                className="h-10 rounded-full pl-9"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline">Đăng nhập</Button>
              <Button>Đăng bán</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10">
        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 overflow-hidden border-primary/20 bg-linear-to-r from-primary/10 via-accent/50 to-muted">
            <CardContent className="space-y-4 p-6 sm:p-8">
              <Badge variant="secondary" className="rounded-full">
                Giống Shopee, dành riêng cho đồ cũ
              </Badge>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Mua bán đồ cũ dễ dàng trên Juratifact
              </h1>
              <p className="max-w-2xl text-muted-foreground">
                Khám phá hàng nghìn sản phẩm đã qua sử dụng chất lượng, giá tốt.
                Đăng tin nhanh, chốt đơn gọn, thanh toán an toàn.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="gap-2">
                  Khám phá ngay <ChevronRight className="size-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Đăng món đồ đầu tiên
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Ưu điểm Juratifact</CardTitle>
              <CardDescription>
                Tối ưu cho người mua và người bán đồ cũ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-4 text-primary" />
                <p>Kiểm duyệt tin đăng để giảm rủi ro lừa đảo</p>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="mt-0.5 size-4 text-primary" />
                <p>Hỗ trợ giao nhận nhanh tại các thành phố lớn</p>
              </div>
              <div className="flex items-start gap-3">
                <CircleDollarSign className="mt-0.5 size-4 text-primary" />
                <p>Đề xuất mức giá phù hợp theo thị trường</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Danh mục nổi bật</h2>
            <Button variant="ghost" className="gap-1">
              Xem tất cả <ChevronRight className="size-4" />
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.name} className="border-border/70 py-4">
                <CardContent className="flex items-center justify-between px-4">
                  <div>
                    <p className="font-semibold">{category.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {category.count}
                    </p>
                  </div>
                  <ShoppingBag className="size-4 text-muted-foreground" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Sản phẩm gợi ý</h2>
            <Button variant="ghost">Làm mới</Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <Card key={product.title} className="gap-4 py-4">
                <CardContent className="space-y-3 px-4">
                  <div className="aspect-4/3 rounded-lg bg-muted" />
                  <div className="space-y-1">
                    <h3 className="line-clamp-2 min-h-10 font-semibold">
                      {product.title}
                    </h3>
                    <p className="text-lg font-bold text-primary">
                      {product.price}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {product.condition}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.location}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="size-3.5 fill-current" />
                    4.9
                  </div>
                  <Button size="sm">Xem tin</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
