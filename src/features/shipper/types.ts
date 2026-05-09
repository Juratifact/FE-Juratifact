import type { BaseFilterParams, PaginatedResponse } from "@/shared/types";

// ─── Order Item ──────────────────────────────────────────
export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
}

// ─── Shipper Order Entity ────────────────────────────────
export interface ShipperOrder {
  orderId: string;
  name: string;
  status: number; // 2 = pending, 5 = completed, etc.
  totalPrice: number;
  shippingFee: number;
  paymentMethod: string;
  paymentStatus: number; // 1 = pending, 2 = paid, etc.
  shippingAddress: string;
  customerName: string;
  customerPhone: string;
  pickupAt: string | null;
  deliveryAt: string | null;
  createdAt: string;
  expiresAt: string | null;
  shipperPod1Url: string | null;
  shipperPod2Url: string | null;
  items: OrderItem[];
}

// ─── Filter params ───────────────────────────────────────
export interface ShipperOrderFilterParams extends BaseFilterParams {
  status?: number;
  paymentStatus?: number;
}

// ─── Response types ──────────────────────────────────────
export type ShipperOrderListResponse = PaginatedResponse<ShipperOrder>;

// ─── Available Orders ────────────────────────────────────
export interface ShipperAvailableOrder {
  orderId: string;
  addressSeller?: string | null;
  addressBuyer?: string | null;
  totalPrice?: number;
}

export interface AvailableOrdersResponse {
  success: boolean;
  message?: string;
  data: ShipperAvailableOrder[];
}

export interface AcceptOrderDto {
  orderId: string;
  shipperId: string;
}

export interface AcceptOrderResponse {
  success: boolean;
  message?: string;
  data?: string | null;
}

export interface ConfirmActionResponse {
  success: boolean;
  message?: string;
  data?: string | null;
}

export interface ConfirmActionParams {
  orderId: string;
  shipperId: string;
  file?: File | null;
}

// Export UpdateShipperOrderDto as well
export type UpdateShipperOrderDto = {
  status?: number;
  shipperPod1Url?: string;
  shipperPod2Url?: string;
  pickupAt?: string;
  deliveryAt?: string;
};
