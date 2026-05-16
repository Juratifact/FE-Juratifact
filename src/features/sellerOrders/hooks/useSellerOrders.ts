import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { QUERY_KEYS } from "@/shared/constants";
import { sellerOrderService } from "../services";
import type { SellerOrderFilterParams } from "../types";
import type { OrderStatus } from "@/features/orders/types";

export function useSellerOrders() {
  const [searchParams] = useSearchParams();
  
  const filter = useMemo<SellerOrderFilterParams>(() => {
    return {
      pageIndex: Number(searchParams.get("pageIndex")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
      status: searchParams.get("status") ? (Number(searchParams.get("status")) as OrderStatus) : undefined,
    };
  }, [searchParams]);

  const query = useQuery({
    queryKey: [...QUERY_KEYS.SELLER_ORDERS, filter],
    queryFn: () => sellerOrderService.getMyOrders(filter),
    placeholderData: (prev) => prev,
  });

  return {
    orders: query.data?.items ?? [],
    totalItems: query.data?.totalItems ?? 0,
    isLoading: query.isLoading,
    error: query.error,
    filter,
  };
}

export function useSellerOrderDetail(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.SELLER_ORDERS, id],
    queryFn: () => sellerOrderService.getById(id),
    enabled: !!id,
  });
}
