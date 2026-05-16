import { useAppliedProducts, useTogglePromotion } from "../hooks/usePromotions";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Loader2, X, Package, ExternalLink, Calendar } from "lucide-react";
import { Switch } from "@/shared/components/ui/switch";
import type { MySubscriptionResponse } from "../types";
import { cn } from "@/lib/utils";

interface AppliedProductsModalProps {
  subscription: MySubscriptionResponse | null;
  onClose: () => void;
}

export function AppliedProductsModal({ subscription, onClose }: AppliedProductsModalProps) {
  const { data: currentApplied = [], isLoading } = useAppliedProducts(subscription?.promotionPackageId, { 
    enabled: !!subscription 
  });
  
  const toggleMutation = useTogglePromotion();

  if (!subscription) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xl animate-in fade-in duration-500" 
        onClick={onClose}
      />
      
      <Card className="relative w-full max-w-2xl overflow-hidden rounded-[3.5rem] border-none bg-background shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-500">
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
        
        <div className="absolute right-8 top-8 z-10">
          <Button
            variant="secondary"
            size="icon"
            className="h-12 w-12 rounded-2xl bg-muted/50 backdrop-blur-md opacity-70 transition-all hover:opacity-100"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <CardContent className="p-10 md:p-14">
          <header className="space-y-4 mb-10 text-center">
            <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mb-6">
                <Package className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-3xl font-black tracking-tighter">Sản phẩm đang áp dụng</h3>
            <p className="text-muted-foreground font-medium max-w-md mx-auto leading-relaxed">
              Danh sách sản phẩm đang sử dụng ưu đãi từ gói <span className="text-foreground font-bold">{subscription.promotionPackageName}</span>.
            </p>
          </header>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center py-20 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Đang tải dữ liệu...</p>
              </div>
            ) : currentApplied.length === 0 ? (
              <div className="text-center py-20 space-y-4 bg-muted/20 rounded-[2.5rem] border border-dashed">
                <Package className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                <p className="text-muted-foreground font-medium">Chưa có sản phẩm nào được áp dụng gói này.</p>
              </div>
            ) : (
              currentApplied.map((item) => (
                <div 
                  key={item.productPromotionId}
                  className="group relative flex items-center gap-6 p-4 rounded-[2rem] bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all duration-300"
                >
                  <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden shadow-lg bg-background">
                    <img 
                      src={item.imageUrl?.[0] || "/placeholder-product.png"} 
                      alt={item.productTitle || "Product"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-bold text-lg truncate group-hover:text-primary transition-colors">{item.productTitle || "Sản phẩm không xác định"}</h4>
                    <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                       <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                          Hết hạn: {new Date(item.expiresAt).toLocaleDateString("vi-VN")}
                       </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-1.5 px-3 border-l border-border/50">
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-tighter transition-colors",
                        item.isActive ? "text-emerald-500" : "text-muted-foreground/40"
                      )}>
                        {item.isActive ? "Đang bật" : "Đang tắt"}
                      </span>
                      <Switch 
                        checked={item.isActive} 
                        onCheckedChange={() => toggleMutation.mutate(item.productPromotionId)}
                        disabled={toggleMutation.isPending}
                        className="data-[state=checked]:bg-emerald-500 scale-90"
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                      asChild
                    >
                      <a href={`/products/${item.productId}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <footer className="mt-10 pt-8 border-t border-border/40">
             <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground font-medium">
                   <Package className="w-4 h-4" />
                   Tổng cộng: 
                   <span className="text-foreground font-black">{currentApplied.length} sản phẩm</span>
                </div>
                <p className="text-[11px] text-muted-foreground italic">
                   Ưu đãi sẽ tự động kết thúc khi gói hết hạn.
                </p>
             </div>
          </footer>
        </CardContent>
      </Card>
    </div>
  );
}
