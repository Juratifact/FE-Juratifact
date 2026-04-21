import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { ArrowRight } from "lucide-react";

const categories = [
  { name: "Electronics", count: "1,240", link: "#" },
  { name: "Computing", count: "862", link: "#" },
  { name: "Fashion", count: "2,415", link: "#" },
  { name: "Home Living", count: "512", link: "#" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* Navigation - Ultra Clean */}
      <main className="container mx-auto px-8 py-20 space-y-32">
        {/* Hero Section - Typography Focused */}
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
                Verified by experts, loved by collectors.
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

          <div className="lg:col-span-4 grid gap-6">
            <div className="aspect-4/5 bg-muted relative overflow-hidden group">
              <img
                src="src/shared/pictures/apple-watch-ultra.jpg"
                className="object-cover size-full grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                  New Arrival
                </p>
                <p className="text-2xl font-black italic uppercase">
                  The Watch Collection
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories - No Icons, Just Typography */}
        <section className="space-y-12">
          <div className="flex items-baseline justify-between">
            <h2 className="text-4xl font-black tracking-tighter uppercase italic">
              Categories
            </h2>
            <div className="h-0.5 flex-1 mx-8 bg-muted hidden md:block" />
            <Button
              variant="link"
              className="text-xs font-bold uppercase tracking-widest p-0"
            >
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-border border border-border">
            {categories.map((cat) => (
              <a
                key={cat.name}
                href={cat.link}
                className="group bg-background p-12 hover:bg-primary transition-all duration-500"
              >
                <p className="text-xs font-bold text-muted-foreground group-hover:text-primary-foreground/60 transition-colors mb-2 uppercase tracking-tighter">
                  {cat.count} Items
                </p>
                <h3 className="text-3xl font-black italic uppercase group-hover:text-primary-foreground group-hover:translate-x-2 transition-all">
                  {cat.name}
                </h3>
              </a>
            ))}
          </div>
        </section>

        {/* Product Grid - Minimalist Cards */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h2 className="text-4xl font-black tracking-tighter uppercase italic">
              Curated Picks
            </h2>
            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
              {["Recent", "Popular", "Price Low", "Price High"].map(
                (filter, idx) => (
                  <button
                    key={filter}
                    className={`${idx === 0 ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"} pb-1 transition-all`}
                  >
                    {filter}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {[
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
                title: "Mechanical Keyboard",
                price: "$55",
                loc: "CANTHO",
                img: "src/shared/pictures/banphim.jpg",
              },
            ].map((p, i) => (
              <div key={i} className="group cursor-pointer">
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
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
