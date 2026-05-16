import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Calendar, Package, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import type { MySubscriptionResponse } from "../types";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";

interface MyPromotionCardProps {
  subscription: MySubscriptionResponse;
  onUse?: () => void;
  onViewApplied?: () => void;
  hasAppliedProducts?: boolean;
}

export function MyPromotionCard({ subscription, onUse, onViewApplied, hasAppliedProducts }: MyPromotionCardProps) {
  const isExpired = new Date(subscription.endTime) < new Date();
  const isPending = subscription.paymentStatus === 0;
  const isSuccess = subscription.paymentStatus === 1;

  const getStatusDisplay = () => {
    if (isPending) return { label: "Chờ thanh toán", color: "bg-amber-500/10 text-amber-500", icon: Clock };
    if (isExpired) return { label: "Hết hạn", color: "bg-muted text-muted-foreground", icon: AlertCircle };
    if (isSuccess) return { label: "Đang hoạt động", color: "bg-emerald-500/10 text-emerald-500", icon: CheckCircle2 };
    return { label: "Không xác định", color: "bg-muted", icon: AlertCircle };
  };

  const status = getStatusDisplay();
  const StatusIcon = status.icon;

  return (
    <Card className="group relative overflow-hidden rounded-[2.5rem] border-none bg-card/40 backdrop-blur-md shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
      <div className={cn("absolute top-0 left-0 w-full h-1.5", isSuccess ? "bg-emerald-500" : isPending ? "bg-amber-500" : "bg-muted")} />
      
      <CardContent className="p-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">
              {subscription.promotionPackageName}
            </h3>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Gói ưu đãi của tôi
            </p>
          </div>
          <Badge className={cn("rounded-xl px-3 py-1 font-bold border-none", status.color)}>
            <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
            {status.label}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-3xl bg-muted/30 border border-border/50 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-wider">Lượt dùng</span>
            </div>
            <p className="text-lg font-black tracking-tighter">
              {subscription.usedSlot} <span className="text-sm font-bold text-muted-foreground">/ {subscription.totalSlot}</span>
            </p>
          </div>

          <div className="p-4 rounded-3xl bg-muted/30 border border-border/50 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-wider">Hết hạn</span>
            </div>
            <p className="text-sm font-black tracking-tight">
              {new Date(subscription.endTime).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <span>Tiến độ sử dụng</span>
                <span>{Math.round((subscription.usedSlot / subscription.totalSlot) * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                <div 
                    className={cn("h-full transition-all duration-1000", isSuccess ? "bg-emerald-500" : "bg-muted")}
                    style={{ width: `${(subscription.usedSlot / subscription.totalSlot) * 100}%` }}
                />
            </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border/40">
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Giá gói</span>
                <span className="text-lg font-black text-primary tracking-tighter">{subscription.price.toLocaleString("vi-VN")}đ</span>
            </div>
            
            <div className="flex items-center gap-2">
                {isSuccess && (subscription.usedSlot > 0 || hasAppliedProducts) && (
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="rounded-full px-4 font-bold h-9 text-[11px] bg-muted/50 hover:bg-muted"
                      onClick={onViewApplied}
                    >
                        Sản phẩm đã áp dụng
                    </Button>
                )}

                {isSuccess && subscription.usedSlot < subscription.totalSlot && (
                    <Badge 
                      variant="outline" 
                      className="rounded-full px-4 py-1.5 border-primary/20 text-primary font-bold hover:bg-primary/10 transition-colors cursor-pointer"
                      onClick={onUse}
                    >
                        Sử dụng ngay
                    </Badge>
                )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
