import { PromotionPackageCard } from "../components/PromotionPackageCard";
import * as usePromotionsHook from "../hooks/usePromotions";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { AlertCircle, Star, Rocket, Target, TrendingUp, ShoppingBag } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { SubscriptionModal } from "../components/SubscriptionModal";
import { PromotionApplyModal } from "../components/PromotionApplyModal";
import { AppliedProductsModal } from "../components/AppliedProductsModal";
import { useState } from "react";
import { MyPromotionCard } from "../components/MyPromotionCard";
import { useMySubscription } from "../hooks/usePromotions";
import type { PromotionPackage, MySubscriptionResponse } from "../types";
import { cn } from "@/lib/utils";

export default function PromotionPackageCatalog() {
  const [activeTab, setActiveTab] = useState<"available" | "mine">("available");
  const { promotions, isLoading: isPromotionsLoading, error, refetch } = usePromotionsHook.usePromotions();
  const { data: mySubscriptions, isLoading: isSubsLoading, refetch: refetchSubs } = useMySubscription({
    enabled: activeTab === "mine",
  });
  const { data: appliedItems } = usePromotionsHook.useAppliedProducts(undefined, { 
    enabled: activeTab === "mine" 
  });
  const [selectedPkg, setSelectedPkg] = useState<PromotionPackage | null>(null);
  const [applyingSub, setApplyingSub] = useState<MySubscriptionResponse | null>(null);
  const [viewingAppliedSub, setViewingAppliedSub] = useState<MySubscriptionResponse | null>(null);

  const isLoading = (activeTab === "available" && isPromotionsLoading) || (activeTab === "mine" && isSubsLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-6 max-w-md mx-auto p-8 rounded-[2.5rem] bg-destructive/5 border border-destructive/10">
        <div className="p-4 bg-destructive/10 rounded-3xl">
          <AlertCircle className="w-12 h-12 text-destructive" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black tracking-tight">Đã xảy ra lỗi</h3>
          <p className="text-muted-foreground font-medium">Không thể tải danh sách gói ưu đãi. Vui lòng thử lại sau.</p>
        </div>
        <Button 
          onClick={() => window.location.reload()}
          className="rounded-full px-8 h-12 font-bold shadow-lg shadow-destructive/20"
        >
          Thử lại ngay
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-20 overflow-hidden">
      {/* Immersive Background Decor */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-20">
        {/* Modern Hero Section */}
        <section className="relative group p-1 md:p-1.5 rounded-[3rem] bg-linear-to-br from-primary/20 via-primary/5 to-background border border-primary/10 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-50" />
          
          <div className="relative z-10 p-12 md:p-20 flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest animate-in slide-in-from-left-4 duration-700">
                <Rocket className="w-3.5 h-3.5" />
                Giải pháp tăng trưởng
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                Đưa sản phẩm <br />
                <span className="text-primary italic relative">
                    Tỏa sáng rực rỡ
                    <div className="absolute -bottom-2 left-0 w-full h-2 bg-primary/20 rounded-full -rotate-1" />
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                Tăng tỷ lệ tiếp cận khách hàng gấp <span className="text-foreground font-black underline decoration-primary/30 decoration-4">10 lần</span> với các vị trí hiển thị nổi bật và công cụ quảng bá chuyên nghiệp.
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                  <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-background shadow-sm border border-primary/10">
                        <Target className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm font-bold text-muted-foreground">Đúng mục tiêu</span>
                  </div>
                  <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-background shadow-sm border border-primary/10">
                        <TrendingUp className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm font-bold text-muted-foreground">Hiệu quả cao</span>
                  </div>
              </div>
            </div>

            <div className="relative w-full md:w-auto shrink-0 animate-in fade-in zoom-in duration-1000 delay-300">
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-110" />
                <div className="relative bg-card/40 backdrop-blur-xl border border-white/10 p-8 rounded-[3rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                   <div className="space-y-4">
                      <div className="w-48 h-3 bg-primary/20 rounded-full" />
                      <div className="w-32 h-3 bg-muted rounded-full" />
                      <div className="flex gap-2">
                         <div className="w-12 h-12 rounded-2xl bg-primary/30" />
                         <div className="w-12 h-12 rounded-2xl bg-primary/30" />
                         <div className="w-12 h-12 rounded-2xl bg-primary/30" />
                      </div>
                   </div>
                   <div className="absolute -top-6 -right-6 p-4 bg-primary rounded-3xl shadow-xl shadow-primary/20">
                      <Star className="w-8 h-8 text-white fill-current animate-spin-slow" />
                   </div>
                </div>
            </div>
          </div>
        </section>

        {/* Catalog Section */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border/40 pb-10">
            <div className="space-y-4">
              <div className="inline-flex p-1.5 bg-muted/40 backdrop-blur-md rounded-[2rem] border border-border/50">
                <button
                  onClick={() => setActiveTab("available")}
                  className={cn(
                    "px-8 py-3 rounded-[1.75rem] text-sm font-black transition-all duration-500",
                    activeTab === "available" 
                      ? "bg-background shadow-xl text-primary scale-100" 
                      : "text-muted-foreground hover:text-foreground scale-95"
                  )}
                >
                  Gói sẵn có
                </button>
                <button
                  onClick={() => setActiveTab("mine")}
                  className={cn(
                    "px-8 py-3 rounded-[1.75rem] text-sm font-black transition-all duration-500",
                    activeTab === "mine" 
                      ? "bg-background shadow-xl text-primary scale-100" 
                      : "text-muted-foreground hover:text-foreground scale-95"
                  )}
                >
                  Gói đã mua
                </button>
              </div>
              <div className="space-y-1">
                <h2 className="text-4xl font-black tracking-tight">
                  {activeTab === "available" ? "Lựa chọn gói tối ưu" : "Gói ưu đãi của tôi"}
                </h2>
                <p className="text-muted-foreground font-medium">
                  {activeTab === "available" 
                    ? "Phù hợp với mọi quy mô kinh doanh của bạn." 
                    : "Quản lý và sử dụng các quyền lợi ưu đãi bạn đang sở hữu."}
                </p>
              </div>
            </div>
            <div className="px-6 py-3 rounded-[1.5rem] bg-muted/40 backdrop-blur-sm border border-border/50 font-bold text-sm flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Sẵn có: <span className="text-primary">{activeTab === "available" ? promotions.length : (mySubscriptions?.length ?? 0)}</span> lựa chọn
            </div>
          </div>

          {activeTab === "available" ? (
            !promotions.length ? (
              <div className="py-20 animate-in fade-in duration-700">
                <EmptyState
                  title="Hiện tại chưa có gói nào"
                  description="Các gói ưu đãi mới đang được chuẩn bị để sớm ra mắt. Vui lòng quay lại sau nhé!"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {promotions.map((pkg, idx) => (
                  <div 
                    key={pkg.packageId}
                    className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                    style={{ animationDelay: `${idx * 150}ms` }}
                  >
                    <PromotionPackageCard 
                      packageData={pkg} 
                      onSelect={() => setSelectedPkg(pkg)}
                      isPopular={idx === 1} // Mark second package as popular for UI demo
                    />
                  </div>
                ))}
              </div>
            )
          ) : (
            !mySubscriptions?.length ? (
              <div className="py-24 text-center space-y-8 animate-in fade-in duration-700">
                <div className="mx-auto w-24 h-24 bg-muted/30 rounded-[2.5rem] flex items-center justify-center border border-dashed border-primary/20">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground/40" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight">Bạn chưa có gói nào</h3>
                  <p className="text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed">
                    Khám phá các gói ưu đãi ngay để bắt đầu tăng trưởng doanh thu của bạn.
                  </p>
                </div>
                <Button 
                  onClick={() => setActiveTab("available")}
                  className="rounded-full px-10 h-12 font-bold shadow-lg shadow-primary/10"
                >
                  Xem các gói sẵn có
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {mySubscriptions.map((sub, idx) => (
                  <div 
                    key={`${sub.promotionPackageId}-${sub.startTime}`}
                    className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                    style={{ animationDelay: `${idx * 150}ms` }}
                  >
                    <MyPromotionCard 
                      subscription={sub} 
                      onUse={() => setApplyingSub(sub)}
                      onViewApplied={() => setViewingAppliedSub(sub)}
                      hasAppliedProducts={(appliedItems?.length ?? 0) > 0}
                    />
                  </div>
                ))}
              </div>
            )
          )}
        </section>

        {/* Improved Trust Section */}
        <footer className="relative mt-20 p-12 rounded-[2.5rem] bg-muted/40 border border-dashed border-primary/20 text-center space-y-4">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-background border rounded-full text-xs font-black uppercase tracking-widest text-primary shadow-sm">
             Thông tin quan trọng
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed italic max-w-2xl mx-auto">
            "Các gói ưu đãi có hiệu lực ngay sau khi thanh toán và được áp dụng trực tiếp vào sản phẩm bạn chọn. Chúng tôi cam kết minh bạch và hiệu quả trong mọi dịch vụ quảng bá."
          </p>
        </footer>
      </div>

      <SubscriptionModal 
        pkg={selectedPkg}
        onClose={() => setSelectedPkg(null)}
        onSuccess={() => {
          setSelectedPkg(null);
          refetch();
        }}
      />
      <PromotionApplyModal 
        subscription={applyingSub}
        onClose={() => {
          setApplyingSub(null);
          refetchSubs();
        }}
      />
      <AppliedProductsModal 
        subscription={viewingAppliedSub}
        onClose={() => setViewingAppliedSub(null)}
      />
    </div>
  );
}
