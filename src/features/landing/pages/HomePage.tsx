import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const products = [
  {
    title: "iPhone 13 128GB",
    price: "$450",
    loc: "HCMC",
    img: "src/shared/pictures/iPhone-13-Pro-Max-Front.jpg",
  },
  {
    title: "MacBook Air M1",
    price: "$620",
    loc: "HANOI",
    img: "src/shared/pictures/macbook.jpg",
  },
  {
    title: "Retro Sneaker",
    price: "$95",
    loc: "DANANG",
    img: "src/shared/pictures/NB.jpg",
  },
  {
    title: "Keyboard",
    price: "$55",
    loc: "CANTHO",
    img: "src/shared/pictures/banphim.jpg",
  },
  {
    title: "Sony Camera A6000",
    price: "$700",
    loc: "HCMC",
    img: "src/shared/pictures/sony-alpha-6000-8.jpg",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <main className="container mx-auto px-8 py-20 space-y-32">
        {/* Hero Section*/}
        <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-4">
              <Badge
                variant="outline"
                className="rounded-none border-primary/40 text-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
              >
                Trusted by 5+ Users
              </Badge>
              <h1 className="text-7xl md:text-[120px] font-black tracking-[-0.06em] leading-[0.85] uppercase italic">
                Better <br />
                <span className="text-muted-foreground/20">Pre-owned</span>{" "}
                <br />
                Better Life.
              </h1>
            </div>
            <div className="max-w-md space-y-8">
              <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                A premium marketplace for high-quality secondhand goods.
              </p>
              <div className="flex items-center gap-6">
                <Button
                  size="lg"
                  className="rounded-none h-16 px-10 text-xs font-bold uppercase tracking-[0.2em] group"
                >
                  Explore Market{" "}
                  <ArrowRight className="ml-3 size-4 group-hover:translate-x-2 transition-transform" />
                </Button>
                <button className="text-xs font-bold uppercase tracking-widest border-b-2 border-primary pb-1">
                  How it works
                </button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 aspect-4/5 bg-muted">
            {/* Thumbnail Hero */}
          </div>
        </section>

        {/* Product Carousel*/}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h2 className="text-4xl font-black tracking-tighter uppercase italic">
              Curated Picks
            </h2>
            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
              {["Recent", "Popular"].map((filter, idx) => (
                <button
                  key={filter}
                  className={`${idx === 0 ? "text-primary border-b-2 border-primary" : "text-muted-foreground"} pb-1`}
                >
                  {filter}
                </button>
              ))}
            </div>
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
                          Quick View
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
                        {p.loc} — Available Now
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
