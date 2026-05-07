import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartService } from "../services";
import type { AddToCartDto, Cart, CartItem, AddToCartResponse } from "../types";
import { useMemo } from "react";

const CART_QUERY_KEY = ["cart", "my-cart"] as const;

const patchCartWithAddedItem = (
  current: Cart | undefined,
  added: CartItem,
): Cart => {
  if (!current) return { items: [added], total: added.price ?? 0 };

  const existing = current.items.find((i) => i.productId === added.productId);
  if (existing) {
    return {
      ...current,
      items: current.items.map((i) =>
        i.productId === added.productId
          ? { ...i, quantity: (i.quantity ?? 0) + (added.quantity ?? 0) }
          : i,
      ),
    };
  }

  return { ...current, items: [added, ...current.items] };
};

export function useMyCart() {
  const query = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: () => cartService.getMyCart(),
  });

  const cart = useMemo(() => query.data ?? { items: [] }, [query.data]);

  return {
    cart: cart as Cart,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useAddProductToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId?: string; data: AddToCartDto }) =>
      cartService.addProductToCart(userId, data),
    onSuccess: (res: AddToCartResponse) => {
      toast.success("Added to cart");

      // Try to patch cache optimistically if backend returns the created cart item
      const maybeItem = res.data as CartItem | undefined;

      if (maybeItem) {
        queryClient.setQueryData(CART_QUERY_KEY, (current: unknown) =>
          patchCartWithAddedItem(current as Cart | undefined, maybeItem),
        );
      }

      // ensure backend sync
      queryClient.refetchQueries({ queryKey: CART_QUERY_KEY, type: "active" });
    },
  });
}

export default useMyCart;
