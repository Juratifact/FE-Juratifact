import { z } from "zod";

export const reportSchema = z.object({
  reportedProductId: z.string().min(1, "Sản phẩm báo cáo không được để trống"),
  reason: z.string().min(1, "Lý do báo cáo không được để trống"),
  description: z.string().optional(),
});

export type ReportFormData = z.infer<typeof reportSchema>;
