import type { PaginatedResponse } from "@/shared/types";
import type { CartFormData } from "./schema";

// ─── Cart Entity ────────────────────────────────────────
export interface CartItem {
  id: string;
  productId: string;
  title?: string;
  price?: number;
  quantity: number;
  imageUrls?: string[];
  product?: {
    id: string;
    title: string;
    price: number;
    imageUrls: string[];
  };
}

export interface Cart {
  id?: string;
  userId?: string;
  items: CartItem[];
  total?: number;
  itemCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Create / Update DTOs ───────────────────────────────
export interface AddToCartDto {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface RemoveFromCartDto {
  productId: string;
}

// ─── Response types ─────────────────────────────────────
export interface AddToCartResponse {
  success: boolean;
  message?: string;
  data?: Cart;
}

export interface CartResponse {
  success: boolean;
  data: Cart;
}

export type CartListResponse = PaginatedResponse<Cart>;

// ─── Form Props ──────────────────────────────────────────
export interface CartFormProps {
  defaultValues?: Partial<AddToCartDto>;
  onSubmit: (data: CartFormData) => void;
  isPending?: boolean;
  submitLabel?: string;
}
