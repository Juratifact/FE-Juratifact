import { useState, useEffect } from "react";
import { useSubscribe, useMySubscription } from "../hooks/usePromotions";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Loader2, X, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { PromotionPackage } from "../types";

interface SubscriptionModalProps {
  pkg: PromotionPackage | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function SubscriptionModal({ pkg, onClose, onSuccess }: SubscriptionModalProps) {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [startTime] = useState(() => new Date());
  const { mutate: subscribe, isPending: isSubscribing } = useSubscribe();
  
  const { data: subscriptions } = useMySubscription({
    enabled: !!qrUrl,
    refetchInterval: qrUrl ? 3000 : false,
  });

  useEffect(() => {
    if (pkg && !qrUrl) {
      subscribe(pkg.packageId, {
        onSuccess: (data: any) => {
          setQrUrl(data.qrUrl);
        },
        onError: (err: any) => {
          toast.error(err.message || "Không thể khởi tạo thanh toán");
          onClose();
        }
      });
    }
  }, [pkg, qrUrl, subscribe, onClose]);

  useEffect(() => {
    if (Array.isArray(subscriptions) && pkg) {
      // Find a subscription for this package that is marked as paid (paymentStatus === 1)
      // and started after we opened the modal
      const successfulSub = subscriptions.find(
        (sub) => 
          sub.promotionPackageId === pkg.packageId && 
          sub.paymentStatus === 1 &&
          new Date(sub.startTime) >= startTime
      );

      if (successfulSub) {
        toast.success("Thanh toán thành công!", {
          description: `Gói ${pkg.packageName} đã được kích hoạt thành công.`,
          duration: 5000,
        });
        onSuccess();
      }
    }
  }, [subscriptions, pkg, onSuccess]);

  if (!pkg) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Immersive Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xl transition-opacity animate-in fade-in duration-500" 
        onClick={onClose}
      />
      
      <Card className="relative w-full max-w-lg overflow-hidden rounded-[3.5rem] border-none bg-background shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-500">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-primary via-blue-500 to-primary animate-gradient-x" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
        
        <div className="absolute right-8 top-8 z-10">
          <Button
            variant="secondary"
            size="icon"
            className="h-12 w-12 rounded-2xl bg-muted/50 backdrop-blur-md opacity-70 transition-all hover:opacity-100 hover:scale-110 active:scale-95"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <CardContent className="p-10 md:p-14 text-center">
          <header className="space-y-4 mb-12">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h3 className="text-3xl font-black tracking-tighter">Nâng cấp đặc quyền</h3>
            <p className="text-muted-foreground font-medium max-w-[320px] mx-auto leading-relaxed">
              Quét mã QR an toàn để kích hoạt gói <span className="text-foreground font-bold">{pkg.packageName}</span> và bắt đầu hành trình mới.
            </p>
          </header>

          <div className="flex flex-col items-center justify-center">
            {isSubscribing ? (
              <div className="flex flex-col items-center py-24 space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
                    <Loader2 className="w-20 h-20 animate-spin text-primary relative z-10" />
                </div>
                <p className="text-sm font-black text-primary/60 tracking-widest uppercase animate-pulse">Đang thiết lập cổng thanh toán...</p>
              </div>
            ) : qrUrl ? (
              <div className="space-y-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="relative group mx-auto w-fit">
                    <div className="absolute -inset-6 bg-linear-to-r from-primary/30 via-fuchsia-500/30 to-blue-500/30 rounded-[4rem] blur-3xl opacity-50 group-hover:opacity-100 transition duration-1000 animate-pulse" />
                    <div className="relative p-8 bg-white rounded-[3rem] shadow-2xl ring-1 ring-black/5 transform transition-transform group-hover:scale-[1.02] duration-500">
                        <img src={qrUrl} alt="Payment QR Code" className="w-64 h-64 rounded-2xl" />
                        <div className="absolute inset-0 border-2 border-primary/10 rounded-[3rem] pointer-events-none" />
                    </div>
                    
                    <div className="absolute -top-4 -right-4 p-4 bg-emerald-500 rounded-2xl shadow-xl shadow-emerald-500/20 ring-4 ring-background">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                </div>
                
                <div className="space-y-4">
                  <div className="inline-flex flex-col items-center gap-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Tổng số tiền cần thanh toán</span>
                      <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-black tracking-tighter text-primary">
                            {pkg.price.toLocaleString("vi-VN")}
                          </span>
                          <span className="text-xl font-bold text-primary/60">VND</span>
                      </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 px-8 py-4 bg-primary/5 rounded-[2rem] text-primary text-sm font-black border border-primary/10 shadow-inner">
                    <div className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </div>
                    ĐANG CHỜ XÁC NHẬN GIAO DỊCH...
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <footer className="mt-14 p-6 rounded-[2.5rem] bg-muted/40 border border-dashed border-primary/20 flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4" />
                Thanh toán an toàn 100%
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground font-medium max-w-[340px]">
                  <strong>Lưu ý:</strong> Vui lòng không thay đổi nội dung chuyển khoản mặc định để hệ thống tự động xác nhận nhanh nhất.
              </p>
          </footer>
        </CardContent>
      </Card>
    </div>
  );
}
