import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import { createBaseService } from "@/shared/services/BaseService";
import type {
  AcceptOrderDto,
  AcceptOrderResponse,
  ShipperAvailableOrder,
  ShipperOrder,
  ShipperOrderFilterParams,
  UpdateShipperOrderDto,
  ConfirmActionParams,
  ConfirmActionResponse,
} from "./types";

// Base service for shipper orders (my orders)
export const shipperOrderService = createBaseService<
  ShipperOrder,
  unknown,
  UpdateShipperOrderDto,
  ShipperOrderFilterParams
>({
  endpoint: `${API_ENDPOINTS.SHIPPER.BASE}/${"{shipperId}"}/my-orders`,
});

// Available orders service
export const shipperAvailableOrdersService = {
  getAvailableOrders: async (): Promise<ShipperAvailableOrder[]> => {
    const response = await apiClient.get(
      API_ENDPOINTS.SHIPPER.AVAILABLE_ORDERS,
    );
    // apiClient interceptor already unwraps axios response, so this is usually an array
    if (Array.isArray(response)) {
      return response as ShipperAvailableOrder[];
    }
    if (response && typeof response === "object" && "data" in response) {
      return (response as { data?: ShipperAvailableOrder[] }).data ?? [];
    }
    return [];
  },

  acceptOrder: async (data: AcceptOrderDto): Promise<AcceptOrderResponse> => {
    const response = await apiClient.post(
      API_ENDPOINTS.SHIPPER.ACCEPT_ORDER,
      {},
      {
        params: { orderId: data.orderId, shipperId: data.shipperId },
      },
    );
    return response as unknown as AcceptOrderResponse;
  },
  confirmPickup: async (
    params: ConfirmActionParams,
  ): Promise<ConfirmActionResponse> => {
    const fd = new FormData();
    if (params.file) {
      fd.append("pod1Image", params.file);
    }
    const response = await apiClient.post(
      `${API_ENDPOINTS.SHIPPER.BASE}/confirm-pickup`,
      fd,
      {
        params: { orderId: params.orderId, shipperId: params.shipperId },
      },
    );
    return response as unknown as ConfirmActionResponse;
  },
  confirmDelivery: async (
    params: ConfirmActionParams,
  ): Promise<ConfirmActionResponse> => {
    const fd = new FormData();
    if (params.file) {
      fd.append("pod2Image", params.file);
    }
    const response = await apiClient.post(
      `${API_ENDPOINTS.SHIPPER.BASE}/confirm-delivery`,
      fd,
      {
        params: { orderId: params.orderId, shipperId: params.shipperId },
      },
    );
    return response as unknown as ConfirmActionResponse;
  },
};

// Legacy shipperActions for backward compatibility
export const shipperActions = {
  getAvailableOrders: shipperAvailableOrdersService.getAvailableOrders,
  acceptOrder: shipperAvailableOrdersService.acceptOrder,
};

// Additional actions for shipper orders
export const shipperOrderActions = {
  getMyOrders: async (
    shipperId: string,
    filters?: ShipperOrderFilterParams,
  ) => {
    const endpoint = `${API_ENDPOINTS.SHIPPER.BASE}/${shipperId}/my-orders`;
    const response = await apiClient.get(endpoint, { params: filters });
    const items: ShipperOrder[] = Array.isArray(response)
      ? response
      : response && typeof response === "object" && "data" in response
        ? ((response as { data?: ShipperOrder[] }).data ?? [])
        : [];
    const total = items.length;
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? (items.length || 10);
    return { data: items, meta: { total, page, limit } };
  },

  getOrderDetail: async (shipperId: string, orderId: string) => {
    const response = await apiClient.get(
      API_ENDPOINTS.SHIPPER.MY_ORDERS_BY_ID,
      {
        params: { shipperId, orderId },
      },
    );
    return response as unknown as ShipperOrder;
  },

  updateOrderStatus: async (
    shipperId: string,
    orderId: string,
    data: UpdateShipperOrderDto,
  ) => {
    const endpoint = `${API_ENDPOINTS.SHIPPER.BASE}/${shipperId}/my-orders/${orderId}`;
    const response = await apiClient.patch(endpoint, data);
    return response as unknown as ShipperOrder;
  },
};
