import type { OrderStatus, PaymentStatus } from "@/features/orders/types";

export interface SellerOrderItem {
  productId: string;
  productTitle: string;
  condition: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  imageUrl?: string[];
}

export interface SellerOrder {
  id: string;
  code: string;
  parentOrderId: string;
  parentOrderCode: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  shippingAddress: string;
  shippingVietMapRefId: string;
  shippingLatitude: number;
  shippingLongitude: number;
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  sellerAddress: string;
  sellerVietMapRefId: string;
  sellerVietMapDisplay: string;
  sellerLatitude: number;
  sellerLongitude: number;
  shipperId: string | null;
  shipperName: string | null;
  subtotalPrice: number;
  shippingFee: number;
  discountAmount: number;
  totalPrice: number;
  platformFee: number;
  sellerReceivableAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shipperPod1Url: string | null;
  shipperPod2Url: string | null;
  pickupAt: string | null;
  deliveryAt: string | null;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
  items: SellerOrderItem[];
}

export interface SellerOrderListResponse {
  items: SellerOrder[];
  totalItems: number;
  pageSize: number;
  pageIndex: number;
}

export interface SellerOrderFilterParams {
  status?: OrderStatus;
  pageSize?: number;
  pageIndex?: number;
}
