import { Card, CardContent, CardFooter, CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Package, Calendar, Info, CheckCircle2, Star, Sparkles } from "lucide-react";
import type { PromotionPackage } from "../types";
import { cn } from "@/lib/utils";


interface PromotionPackageCardProps {
  packageData: PromotionPackage;
  onSelect?: (packageId: string) => void;
  isPopular?: boolean;
}

export function PromotionPackageCard({ packageData, onSelect, isPopular }: PromotionPackageCardProps) {
  const isFree = packageData.price === 0;

  return (
    <Card className={cn(
      "group relative flex flex-col h-full transition-all duration-500 rounded-[2.5rem] border-none overflow-hidden",
      "bg-card hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-2",
      isPopular && "ring-2 ring-primary shadow-xl shadow-primary/10"
    )}>
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-500" />

      {isPopular && (
        <div className="absolute top-6 right-6 z-10">
          <Badge className="bg-primary text-primary-foreground rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 animate-pulse">
            <Sparkles className="mr-1.5 h-3 w-3" />
            Phổ biến nhất
          </Badge>
        </div>
      )}

      <CardHeader className="relative z-10 p-8 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={cn(
                "p-2 rounded-2xl",
                isPopular ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
                <Star className="h-5 w-5 fill-current" />
            </div>
            <h3 className="text-2xl font-black tracking-tight">{packageData.packageName}</h3>
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Tăng trưởng kinh doanh vượt trội
          </p>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 flex-grow p-8 pt-4 space-y-8">
        {/* Pricing Area */}
        <div className="space-y-1">
           <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black tracking-tighter">
                {isFree ? "Miễn phí" : packageData.price.toLocaleString("vi-VN")}
              </span>
              {!isFree && <span className="text-sm font-bold text-muted-foreground">VND</span>}
           </div>
           <p className="text-xs text-muted-foreground/60 font-semibold uppercase tracking-widest">
             Áp dụng cho mỗi lần đăng ký
           </p>
        </div>

        {/* Description */}
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          {packageData.description || "Gói ưu đãi giúp tối ưu khả năng hiển thị và tiếp cận người dùng mục tiêu một cách tự nhiên."}
        </p>

        {/* Features List */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 group/item">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 transition-colors group-hover/item:bg-blue-500 group-hover/item:text-white">
              <Package className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-tighter">Sản phẩm tối đa</span>
                <span className="text-sm font-bold">{packageData.maxProductCount} sản phẩm</span>
            </div>
          </div>

          <div className="flex items-center gap-4 group/item">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-colors group-hover/item:bg-emerald-500 group-hover/item:text-white">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-tighter">Thời lượng ưu đãi</span>
                <span className="text-sm font-bold">{packageData.promotionDaysPerSlot} ngày mỗi lượt</span>
            </div>
          </div>

          <div className="flex items-center gap-4 group/item">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 transition-colors group-hover/item:bg-amber-500 group-hover/item:text-white">
              <Info className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-tighter">Giới hạn sử dụng</span>
                <span className="text-sm font-bold">{packageData.usageLimitDays} ngày</span>
            </div>
          </div>
        </div>

        {/* Availability Badge */}
        <div className="pt-6 border-t border-dashed">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-[11px] font-bold text-muted-foreground/80">Khả dụng đến</span>
            </div>
            <span className="text-[11px] font-black">{new Date(packageData.availableTo).toLocaleDateString("vi-VN")}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-8 pt-0">
        <Button 
          className={cn(
            "w-full h-14 rounded-[1.25rem] font-bold text-base transition-all duration-300 active:scale-[0.98]",
            isPopular ? "shadow-lg shadow-primary/20" : "hover:bg-primary hover:text-primary-foreground"
          )}
          onClick={() => onSelect?.(packageData.packageId)}
          variant={isPopular ? "default" : "secondary"}
        >
          {isFree ? "Trải nghiệm ngay" : "Nâng cấp gói"}
        </Button>
      </CardFooter>
    </Card>
  );
}
