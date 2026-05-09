import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useMemo } from "react";
import type {
  CreateOrderDto,
  GroupedOrder,
  OrderFilterParams,
  OrderStatus,
  PaymentStatus,
} from "../types";
import { orderService, orderActions } from "../services";
import { QUERY_KEYS } from "@/shared/constants";
interface MyOrderRow {
  productId: string;
  title: string;
  condition?: string;
  price?: number;
  sellerId?: string;
  userName?: string | null;
  sellerName?: string;
  orderId: string;
  orderCode?: string;
  name?: string;
  status?: number;
  paymentStatus?: number;
  quantity?: number;
}

// use the exported GroupedOrder from types.ts

export function useOrders() {
  const [searchParams] = useSearchParams();
  const filter = useMemo<OrderFilterParams>(() => {
    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status")
        ? (Number(searchParams.get("status")) as OrderStatus)
        : undefined,
      userId: searchParams.get("userId") || undefined,
    };
  }, [searchParams]);

  const query = useQuery({
    queryKey: [QUERY_KEYS.ORDERS, filter],
    queryFn: () => orderService.getAll(filter),
    placeholderData: (prev) => prev,
  });

  return {
    orders: query.data?.data ?? [],
    pagination: query.data?.meta,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderDto) => orderActions.checkout(data),
    onSuccess: () => {
      toast.success("Tạo đơn hàng thành công");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      // Don't navigate here - let the caller handle it
    },
  });
}

export function useConfirmReceipt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => orderActions.confirmReceipt(orderId),
    onSuccess: () => {
      toast.success("Xác nhận nhận hàng thành công");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: { reason?: string } }) =>
      orderActions.cancel(id, data),
    onSuccess: () => {
      toast.success("Huỷ đơn hàng thành công");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
    },
  });
}

export function useOrderDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.ORDER_DETAIL(id),
    queryFn: () => orderActions.getById(id),
    enabled: !!id,
  });
}

export function useMyOrders() {
  return useQuery({
    queryKey: QUERY_KEYS.MY_ORDERS,
    queryFn: async () => {
      const rows =
        (await orderActions.getMyOrders()) as unknown as MyOrderRow[];
      // API returns flat rows (one per product) with an orderId — group into orders
      const map = new Map<string, GroupedOrder>();
      rows.forEach((r: MyOrderRow) => {
        const id = r.orderId;
        const existing: GroupedOrder = map.get(id) || {
          id,
          code: r.orderCode ?? undefined,
          recipientName: r.name ?? undefined,
          totalAmount: 0,
          status: r.status,
          paymentStatus: r.paymentStatus as PaymentStatus | undefined,
          items: [],
          sellerName: r.sellerName,
        };

        existing.items.push({
          productId: r.productId,
          productName: r.title,
          quantity: r.quantity ?? 1,
          unitPrice: r.price,
          condition: r.condition,
        });

        existing.totalAmount = (existing.totalAmount || 0) + (r.price || 0);
        map.set(id, existing);
      });

      return Array.from(map.values());
    },
  });
}
export function useOrderProductDetail(orderId: string, productId: string) {
  return useQuery({
    queryKey: ["orders", orderId, "products", productId],
    queryFn: async () => {
      const response = await orderActions.getProductsByOrderId(
        orderId,
        productId,
      );
      return response;
    },
    enabled: !!orderId && !!productId,
  });
}
export function useCancelCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => orderActions.cancelCheckout(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_ORDERS });
    },
  });
}
