import type { BaseFilterParams, PaginatedResponse } from "@/shared/types";

export type OrderStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type PaymentStatus = 0 | 1 | 2 | 3 | 4;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  0: "Chờ thanh toán",
  1: "Đã thanh toán",
  2: "Đã phân công",
  3: "Đang giao",
  4: "Đã giao",
  5: "Hoàn thành",
  6: "Đã huỷ",
  7: "Tranh chấp",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  0: "Chưa thanh toán",
  1: "Đã thanh toán",
  2: "Đã tất toán",
  3: "Đã hoàn tiền",
  4: "Thanh toán thất bại",
};

export function getOrderStatusLabel(status?: number) {
  if (status === undefined || status === null) return "-";
  return ORDER_STATUS_LABELS[status as OrderStatus] ?? String(status);
}

export function getPaymentStatusLabel(status?: number) {
  if (status === undefined || status === null) return "-";
  return PAYMENT_STATUS_LABELS[status as PaymentStatus] ?? String(status);
}

export interface OrderItem {
  productId: string;
  productName?: string;
  quantity: number;
  unitPrice?: number;
  condition?: string;
}

export interface PaymentInfo {
  orderId: string;
  paymentUrl?: string;
  qrCode?: string;
  status?: number;
  paymentStatus?: PaymentStatus;
}

export interface Order {
  id: string;
  code?: string;
  userId?: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface GroupedOrder {
  id: string;
  code?: string;
  recipientName?: string;
  totalAmount: number;
  status?: number;
  paymentStatus?: PaymentStatus;
  items: (OrderItem & { condition?: string; unitPrice?: number })[];
  sellerName?: string;
  parentOrderStatus?: number;
  canConfirmReceipt?: boolean;
  sellerOrderId?: string;
}

export interface OrderFilterParams extends BaseFilterParams {
  status?: OrderStatus;
  userId?: string;
}

export type OrderListResponse = PaginatedResponse<Order>;

export interface CreateOrderDto {
  shippingAddress: string;
  vietMapRefId: string;
  cartDetailIds: string[];
}

export type UpdateOrderDto = Partial<CreateOrderDto> & { status?: OrderStatus };

export interface CancelOrderDto {
  reason?: string;
}

export interface CheckoutFormValues {
  shippingAddress: string;
  itemsJson: string; // simple helper for manual input when not wired with cart
}
