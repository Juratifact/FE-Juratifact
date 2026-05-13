import apiClient from "@/lib/axios";
import type { AddToCartDto, Cart, UpdateCartItemDto } from "./types";
import { API_ENDPOINTS } from "@/shared/constants";

// ─── Get My Cart ────────────────────────────────────────
export const getMyCart = async (): Promise<Cart> => {
  return (await apiClient.get<Cart>(
    API_ENDPOINTS.CART.MY_CART,
  )) as unknown as Cart;
};

// ─── Add Product to Cart ────────────────────────────────
export const addProductToCart = async (
  userId: string | undefined,
  data: AddToCartDto,
): Promise<Cart> => {
  if (!userId) {
    throw new Error("userId is required to add product to cart");
  }
  return (await apiClient.post<Cart>(
    API_ENDPOINTS.CART.ADD_ITEM(userId),
    data,
  )) as unknown as Cart;
};

// ─── Update Cart Item ───────────────────────────────────
export const updateCartItem = async (
  itemId: string,
  data: UpdateCartItemDto,
): Promise<Cart> => {
  return (await apiClient.patch<Cart>(
    `${API_ENDPOINTS.CART.MY_CART}/${itemId}`,
    data,
  )) as unknown as Cart;
};

// ─── Remove Cart Item ───────────────────────────────────
export const removeCartItem = async (
  userId: string | undefined,
  productId: string,
): Promise<Cart> => {
  if (!userId) {
    throw new Error("userId is required to remove product from cart");
  }
  return (await apiClient.delete<Cart>(
    API_ENDPOINTS.CART.REMOVE_ITEM(userId, productId),
  )) as unknown as Cart;
};

// ─── Clear Cart ─────────────────────────────────────────
export const clearCart = async (): Promise<Cart> => {
  return (await apiClient.post<Cart>(
    API_ENDPOINTS.CART.MY_CART,
  )) as unknown as Cart;
};

// ─── Default Export ─────────────────────────────────────
export const cartService = {
  getMyCart,
  addProductToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};

export default cartService;
