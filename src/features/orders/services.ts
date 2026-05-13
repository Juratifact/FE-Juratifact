import { createBaseService } from "@/shared/services/BaseService";
import type {
  CreateOrderDto,
  Order,
  OrderFilterParams,
  UpdateOrderDto,
  OrderItem,
} from "./types";
import { API_ENDPOINTS } from "@/shared/constants";
import apiClient from "@/lib/axios";

export const orderService = createBaseService<
  Order,
  CreateOrderDto,
  UpdateOrderDto,
  OrderFilterParams
>({
  endpoint: API_ENDPOINTS.ORDER.BASE,
  // default remove uses base service; additional endpoints below
});

export const orderActions = {
  checkout: async (data: CreateOrderDto): Promise<Order> =>
    (await apiClient.post(
      API_ENDPOINTS.ORDER.CREATE,
      data,
    )) as unknown as Order,
  getMyOrders: async (): Promise<Order[]> =>
    (await apiClient.get(API_ENDPOINTS.ORDER.MY_ORDERS)) as unknown as Order[],
  confirmReceipt: async (orderId: string): Promise<void> => {
    await apiClient.put(API_ENDPOINTS.ORDER.CONFIRM_RECEIPT(orderId));
  },
  cancel: async (
    orderId: string,
    data?: { reason?: string },
  ): Promise<void> => {
    await apiClient.put(API_ENDPOINTS.ORDER.CANCEL(orderId), data);
  },
  getById: async (orderId: string): Promise<Order> =>
    (await apiClient.get(
      API_ENDPOINTS.ORDER.GET_BY_ID(orderId),
    )) as unknown as Order,
  getStatus: async (orderId: string) =>
    (await apiClient.get(
      API_ENDPOINTS.ORDER.GET_STATUS(orderId),
    )) as unknown as Order,
  getProductsByOrderId: async (orderId: string, productId: string) =>
    (await apiClient.get(
      API_ENDPOINTS.ORDER.GET_PRODUCTS_BY_ORDER(orderId, productId),
    )) as unknown as OrderItem,
  cancelCheckout: async (orderId: string) =>
    (await apiClient.put(
      API_ENDPOINTS.ORDER.CANCEL_CHECKOUT(orderId),
    )) as unknown as Order,
};
