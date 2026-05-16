import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { QUERY_KEYS } from "@/shared/constants";
import { promotionService } from "../services";
import type { PromotionFilterParams, CreatePromotionPackageDto } from "../types";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function usePromotions() {
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();

  const filter = useMemo<PromotionFilterParams>(() => {
    const params = new URLSearchParams(queryString);
    return {
      page: Number(params.get("page")) || 1,
      limit: Number(params.get("limit")) || 10,
      search: params.get("search") || undefined,
    };
  }, [queryString]);

  const query = useQuery({
    queryKey: [...QUERY_KEYS.PROMOTIONS, filter],
    queryFn: () => promotionService.getAll(filter),
    placeholderData: (prev) => prev,
  });

  return {
    promotions: query.data?.data ?? [],
    pagination: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useCreatePromotion() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreatePromotionPackageDto) => promotionService.create(data),
    onSuccess: () => {
      toast.success("Tạo gói ưu đãi thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROMOTIONS });
      navigate("/admin/promotions");
    },
    onError: (error: any) => {
      toast.error(error.message || "Không thể tạo gói ưu đãi");
    },
  });
}

export function useDeletePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => promotionService.remove(id),
    onSuccess: () => {
      toast.success("Xóa gói ưu đãi thành công!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROMOTIONS });
    },
    onError: (error: any) => {
      toast.error(error.message || "Không thể xóa gói ưu đãi");
    },
  });
}

export function useSubscribe() {
  return useMutation({
    mutationFn: (packageId: string) => promotionService.subscribe(packageId),
  });
}

export function useMySubscription(options?: { enabled?: boolean; refetchInterval?: number | false }) {
  return useQuery({
    queryKey: ["my-subscription"],
    queryFn: () => promotionService.getMySubscription(),
    ...options,
  });
}

export function useApplyPromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ promotionPackageId, productId }: { promotionPackageId: string; productId: string }) =>
      promotionService.applyToProduct(promotionPackageId, productId),
    onSuccess: () => {
      toast.success("Áp dụng ưu đãi cho sản phẩm thành công!");
      queryClient.invalidateQueries({ queryKey: ["my-subscription"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_PRODUCTS });
    },
    onError: (error: any) => {
      toast.error(error.message || "Không thể áp dụng ưu đãi");
    },
  });
}

export function useAppliedProducts(packageId?: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: packageId ? ["applied-products", packageId] : ["applied-products"],
    queryFn: () => promotionService.getAppliedProducts(packageId),
    ...options,
  });
}

export function useTogglePromotion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productPromotionId: string) =>
      promotionService.toggleAppliedProduct(productPromotionId),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái ưu đãi thành công!");
      // Invalidate all related queries to ensure UI updates everywhere
      queryClient.invalidateQueries({ queryKey: ["applied-products"] });
      queryClient.invalidateQueries({ queryKey: ["my-subscription"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_PRODUCTS });
    },
    onError: (error: any) => {
      toast.error(error.message || "Không thể cập nhật trạng thái");
    },
  });
}
export function useProductsWithoutPromotion(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS_WITHOUT_PROMOTION,
    queryFn: () => promotionService.getProductsWithoutPromotion(),
    ...options,
  });
}
