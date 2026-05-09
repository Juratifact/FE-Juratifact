import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getMyCart,
  addProductToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../services";
import type { AddToCartDto, Cart, UpdateCartItemDto } from "../types";
import { QUERY_KEYS } from "@/shared/constants";
import { useAuthStore } from "@/features/auth/store";
import type { CartItem } from "../types";

const CART_QUERY_KEY = QUERY_KEYS.CART || ["cart"];
const DUPLICATE_PRODUCT_ERROR = "DUPLICATE_PRODUCT_IN_CART";

const normalizeCart = (response: any): Cart => {
  if (!response || typeof response !== "object") {
    return { items: [], total: 0, itemCount: 0 };
  }

  // Handle both flat response or data wrapper
  const data = response.data ?? response;
  const items = Array.isArray(data.items) ? (data.items as CartItem[]) : [];
  
  const total = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  return {
    ...data,
    items,
    total,
    itemCount: typeof data.totalItems === "number" ? data.totalItems : items.length,
  };
};

// ─── Get My Cart ────────────────────────────────────────
export function useMyCart(enabled = true) {
  const access_token = useAuthStore((s) => s.access_token);
  const userId = useAuthStore((s) => s.userId);

  return useQuery({
    queryKey: [...CART_QUERY_KEY, userId ?? "guest"],
    queryFn: async () => normalizeCart(await getMyCart()),
    enabled: enabled && !!access_token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

// ─── Add to Cart ────────────────────────────────────────
export function useAddProductToCart() {
  const queryClient = useQueryClient();
  const { userId } = useAuthStore();
  const cartQueryKey = [...CART_QUERY_KEY, userId ?? "guest"];

  return useMutation({
    mutationFn: async (data: AddToCartDto) => {
      const cached = queryClient.getQueryData(cartQueryKey) as
        | { items?: CartItem[] }
        | undefined;
      const existed = (cached?.items ?? []).some(
        (item) =>
          item.productId === data.productId,
      );

      if (existed) {
        throw new Error(DUPLICATE_PRODUCT_ERROR);
      }

      return addProductToCart(userId ?? undefined, data);
    },
    onSuccess: (response) => {
      toast.success("Thêm vào giỏ hàng thành công");
      queryClient.setQueryData(cartQueryKey, normalizeCart(response));
      queryClient.invalidateQueries({ queryKey: cartQueryKey });
    },
    onError: (error) => {
      if (error instanceof Error && error.message === DUPLICATE_PRODUCT_ERROR) {
        toast.info("Sản phẩm đã có trong giỏ hàng");
        return;
      }
      toast.error("Không thể thêm vào giỏ hàng");
    },
  });
}

// ─── Update Cart Item ───────────────────────────────────
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      data,
    }: {
      itemId: string;
      data: UpdateCartItemDto;
    }) => updateCartItem(itemId, data),
    onSuccess: (response) => {
      toast.success("Cập nhật giỏ hàng thành công");
      queryClient.setQueryData(CART_QUERY_KEY, normalizeCart(response));
    },
    onError: () => {
      toast.error("Không thể cập nhật giỏ hàng");
    },
  });
}

// ─── Remove from Cart ───────────────────────────────────
export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const { userId } = useAuthStore();

  return useMutation({
    mutationFn: (productId: string) =>
      removeCartItem(userId ?? undefined, productId),
    onSuccess: async () => {
      toast.success("Xóa khỏi giỏ hàng thành công");
      await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: () => {
      toast.error("Không thể xóa khỏi giỏ hàng");
    },
  });
}

// ─── Clear Cart ─────────────────────────────────────────
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: async () => {
      toast.success("Xóa toàn bộ giỏ hàng thành công");
      await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: () => {
      toast.error("Không thể xóa giỏ hàng");
    },
  });
}
