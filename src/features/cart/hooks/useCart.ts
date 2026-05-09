import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getMyCart,
  addProductToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../services";
import type { AddToCartDto, UpdateCartItemDto } from "../types";
import { QUERY_KEYS } from "@/shared/constants";
import { useAuthStore } from "@/features/auth/store";
import type { CartItem } from "../types";

const CART_QUERY_KEY = QUERY_KEYS.CART || ["cart"];

const normalizeCart = (response: unknown) => {
  if (Array.isArray(response)) {
    const items = response as CartItem[];
    return {
      items,
      total: items.reduce(
        (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1),
        0,
      ),
      itemCount: items.length,
    };
  }

  if (response && typeof response === "object") {
    const cart = response as Record<string, unknown>;
    const items = Array.isArray(cart.items) ? (cart.items as CartItem[]) : [];

    return {
      ...cart,
      items,
      total: typeof cart.total === "number" ? cart.total : 0,
      itemCount:
        typeof cart.itemCount === "number" ? cart.itemCount : items.length,
    };
  }

  return { items: [], total: 0, itemCount: 0 };
};

// ─── Get My Cart ────────────────────────────────────────
export function useMyCart() {
  const { access_token, userId } = useAuthStore();

  return useQuery({
    queryKey: [...CART_QUERY_KEY, userId ?? "guest"],
    queryFn: async () => normalizeCart(await getMyCart()),
    enabled: !!access_token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

// ─── Add to Cart ────────────────────────────────────────
export function useAddProductToCart() {
  const queryClient = useQueryClient();
  const { userId } = useAuthStore();

  return useMutation({
    mutationFn: (data: AddToCartDto) =>
      addProductToCart(userId ?? undefined, data),
    onSuccess: (response) => {
      toast.success("Thêm vào giỏ hàng thành công");
      queryClient.setQueryData(CART_QUERY_KEY, normalizeCart(response));
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
    onError: () => {
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
