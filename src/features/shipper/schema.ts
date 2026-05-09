import { z } from "zod";

export const shipperOrderFilterSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(10),
  search: z.string().optional(),
  status: z.number().int().optional(),
  paymentStatus: z.number().int().optional(),
});

export type ShipperOrderFilterFormData = z.infer<
  typeof shipperOrderFilterSchema
>;

// For update order status (pickup, delivery, etc.)
export const updateShipperOrderSchema = z.object({
  status: z.number().int().positive(),
  shipperPod1Url: z.string().url().optional(),
  shipperPod2Url: z.string().url().optional(),
  pickupAt: z.string().datetime().optional(),
  deliveryAt: z.string().datetime().optional(),
});

export type UpdateShipperOrderDto = z.infer<typeof updateShipperOrderSchema>;
