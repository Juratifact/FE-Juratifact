import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMemo } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { promotionSchema, type PromotionFormData } from "../schema";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Package, Coins, Settings, Calendar, Info } from "lucide-react";
interface PromotionFormProps {
  defaultValues?: Partial<PromotionFormData>;
  onSubmit: (data: PromotionFormData) => void;
  isPending?: boolean;
  submitLabel?: string;
}

export function PromotionForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = "Tạo gói ưu đãi",
}: PromotionFormProps) {
  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema) as any,
    defaultValues: {
      packageName: defaultValues?.packageName || "",
      description: defaultValues?.description || "",
      price: defaultValues?.price || 0,
      maxProductCount: defaultValues?.maxProductCount || 1,
      promotionDaysPerSlot: defaultValues?.promotionDaysPerSlot || 1,
      usageLimitDays: defaultValues?.usageLimitDays || 30,
      availableFrom: defaultValues?.availableFrom || new Date().toISOString().split('T')[0],
      availableTo: defaultValues?.availableTo || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  });

  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
      {/* Section 1: Thông tin cơ bản */}
      <Card className="rounded-[2.5rem] border-none bg-muted/30 shadow-sm overflow-hidden">
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
                <Package className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black tracking-tight">Thông tin cơ bản</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="packageName" className="text-sm font-bold ml-1">Tên gói ưu đãi</Label>
              <Input
                id="packageName"
                placeholder="Ví dụ: Gói Gold, Gói Siêu Cấp..."
                {...form.register("packageName")}
                disabled={isPending}
                className="h-12 rounded-2xl bg-background border-muted focus:ring-4 focus:ring-primary/10 transition-all"
              />
              {form.formState.errors.packageName && (
                <p className="text-xs font-bold text-destructive ml-1">
                  {form.formState.errors.packageName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-bold ml-1 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                Giá niêm yết (VND)
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="0"
                {...form.register("price", { valueAsNumber: true })}
                disabled={isPending}
                className="h-12 rounded-2xl bg-background border-muted focus:ring-4 focus:ring-primary/10 transition-all"
              />
              {form.formState.errors.price && (
                <p className="text-xs font-bold text-destructive ml-1">
                  {form.formState.errors.price.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-bold ml-1">Mô tả chi tiết</Label>
            <Textarea
              id="description"
              placeholder="Mô tả các quyền lợi đặc biệt của gói này..."
              {...form.register("description")}
              disabled={isPending}
              rows={4}
              className="rounded-2xl bg-background border-muted resize-none focus:ring-4 focus:ring-primary/10 transition-all"
            />
            {form.formState.errors.description && (
              <p className="text-xs font-bold text-destructive ml-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[2.5rem] border-none bg-muted/30 shadow-sm overflow-hidden">
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-500">
                <Settings className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black tracking-tight">Cấu hình & Giới hạn</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <Label htmlFor="maxProductCount" className="text-sm font-bold ml-1">Sản phẩm tối đa</Label>
              <Input
                id="maxProductCount"
                type="number"
                {...form.register("maxProductCount", { valueAsNumber: true })}
                disabled={isPending}
                className="h-12 rounded-2xl bg-background border-muted"
              />
              {form.formState.errors.maxProductCount && (
                <p className="text-xs font-bold text-destructive ml-1">
                  {form.formState.errors.maxProductCount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="promotionDaysPerSlot" className="text-sm font-bold ml-1">Ngày/Lượt ưu đãi</Label>
              <Input
                id="promotionDaysPerSlot"
                type="number"
                {...form.register("promotionDaysPerSlot", { valueAsNumber: true })}
                disabled={isPending}
                className="h-12 rounded-2xl bg-background border-muted"
              />
              {form.formState.errors.promotionDaysPerSlot && (
                <p className="text-xs font-bold text-destructive ml-1">
                  {form.formState.errors.promotionDaysPerSlot.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="usageLimitDays" className="text-sm font-bold ml-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-amber-500" />
                Tổng hạn dùng
              </Label>
              <Input
                id="usageLimitDays"
                type="number"
                {...form.register("usageLimitDays", { valueAsNumber: true })}
                disabled={isPending}
                className="h-12 rounded-2xl bg-background border-muted"
              />
              {form.formState.errors.usageLimitDays && (
                <p className="text-xs font-bold text-destructive ml-1">
                  {form.formState.errors.usageLimitDays.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[2.5rem] border-none bg-muted/30 shadow-sm overflow-hidden">
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
                <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black tracking-tight">Thời gian khả dụng</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="availableFrom" className="text-sm font-bold ml-1">Khả dụng từ ngày</Label>
              <Input
                id="availableFrom"
                type="date"
                min={minDate}
                {...form.register("availableFrom")}
                disabled={isPending}
                className="h-12 rounded-2xl bg-background border-muted"
              />
              {form.formState.errors.availableFrom && (
                <p className="text-xs font-bold text-destructive ml-1">
                  {form.formState.errors.availableFrom.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableTo" className="text-sm font-bold ml-1">Khả dụng đến ngày</Label>
              <Input
                id="availableTo"
                type="date"
                min={form.watch("availableFrom") || minDate}
                {...form.register("availableTo")}
                disabled={isPending}
                className="h-12 rounded-2xl bg-background border-muted"
              />
              {form.formState.errors.availableTo && (
                <p className="text-xs font-bold text-destructive ml-1">
                  {form.formState.errors.availableTo.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="pt-6 flex flex-col sm:flex-row gap-4">
        <Button 
          type="submit" 
          disabled={isPending} 
          className="flex-1 h-14 rounded-full text-lg font-black shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
        >
          {isPending ? "Đang xử lý..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
