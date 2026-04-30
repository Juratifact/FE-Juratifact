import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { reportSchema, type ReportFormData } from "../schema";
import type { ReportFormProps } from "../types";

export function ReportForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = "Gửi báo cáo",
}: ReportFormProps) {
  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reportedProductId: defaultValues?.reportedProductId || "",
      reason: defaultValues?.reason || "",
      description: defaultValues?.description || "",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="reportedProductId">ID Sản phẩm báo cáo</Label>
        <Input
          id="reportedProductId"
          placeholder="Nhập ID sản phẩm"
          {...form.register("reportedProductId")}
          disabled={isPending}
        />
        {form.formState.errors.reportedProductId && (
          <p className="text-sm text-red-500">
            {form.formState.errors.reportedProductId.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Lý do báo cáo</Label>
        <Input
          id="reason"
          placeholder="Nhập lý do báo cáo"
          {...form.register("reason")}
          disabled={isPending}
        />
        {form.formState.errors.reason && (
          <p className="text-sm text-red-500">
            {form.formState.errors.reason.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả chi tiết (Tùy chọn)</Label>
        <textarea
          id="description"
          placeholder="Nhập mô tả chi tiết về vấn đề báo cáo"
          {...form.register("description")}
          disabled={isPending}
          rows={5}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
        {form.formState.errors.description && (
          <p className="text-sm text-red-500">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Đang gửi..." : submitLabel}
      </Button>
    </form>
  );
}
