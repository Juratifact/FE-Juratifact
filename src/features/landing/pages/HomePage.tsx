import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Giữ nguyên dữ liệu sản phẩm
const products = [
  {
    title: "iPhone 13 128GB",
    price: "$450",
    loc: "HCMC",
    img: "/iPhone-13-Pro-Max-Front.jpg",
  },
  {
    title: "MacBook Air M1",
    price: "$620",
    loc: "HANOI",
    img: "/macbook.jpg",
  },
  {
    title: "Retro Sneaker",
    price: "$95",
    loc: "DANANG",
    img: "/NB.jpg",
  },
  {
    title: "Keyboard",
    price: "$55",
    loc: "CANTHO",
    img: "/banphim.jpg",
  },
  {
    title: "Sony Camera A6000",
    price: "$700",
    loc: "HCMC",
    img: "/sony-alpha-6000-8.jpg",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      <main className="w-full mx-auto px-4 sm:px-8 py-10 md:py-20 space-y-16 md:space-y-32">
        {/* Hero Section*/}
        <section className="relative w-full aspect-[4/5] md:aspect-21/9 overflow-hidden group/hero rounded-none border-none">
          <div className="absolute inset-0 z-0">
            <img
              src="/apple-watch-ultra.jpg"
               alt="Apple Watch Ultra Background"
              className="object-cover size-full grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover/hero:scale-100"
            />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
          </div>
          <div className="relative z-10 flex flex-col justify-center h-full max-w-5xl px-6 sm:px-12 md:px-20 py-10 md:py-16 text-white space-y-6 md:space-y-10">
            <div className="space-y-4">
              <Badge
                variant="outline"
                className="rounded-none border-primary/60 text-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-black/30"
              >
                Được tin dùng bởi hơn 5 người dùng
              </Badge>
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[120px] font-black tracking-tight md:tracking-[-0.04em] leading-none uppercase italic">
                Đồ tuy cũ
              </h1>
              <div className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-primary-light uppercase italic tracking-widest whitespace-nowrap opacity-90">
                Vẫn cứ là mlem!
              </div>
            </div>

            <div className="max-w-md space-y-6 md:space-y-8">
              <p className="text-base md:text-xl text-white/80 font-medium leading-relaxed">
                Sàn giao dịch cao cấp cho các mặt hàng đã qua sử dụng chất lượng cao.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto rounded-none h-14 md:h-16 px-8 md:px-10 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] group bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Link to="/products">
                    Khám phá ngay
                    <ArrowRight className="ml-3 size-4 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 z-20 text-right text-white">
            <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest opacity-70">
              Hàng mới về
            </p>
            <p className="text-lg md:text-2xl font-black italic uppercase">
              Bộ sưu tập đồng hồ
            </p>
          </div>
        </section>
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h2 className="text-4xl font-black tracking-tighter uppercase italic">
              Sản phẩm chọn lọc
            </h2>
          </div>

          <div className="relative group/slider px-4">
            <button className="prev-p absolute -left-4 top-[40%] -translate-y-1/2 z-10 size-12 flex items-center justify-center bg-background border rounded-full shadow-xl opacity-0 group-hover/slider:opacity-100 transition-opacity disabled:hidden">
              <ChevronLeft className="size-6" />
            </button>
            <button className="next-p absolute -right-4 top-[40%] -translate-y-1/2 z-10 size-12 flex items-center justify-center bg-background border rounded-full shadow-xl opacity-0 group-hover/slider:opacity-100 transition-opacity disabled:hidden">
              <ChevronRight className="size-6" />
            </button>

            <Swiper
              modules={[Navigation]}
              navigation={{
                prevEl: ".prev-p",
                nextEl: ".next-p",
              }}
              loop
              grabCursor
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 4 },
              }}
              className="w-full"
            >
              {products.map((p, i) => (
                <SwiperSlide key={i}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-4/5 bg-muted mb-6 overflow-hidden">
                      <img
                        src={p.img}
                        alt={p.title}
                        className="object-cover size-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      />
                      <div className="absolute bottom-0 left-0 w-full p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-background/90 backdrop-blur-sm">
                        <Button className="w-full rounded-none text-[10px] font-bold uppercase tracking-[0.2em]">
                          Xem nhanh
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-lg font-black uppercase italic leading-tight">
                          {p.title}
                        </h3>
                        <span className="text-sm font-bold">{p.price}</span>
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {p.loc} — Đang có sẵn
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      </main>
    </div>
  );
}
