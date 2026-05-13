import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
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
      API_ENDPOINTS.SHIPPER.ACCEPT_ORDER(data.shipperId, data.orderId),
      {},
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
      API_ENDPOINTS.SHIPPER.PICKUP(params.shipperId, params.orderId),
      fd,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
      API_ENDPOINTS.SHIPPER.DELIVERY(params.shipperId, params.orderId),
      fd,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
    const endpoint = API_ENDPOINTS.SHIPPER.GET_MY_ORDERS(shipperId);
    const response = await apiClient.get(endpoint, {
      params: {
        pageIndex: filters?.page ?? 1,
        pageSize: filters?.limit ?? 10,
        searchTerm: filters?.search,
        status: filters?.status,
        paymentStatus: filters?.paymentStatus,
      },
    });

    // Extract items from response (could be array or wrapped in object)
    const items: ShipperOrder[] = Array.isArray(response)
      ? response
      : response && typeof response === "object" && "items" in response
        ? ((response as { items?: ShipperOrder[] }).items ?? [])
        : response && typeof response === "object" && "data" in response
          ? ((response as { data?: ShipperOrder[] }).data ?? [])
          : [];

    // Extract pagination info from response metadata
    const responseRecord =
      response && typeof response === "object"
        ? (response as unknown as Record<string, unknown>)
        : {};
    const metaRecord =
      responseRecord.meta && typeof responseRecord.meta === "object"
        ? (responseRecord.meta as Record<string, unknown>)
        : responseRecord;
    const total =
      (metaRecord.totalItems as number | undefined) ??
      (metaRecord.totalCount as number | undefined) ??
      (metaRecord.total as number | undefined) ??
      items.length;
    const page =
      (metaRecord.currentPage as number | undefined) ??
      (metaRecord.pageIndex as number | undefined) ??
      filters?.page ??
      1;
    const limit =
      (metaRecord.pageSize as number | undefined) ??
      (metaRecord.itemsPerPage as number | undefined) ??
      filters?.limit ??
      10;

    return { data: items, meta: { total, page, limit } };
  },

  getOrderDetail: async (shipperId: string, orderId: string) => {
    const response = await apiClient.get(
      API_ENDPOINTS.SHIPPER.GET_ORDER_DETAIL(shipperId, orderId),
    );
    return response as unknown as ShipperOrder;
  },

  updateOrderStatus: async (
    shipperId: string,
    orderId: string,
    data: UpdateShipperOrderDto,
  ) => {
    const endpoint = API_ENDPOINTS.SHIPPER.GET_ORDER_DETAIL(shipperId, orderId);
    const response = await apiClient.patch(endpoint, data);
    return response as unknown as ShipperOrder;
  },
};
