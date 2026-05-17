import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { PromotionForm } from "../components/PromotionForm";
import { useCreatePromotion } from "../hooks/usePromotions";
import type { PromotionFormData } from "../schema";

export default function ManagePromotionCreate() {
  const navigate = useNavigate();
  const createMutation = useCreatePromotion();

  const handleSubmit = (data: PromotionFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="relative min-h-screen pb-20 animate-in fade-in duration-700">
      {/* Decorative background */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="h-12 w-12 rounded-2xl border-muted bg-background/50 backdrop-blur-sm shadow-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest">
                Thiết lập hệ thống
              </div>
              <h1 className="text-4xl font-black tracking-tighter">Tạo gói ưu đãi mới</h1>
              <p className="text-sm text-muted-foreground font-medium">Xây dựng giải pháp tăng trưởng hiệu quả cho cộng đồng người bán.</p>
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Glass Card Container */}
          <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-[3rem] -z-10 scale-95" />
          <div className="bg-background/60 backdrop-blur-xl border border-white/20 p-2 rounded-[3.5rem] shadow-2xl">
            <div className="bg-background rounded-[3rem] p-10 md:p-14 border border-muted/20">
              <PromotionForm 
                onSubmit={handleSubmit} 
                isPending={createMutation.isPending} 
              />
            </div>
          </div>
        </div>

        <div className="text-center p-8 border border-dashed rounded-[2.5rem] bg-muted/20">
            <p className="text-xs text-muted-foreground font-medium italic">
                Lưu ý: Mọi thay đổi về thông số gói ưu đãi sẽ được áp dụng ngay lập tức cho các giao dịch mới.
            </p>
        </div>
      </div>
    </div>
  );
}
