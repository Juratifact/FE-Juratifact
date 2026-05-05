import type { BaseFilterParams, PaginatedResponse } from "@/shared/types";
import type { ProductFormData } from "./schema";

// ─── Product Entity ───────────────────────────────────────
export interface Product {
  id: string;
  sellerId?: string;
  sellerFullName?: string;
  sellerUserName?: string;
  sellerProfilePicture?: string;
  title: string;
  description?: string;
  condition: "New" | "Like new" | "Good";
  price: number;
  status: 0 | 1; // 0: Sold/Unavailable, 1: Available
  imageUrls: string[];
  videoUrls?: string[];
  comments?: ProductComment[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductComment {
  id: string;
  commentId?: string;
  content: string;
  createdAt: string;
  parentCommentId?: string;
  replyCount?: number;
  displayName?: string;
  userName?: string;
}

export type ProductCommentResponse = ProductComment & {
  productId?: string;
};

// ─── Filter params ───────────────────────────────────────
export interface ProductFilterParams extends BaseFilterParams {
  title?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price" | "date" | "relevance";
  sortOrder?: "ASC" | "DESC";
}

// ─── Response types ──────────────────────────────────────
export type ProductListResponse = PaginatedResponse<Product>;

// ─── Create / Update DTOs ────────────────────────────────
export interface CreateProductDto {
  title: string;
  description?: string;
  condition: Product["condition"];
  price: number;
  image?: File | null;
  video?: File | null;
  imageUrls?: string[];
  videoUrls?: string[];
}

export interface CreateProductCommentDto {
  productId: string;
  content: string;
  parentCommentId?: string;
}

export type UpdateProductDto = Partial<CreateProductDto>;

export interface UpdateMyProductDto {
  title?: string;
  description?: string;
  condition?: Product["condition"];
  price?: number;
  image?: File | null;
  video?: File | null;
  status?: Product["status"];
}

// ─── Form Props ──────────────────────────────────────────
export interface ProductFormProps {
  defaultValues?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  isPending?: boolean;
  submitLabel?: string;
}

// ─── Infinity Scroll State ──────────────────────────────
export interface InfinityScrollState {
  items: Product[];
  hasMore: boolean;
  isLoading: boolean;
  error: Error | null;
  pageIndex: number;
}
