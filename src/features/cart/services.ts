import apiClient from "@/lib/axios";
import type { AddToCartDto, Cart, AddToCartResponse } from "./types";

const CART_ENDPOINTS = {
  MY_CART: "/api/Cart/my-cart",
  ADD_PRODUCT: "/api/Cart/api/add-product-to-cart",
};

export const cartService = {
  async getMyCart(): Promise<Cart> {
    const res = await apiClient.get<Cart>(CART_ENDPOINTS.MY_CART);
    return res.data;
  },

  async addProductToCart(
    userId: string | undefined,
    data: AddToCartDto,
  ): Promise<AddToCartResponse> {
    const params = userId ? { userId } : {};
    const res = await apiClient.post<AddToCartResponse>(
      CART_ENDPOINTS.ADD_PRODUCT,
      data,
      {
        params,
      },
    );

    return res.data;
  },
};

export default cartService;
