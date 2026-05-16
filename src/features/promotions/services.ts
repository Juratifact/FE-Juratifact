import { createBaseService } from "@/shared/services/BaseService";
import type {
  PromotionPackage,
  PromotionFilterParams,
  PromotionPackageListResponse,
  PromotionApiResponse,
  PromotionPackageListData,
  CreatePromotionPackageDto,
  UpdatePromotionPackageDto,
  SubscriptionResponse,
  MySubscriptionResponse,
  AppliedProductResponse,
  ProductWithoutPromotion,
} from "./types";
import { API_ENDPOINTS } from "@/shared/constants";
import apiClient from "@/lib/axios";

const baseService = createBaseService<
  PromotionPackage,
  CreatePromotionPackageDto,
  UpdatePromotionPackageDto,
  PromotionFilterParams
>({
  endpoint: API_ENDPOINTS.PROMOTION.BASE,
  getAll: async (params) => {
    const response = await apiClient.get<PromotionApiResponse<PromotionPackageListData>>(
      API_ENDPOINTS.PROMOTION.GET_AVAILABLE_PACKAGES,
      {
        params: {
          pageSize: params?.limit ?? 10,
          pageIndex: params?.page ?? 1,
        },
      },
    );

    // Axios returns response.data.data directly if it exists (see src/lib/axios.ts)
    const data = response as unknown as PromotionPackageListData;
    
    const items = data.items ?? [];
    const totalItems = data.totalItems ?? 0;
    const itemsPerPage = data.pageSize > 0 ? data.pageSize : (params?.limit ?? 10);
    const currentPage = data.pageIndex > 0 ? data.pageIndex : (params?.page ?? 1);
    
    let totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    
    // Smart fallback: if the page is full, assume there might be more
    if (items.length >= itemsPerPage && totalPages <= currentPage) {
      totalPages = currentPage + 1;
    }

    // Ensure we can always see the pagination to go back if we are not on page 1
    totalPages = Math.max(totalPages, currentPage);

    return {
      data: items,
      meta: {
        totalItems,
        totalPages,
        itemsPerPage,
        currentPage,
        hasPreviousPage: currentPage > 1,
        hasNextPage: currentPage < totalPages,
      },
    } satisfies PromotionPackageListResponse;
  },
});

export const promotionService = {
  ...baseService,
  subscribe: async (packageId: string) => {
    const response = await apiClient.post<PromotionApiResponse<SubscriptionResponse>>(
      API_ENDPOINTS.PROMOTION.SUBSCRIBE(packageId),
    );
    return response as unknown as SubscriptionResponse;
  },
  getMySubscription: async () => {
    const response = await apiClient.get<PromotionApiResponse<MySubscriptionResponse[]>>(
      API_ENDPOINTS.PROMOTION.MY_SUBSCRIPTION,
    );
    return response as unknown as MySubscriptionResponse[];
  },
  applyToProduct: async (promotionPackageId: string, productId: string) => {
    await apiClient.post(API_ENDPOINTS.PROMOTION.APPLY, {
      promotionPackageId,
      productId,
    });
  },
  getAppliedProducts: async (packageId?: string) => {
    const endpoint = packageId 
      ? API_ENDPOINTS.PROMOTION.GET_PRODUCTS_BY_PACKAGE(packageId)
      : API_ENDPOINTS.PROMOTION.GET_APPLIED_PRODUCTS;
    const response = await apiClient.get<PromotionApiResponse<AppliedProductResponse[]>>(endpoint);
    return response as unknown as AppliedProductResponse[];
  },
  toggleAppliedProduct: async (productPromotionId: string) => {
    await apiClient.patch(`${API_ENDPOINTS.PROMOTION.GET_APPLIED_PRODUCTS}/${productPromotionId}/status`);
  },
  getProductsWithoutPromotion: async () => {
    const response = await apiClient.get<PromotionApiResponse<ProductWithoutPromotion[]>>(
      API_ENDPOINTS.PROMOTION.GET_PRODUCTS_WITHOUT_PROMOTION,
    );
    return response as unknown as ProductWithoutPromotion[];
  },
};
