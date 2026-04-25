import { createBaseService } from "@/shared/services/BaseService";
import type {
  CreateProductCommentDto,
  CreateProductDto,
  ProductListResponse,
  Product,
  ProductFilterParams,
  ProductComment,
  UpdateProductDto,
} from "./types";
import { API_ENDPOINTS } from "@/shared/constants";
import apiClient from "@/lib/axios";

type ProductApiItem = Partial<Product> & {
  id?: string;
  productId?: string;
  title?: string;
  description?: string;
  condition?: string;
  price?: number;
  status?: number;
  imageUrls?: string[];
  imageUrl?: string[];
  videoUrls?: string[];
  video?: Array<string | null>;
  createdAt?: string;
  updatedAt?: string;
  comments?: ProductComment[];
};

const normalizeArray = (value: unknown): string[] => {
  if (typeof value === "string" && value.length > 0) {
    return [value];
  }
  if (!Array.isArray(value)) return [];
  return value.filter(
    (x): x is string => typeof x === "string" && x.length > 0,
  );
};

const normalizeCondition = (value: unknown): Product["condition"] => {
  if (value === "New" || value === "Like new" || value === "Good") {
    return value;
  }

  if (value === "Mới") return "New";
  if (value === "Như mới") return "Like new";
  if (value === "Tốt") return "Good";

  return "Good";
};

const normalizeProduct = (item: ProductApiItem): Product => {
  return {
    id: item.id ?? item.productId ?? crypto.randomUUID(),
    title: item.title ?? "Product",
    description: item.description ?? "",
    condition: normalizeCondition(item.condition),
    price: Number(item.price ?? 0),
    status: item.status === 1 ? 1 : 0,
    imageUrls: normalizeArray(item.imageUrls ?? item.imageUrl),
    videoUrls: normalizeArray(item.videoUrls ?? item.video),
    comments: item.comments ?? [],
    createdAt: item.createdAt ?? new Date().toISOString(),
    updatedAt: item.updatedAt ?? item.createdAt ?? new Date().toISOString(),
  };
};

export const productService = createBaseService<
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductFilterParams
>({
  endpoint: API_ENDPOINTS.PRODUCT.BASE,
  create: async (data) => {
    const formData = new FormData();

    formData.append("Title", data.title);
    formData.append("Condition", data.condition);
    formData.append("Price", String(data.price));

    if (data.description?.trim()) {
      formData.append("Description", data.description.trim());
    }

    if (data.image) {
      formData.append("Image", data.image);
    }

    if (data.video) {
      formData.append("Video", data.video);
    }

    const created = (await apiClient.post(
      API_ENDPOINTS.PRODUCT.POST,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    )) as ProductApiItem;

    return normalizeProduct(created);
  },
  getAll: async (params) => {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;

    const raw = (await apiClient.get(API_ENDPOINTS.PRODUCT.BASE, {
      params: {
        ...params,
        pageIndex: page,
        pageSize: limit,
      },
    })) as {
      items?: Product[];
      data?: Product[];
      meta?: {
        totalItems?: number;
        totalCount?: number;
        totalPages?: number;
        currentPage?: number;
        pageIndex?: number;
        itemsPerPage?: number;
        pageSize?: number;
        hasPreviousPage?: boolean;
        hasNextPage?: boolean;
      };
      totalItems?: number;
      totalCount?: number;
      totalPages?: number;
      currentPage?: number;
      pageIndex?: number;
      itemsPerPage?: number;
      pageSize?: number;
      hasPreviousPage?: boolean;
      hasNextPage?: boolean;
    };

    const items = ((raw.items ?? raw.data ?? []) as ProductApiItem[]).map(
      normalizeProduct,
    );

    const currentPage =
      raw.meta?.currentPage ??
      raw.meta?.pageIndex ??
      raw.currentPage ??
      raw.pageIndex ??
      page;
    const itemsPerPage =
      raw.meta?.itemsPerPage ??
      raw.meta?.pageSize ??
      raw.itemsPerPage ??
      raw.pageSize ??
      limit;

    const totalItems =
      raw.meta?.totalItems ??
      raw.meta?.totalCount ??
      raw.totalItems ??
      raw.totalCount;

    const totalPages =
      raw.meta?.totalPages ??
      raw.totalPages ??
      (typeof totalItems === "number" && itemsPerPage > 0
        ? Math.max(1, Math.ceil(totalItems / itemsPerPage))
        : currentPage + (items.length >= itemsPerPage ? 1 : 0));

    const hasNextPage =
      raw.meta?.hasNextPage ??
      raw.hasNextPage ??
      (typeof totalItems === "number"
        ? currentPage < totalPages
        : items.length >= itemsPerPage);

    const hasPreviousPage =
      raw.meta?.hasPreviousPage ?? raw.hasPreviousPage ?? currentPage > 1;

    return {
      data: items,
      meta: {
        totalItems:
          typeof totalItems === "number"
            ? totalItems
            : (currentPage - 1) * itemsPerPage + items.length,
        totalPages,
        itemsPerPage,
        currentPage,
        hasPreviousPage,
        hasNextPage,
      },
    } satisfies ProductListResponse;
  },
});

export const productCommentService = {
  async create(data: CreateProductCommentDto): Promise<ProductComment> {
    return (await apiClient.post(
      API_ENDPOINTS.PRODUCT.COMMENT,
      data,
    )) as ProductComment;
  },
};
