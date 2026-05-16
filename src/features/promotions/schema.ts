import { z } from "zod";

const today = new Date();
today.setHours(0, 0, 0, 0);

const baseSchema = z.object({
  packageName: z.string().min(1, "Tên gói không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  price: z.number().min(0, "Giá phải là số dương"),
  maxProductCount: z.number().min(1, "Số lượng sản phẩm tối thiểu là 1"),
  promotionDaysPerSlot: z.number().min(1, "Thời gian mỗi lượt tối thiểu là 1 ngày"),
  usageLimitDays: z.number().min(1, "Hạn sử dụng tối thiểu là 1 ngày"),
  availableFrom: z
    .string()
    .min(1, "Ngày bắt đầu không được để trống")
    .refine((val) => {
      const date = new Date(val);
      date.setHours(0, 0, 0, 0);
      return date >= today;
    }, "Ngày bắt đầu không được ở trong quá khứ"),
  availableTo: z.string().min(1, "Ngày kết thúc không được để trống"),
});

export const promotionSchema = baseSchema.refine(
  (data) => {
    const start = new Date(data.availableFrom);
    const end = new Date(data.availableTo);
    return end >= start;
  },
  {
    message: "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu",
    path: ["availableTo"],
  }
);

export type PromotionFormData = z.infer<typeof baseSchema>;
