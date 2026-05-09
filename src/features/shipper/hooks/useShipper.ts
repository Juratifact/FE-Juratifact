import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useMemo } from "react";
import type { ShipperOrderFilterParams, UpdateShipperOrderDto } from "../types";
import {
  shipperOrderActions,
  shipperAvailableOrdersService,
} from "../services";
import { QUERY_KEYS } from "@/shared/constants";
import { useAuthStore } from "@/features/auth/store";
import type { ConfirmActionParams } from "../types";

// ─── Available Orders Hooks ──────────────────────────────

export function useAvailableOrders() {
  return useQuery({
    queryKey: [QUERY_KEYS.SHIPPER_AVAILABLE_ORDERS],
    queryFn: () => shipperAvailableOrdersService.getAvailableOrders(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAcceptOrder() {
  const queryClient = useQueryClient();
  const { userId } = useAuthStore();

  return useMutation({
    mutationFn: (orderId: string) =>
      shipperAvailableOrdersService.acceptOrder({
        orderId,
        shipperId: userId || "",
      }),
    onSuccess: () => {
      toast.success("Nhận đơn hàng thành công!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SHIPPER_AVAILABLE_ORDERS],
      });
    },
    onError: () => {
      toast.error("Nhận đơn hàng thất bại!");
    },
  });
}

// ─── My Orders Hooks ─────────────────────────────────────

export function useShipperOrders() {
  const [searchParams] = useSearchParams();
  const { userId } = useAuthStore();
  const shipperId = userId || "";

  const filter = useMemo<ShipperOrderFilterParams>(() => {
    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status")
        ? Number(searchParams.get("status"))
        : undefined,
      paymentStatus: searchParams.get("paymentStatus")
        ? Number(searchParams.get("paymentStatus"))
        : undefined,
    };
  }, [searchParams]);

  const query = useQuery({
    queryKey: [QUERY_KEYS.SHIPPER_AVAILABLE_ORDERS, filter, shipperId],
    queryFn: () => shipperOrderActions.getMyOrders(shipperId, filter),
    enabled: !!shipperId,
    placeholderData: (prev) => prev,
  });

  return {
    orders: query.data?.data ?? [],
    pagination: query.data?.meta,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useShipperOrderDetail(orderId: string) {
  const { userId } = useAuthStore();
  const shipperId = userId || "";

  return useQuery({
    queryKey: ["shipper-order", shipperId, orderId],
    queryFn: () => shipperOrderActions.getOrderDetail(shipperId, orderId),
    enabled: !!shipperId && !!orderId,
  });
}

export function useUpdateShipperOrder() {
  const queryClient = useQueryClient();
  const { userId } = useAuthStore();
  const shipperId = userId || "";

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: Partial<UpdateShipperOrderDto>;
    }) =>
      shipperOrderActions.updateOrderStatus(
        shipperId,
        orderId,
        data as UpdateShipperOrderDto,
      ),
    onSuccess: (_, variables) => {
      toast.success("Cập nhật đơn hàng thành công!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SHIPPER_AVAILABLE_ORDERS],
      });
      queryClient.invalidateQueries({
        queryKey: ["shipper-order", shipperId, variables.orderId],
      });
    },
    onError: () => {
      toast.error("Cập nhật đơn hàng thất bại!");
    },
  });
}

export function useConfirmPickup() {
  const queryClient = useQueryClient();
  const { userId } = useAuthStore();

  return useMutation({
    mutationFn: (data: { orderId: string; file?: File | null }) =>
      shipperAvailableOrdersService.confirmPickup({
        orderId: data.orderId,
        shipperId: userId || "",
        file: data.file ?? null,
      } as ConfirmActionParams),
    onSuccess: (_, variables) => {
      toast.success("Xác nhận lấy hàng thành công!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SHIPPER_AVAILABLE_ORDERS],
      });
      queryClient.invalidateQueries({
        queryKey: ["shipper-order", userId, variables.orderId],
      });
    },
    onError: () => {
      toast.error("Xác nhận lấy hàng thất bại!");
    },
  });
}

export function useConfirmDelivery() {
  const queryClient = useQueryClient();
  const { userId } = useAuthStore();

  return useMutation({
    mutationFn: (data: { orderId: string; file?: File | null }) =>
      shipperAvailableOrdersService.confirmDelivery({
        orderId: data.orderId,
        shipperId: userId || "",
        file: data.file ?? null,
      } as ConfirmActionParams),
    onSuccess: (_, variables) => {
      toast.success("Xác nhận giao hàng thành công!");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SHIPPER_AVAILABLE_ORDERS],
      });
      queryClient.invalidateQueries({
        queryKey: ["shipper-order", userId, variables.orderId],
      });
    },
    onError: () => {
      toast.error("Xác nhận giao hàng thất bại!");
    },
  });
}
