import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type { SellerOrder, SellerOrderFilterParams, SellerOrderListResponse } from "./types";

export const sellerOrderService = {
  getMyOrders: async (params?: SellerOrderFilterParams): Promise<SellerOrderListResponse> => {
    const response = await apiClient.get<SellerOrderListResponse>(
      API_ENDPOINTS.SELLER_ORDER.MY_ORDERS,
      { params }
    );
    return response as unknown as SellerOrderListResponse;
  },
  getById: async (id: string): Promise<SellerOrder> => {
    const response = await apiClient.get<SellerOrder>(
      API_ENDPOINTS.SELLER_ORDER.GET_BY_ID(id)
    );
    return response as unknown as SellerOrder;
  },
};
