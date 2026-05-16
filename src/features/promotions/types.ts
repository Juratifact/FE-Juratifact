import type { BaseFilterParams, PaginatedResponse } from "@/shared/types";

export interface PromotionPackage {
  packageId: string;
  packageName: string;
  price: number;
  maxProductCount: number;
  promotionDaysPerSlot: number;
  usageLimitDays: number;
  description: string;
  availableFrom: string;
  availableTo: string;
  createdAt: string;
  updatedAt: string | null;
}

export type PromotionFilterParams = BaseFilterParams;

export type PromotionPackageListResponse = PaginatedResponse<PromotionPackage>;

// API Response Wrapper (matching the provided JSON)
export interface PromotionApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: string[] | null;
  traceId: string;
  timeStampUtc: string;
}

export interface PromotionPackageListData {
  items: PromotionPackage[];
  totalItems: number;
  pageSize: number;
  pageIndex: number;
}

export interface CreatePromotionPackageDto {
  packageName: string;
  description: string;
  price: number;
  maxProductCount: number;
  promotionDaysPerSlot: number;
  availableFrom: string;
  availableTo: string;
  usageLimitDays: number;
}

export type UpdatePromotionPackageDto = Partial<CreatePromotionPackageDto>;

export interface SubscriptionResponse {
  qrUrl: string;
}

export interface MySubscriptionResponse {
  id?: string;
  promotionPackageId: string;
  promotionPackageName: string;
  price: number;
  paymentStatus: number; // 0: Pending, 1: Success, 2: Failed/Expired
  totalSlot: number;
  usedSlot: number;
  startTime: string;
  endTime: string;
  availableFrom: string;
  availableTo: string;
}

export interface AppliedProductResponse {
  productPromotionId: string;
  userPromotionSubscriptionId: string;
  productId: string;
  isActive: boolean;
  activeAt: string;
  expiresAt: string;
}
