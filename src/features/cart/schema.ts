import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID không được để trống"),
  quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
});

export type CartFormData = z.infer<typeof addToCartSchema>;
export type UpdateCartItemFormData = z.infer<typeof updateCartItemSchema>;
