import { useState } from "react";
import { useMyProducts } from "@/features/products/hooks/useProduct";
import { useApplyPromotion } from "../hooks/usePromotions";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Loader2, X, Search, Package, Check, Sparkles } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import type { MySubscriptionResponse } from "../types";


interface PromotionApplyModalProps {
  subscription: MySubscriptionResponse | null;
  onClose: () => void;
}

export function PromotionApplyModal({ subscription, onClose }: PromotionApplyModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { products, isLoading: isProductsLoading } = useMyProducts({ 
    limit: 50,
    title: searchTerm || undefined,
    enabled: !!subscription 
  });
  const { mutate: apply, isPending: isApplying } = useApplyPromotion();

  if (!subscription) return null;

  const handleApply = (productId: string) => {
    apply({ promotionPackageId: subscription.promotionPackageId, productId }, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xl animate-in fade-in duration-500" 
        onClick={onClose}
      />
      
      <Card className="relative w-full max-w-2xl overflow-hidden rounded-[3.5rem] border-none bg-background shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-500">
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-primary via-blue-500 to-primary" />
        
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
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-3xl font-black tracking-tighter">Áp dụng ưu đãi</h3>
            <p className="text-muted-foreground font-medium max-w-md mx-auto leading-relaxed">
              Chọn sản phẩm bạn muốn áp dụng gói <span className="text-foreground font-bold">{subscription.promotionPackageName}</span>.
            </p>
          </header>

          <div className="relative mb-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Tìm kiếm sản phẩm của bạn..."
              className="h-16 pl-14 pr-6 rounded-3xl bg-muted/40 border-none text-lg font-medium focus-visible:ring-2 focus-visible:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {isProductsLoading ? (
              <div className="flex flex-col items-center py-20 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Đang tải sản phẩm...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 space-y-4 bg-muted/20 rounded-[2.5rem] border border-dashed">
                <Package className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                <p className="text-muted-foreground font-medium">Không tìm thấy sản phẩm nào.</p>
              </div>
            ) : (
              products.map((product) => (
                <div 
                  key={product.id}
                  className="group relative flex items-center gap-6 p-4 rounded-[2rem] bg-muted/30 border border-border/50 hover:bg-muted/50 hover:border-primary/20 transition-all duration-300"
                >
                  <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src={product.imageUrls[0] || "/placeholder-product.png"} 
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="font-bold text-lg truncate group-hover:text-primary transition-colors">{product.title}</h4>
                    <p className="text-sm text-primary font-black">{product.price.toLocaleString("vi-VN")}đ</p>
                  </div>

                  <Button
                    size="sm"
                    className="rounded-2xl px-6 font-bold h-11"
                    disabled={isApplying}
                    onClick={() => handleApply(product.id)}
                  >
                    {isApplying ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Chọn
                      </>
                    )}
                  </Button>
                </div>
              ))
            )}
          </div>

          <footer className="mt-10 pt-8 border-t border-border/40">
             <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground font-medium">
                   <Package className="w-4 h-4" />
                   Số lượt còn lại: 
                   <span className="text-foreground font-black">{subscription.totalSlot - subscription.usedSlot}</span>
                </div>
                <p className="text-[11px] text-muted-foreground italic">
                   Lưu ý: Thao tác này không thể hoàn tác.
                </p>
             </div>
          </footer>
        </CardContent>
      </Card>
    </div>
  );
}
