import { createBaseService } from "@/shared/services/BaseService";
import type {
  CreateProductCommentDto,
  CreateProductDto,
  ProductListResponse,
  Product,
  ProductFilterParams,
  ProductComment,
  ProductCommentResponse,
  UpdateMyProductDto,
  UpdateProductDto,
} from "./types";
import { API_ENDPOINTS } from "@/shared/constants";
import apiClient from "@/lib/axios";
import { useAuthStore } from "@/features/auth/store";

type ProductApiItem = Partial<Product> & {
  id?: string;
  productId?: string;
  sellerId?: string;
  SellerId?: string;
  title?: string;
  description?: string;
  condition?: string;
  price?: number;
  status?: number;
  imageUrls?: string[];
  imageUrl?: string[];
  images?: string[];
  productImages?: string[];
  videoUrls?: string[];
  video?: Array<string | null>;
  createdAt?: string;
  updatedAt?: string;
  comments?: ProductComment[];
};

type SellerApiItem = {
  id?: string;
  userId?: string;
  fullName?: string;
  FullName?: string;
  userName?: string;
  UserName?: string;
  profilePicture?: string;
  ProfilePicture?: string;
  profilePictureUrl?: string;
};

type ProductCommentApiItem = Partial<ProductCommentResponse> & {
  commentId?: string;
  content?: string;
  createdAt?: string;
  parentCommentId?: string;
  replyCount?: number;
  replies?: ProductCommentApiItem[];
  userName?: string;
  createdByName?: string;
  CreatedByName?: string;
  user?: unknown;
  author?: unknown;
  createdBy?: unknown;
  profile?: unknown;
};

type ProductCommentListRawResponse =
  | ProductCommentApiItem[]
  | {
      items?: ProductCommentApiItem[];
      data?: ProductCommentApiItem[];
      comments?: ProductCommentApiItem[];
    };

const sellerProfileCache = new Map<string, SellerApiItem>();

const normalizeArray = (value: unknown): string[] => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || trimmed === "null" || trimmed === "undefined") return [];

    // Handle JSON array strings
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed
            .map((x) => (x === null || x === undefined ? "" : String(x).trim()))
            .filter((x) => x.length > 0 && x !== "null" && x !== "undefined");
        }
      } catch {
        // Fallback to treat as single string if JSON parse fails
      }
    }
    return [trimmed];
  }

  if (Array.isArray(value)) {
    return value
      .map((x) => (x === null || x === undefined ? "" : String(x).trim()))
      .filter((x) => x.length > 0 && x !== "null" && x !== "undefined");
  }

  if (value && typeof value === "object" && "length" in value) {
    return Array.from(value as any)
      .map((x) => (x === null || x === undefined ? "" : String(x).trim()))
      .filter((x) => x.length > 0 && x !== "null" && x !== "undefined");
  }

  return [];
};

const normalizeCondition = (value: unknown): Product["condition"] => {
  if (typeof value !== "string") {
    return "Good";
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === "new" || normalized === "mới") return "New";
  if (normalized === "like new" || normalized === "như mới") {
    return "Like new";
  }
  if (normalized === "good" || normalized === "tốt") return "Good";

  return "Good";
};

const pickString = (item: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  return undefined;
};

const pickNestedString = (
  value: unknown,
  keys: string[],
  depth = 2,
): string | undefined => {
  if (!value || depth < 0) return undefined;

  if (typeof value === "string") {
    return value.trim() ? value : undefined;
  }

  if (typeof value !== "object") {
    return undefined;
  }

  const record = value as Record<string, unknown>;
  const directValue = pickString(record, keys);
  if (directValue) return directValue;

  for (const nestedKey of ["user", "author", "createdBy", "profile"]) {
    const nestedValue = record[nestedKey];
    const nestedMatch = pickNestedString(nestedValue, keys, depth - 1);
    if (nestedMatch) return nestedMatch;
  }

  return undefined;
};

const getSellerId = (item: ProductApiItem) =>
  pickString(item as Record<string, unknown>, ["sellerId", "SellerId"]);

const normalizeSeller = (item: SellerApiItem | undefined) => {
  if (!item) {
    return {
      sellerFullName: undefined,
      sellerUserName: undefined,
      sellerProfilePicture: undefined,
    };
  }

  return {
    sellerFullName: pickString(item as Record<string, unknown>, [
      "fullName",
      "FullName",
    ]),
    sellerUserName: pickString(item as Record<string, unknown>, [
      "userName",
      "UserName",
    ]),
    sellerProfilePicture: pickString(item as Record<string, unknown>, [
      "profilePicture",
      "ProfilePicture",
      "profilePictureUrl",
    ]),
  };
};

const normalizeComment = (
  item: ProductCommentApiItem,
  fallbackParentCommentId?: string,
): ProductComment => {
  const commentId = item.commentId ?? item.id ?? crypto.randomUUID();
  const displayName = pickNestedString(item, [
    "fullName",
    "FullName",
    "name",
    "Name",
    "displayName",
    "DisplayName",
    "createdByName",
    "CreatedByName",
    "userName",
    "UserName",
  ]);

  return {
    id: commentId,
    commentId,
    content: item.content ?? "",
    createdAt: item.createdAt ?? new Date().toISOString(),
    parentCommentId: item.parentCommentId ?? fallbackParentCommentId,
    replyCount: item.replyCount,
    displayName,
    userName: pickNestedString(item, ["userName", "UserName"]),
  };
};

const flattenCommentItems = (
  items: ProductCommentApiItem[],
  parentCommentId?: string,
): ProductComment[] =>
  items.flatMap((item) => {
    const normalized = normalizeComment(item, parentCommentId);
    const replies = Array.isArray(item.replies)
      ? flattenCommentItems(item.replies, normalized.commentId)
      : [];

    return [normalized, ...replies];
  });

const extractCommentItems = (
  raw: ProductCommentListRawResponse | Record<string, unknown>,
): ProductCommentApiItem[] => {
  if (Array.isArray(raw)) {
    return raw;
  }

  if (!raw || typeof raw !== "object") {
    return [];
  }

  const record = raw as Record<string, unknown>;
  for (const key of ["items", "data", "comments"]) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value as ProductCommentApiItem[];
    }
    if (value && typeof value === "object") {
      const nested = extractCommentItems(value as Record<string, unknown>);
      if (nested.length > 0) {
        return nested;
      }
    }
  }

  for (const nestedKey of ["data", "result", "payload"]) {
    const nestedValue = record[nestedKey];
    if (nestedValue && typeof nestedValue === "object") {
      const nested = extractCommentItems(
        nestedValue as Record<string, unknown>,
      );
      if (nested.length > 0) {
        return nested;
      }
    }
  }

  return [];
};

const fetchSellerProfiles = async (sellerIds: string[]) => {
  const access_token = useAuthStore.getState().access_token;
  if (!access_token) return;
  const uniqueSellerIds = Array.from(
    new Set(sellerIds.filter((id) => id && !sellerProfileCache.has(id))),
  );

  if (!uniqueSellerIds.length) return;

  await Promise.all(
    uniqueSellerIds.map(async (sellerId) => {
      try {
        const profile = (await apiClient.get(
          `${API_ENDPOINTS.USER.MY_PROFILE}/${sellerId}`,
        )) as SellerApiItem;
        sellerProfileCache.set(sellerId, profile ?? {});
      } catch {
        sellerProfileCache.set(sellerId, {});
      }
    }),
  );
};

const normalizeProduct = (item: ProductApiItem): Product => {
  const sellerId = getSellerId(item);
  const seller = normalizeSeller(
    sellerId ? sellerProfileCache.get(sellerId) : undefined,
  );
  const comments = Array.isArray(item.comments)
    ? item.comments.map((comment) => normalizeComment(comment))
    : [];

  return {
    id: item.id ?? item.productId ?? crypto.randomUUID(),
    sellerId,
    sellerFullName: seller.sellerFullName,
    sellerUserName: seller.sellerUserName,
    sellerProfilePicture: seller.sellerProfilePicture,
    title: item.title ?? "Product",
    description: item.description ?? "",
    condition: normalizeCondition(item.condition),
    price: Number(item.price ?? 0),
    status: item.status === 1 ? 1 : 0,
    imageUrls: normalizeArray(
      item.imageUrls ?? item.imageUrl ?? item.images ?? item.productImages,
    ),
    videoUrls: normalizeArray(item.videoUrls ?? item.video),
    comments,
    createdAt: item.createdAt ?? new Date().toISOString(),
    updatedAt: item.updatedAt ?? item.createdAt ?? new Date().toISOString(),
  };
};

type ProductListRawResponse = {
  items?: ProductApiItem[];
  data?: ProductApiItem[];
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

const normalizeProductList = async (
  raw: ProductListRawResponse,
  fallbackPage: number,
  fallbackLimit: number,
) => {
  const rawItems = (raw.items ?? raw.data ?? []) as ProductApiItem[];

  await fetchSellerProfiles(rawItems.map((item) => getSellerId(item) ?? ""));

  const items = rawItems.map(normalizeProduct);

  const currentPage =
    raw.meta?.currentPage ??
    raw.meta?.pageIndex ??
    raw.currentPage ??
    raw.pageIndex ??
    fallbackPage;
  const itemsPerPage =
    raw.meta?.itemsPerPage ??
    raw.meta?.pageSize ??
    raw.itemsPerPage ??
    raw.pageSize ??
    fallbackLimit;

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
};

const toTrimmed = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const productBaseService = createBaseService<
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

    if (data.images && data.images.length > 0) {
      data.images.forEach((file) => {
        formData.append("Images", file);
        // Fallback for older backend versions
        formData.append("Image", file);
      });
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
    const title = toTrimmed(params?.title);
    const condition = toTrimmed(params?.condition);

    const shouldSearchByTitle = !!title;
    const shouldSearchByCondition = !title && !!condition;

    const endpoint = shouldSearchByTitle
      ? API_ENDPOINTS.PRODUCT.TITLE
      : shouldSearchByCondition
        ? API_ENDPOINTS.PRODUCT.CONDITION
        : API_ENDPOINTS.PRODUCT.BASE;

    const requestParams = shouldSearchByTitle
      ? {
          searchTerm: title,
          pageSize: limit,
          pageIndex: page,
        }
      : shouldSearchByCondition
        ? {
            searchTerm: condition,
            pageSize: limit,
            pageIndex: page,
          }
        : {
            pageIndex: page,
            pageSize: limit,
            sortBy: params?.sortBy,
            sortOrder: params?.sortOrder,
          };

    const raw = (await apiClient.get(endpoint, {
      params: requestParams,
    })) as ProductListRawResponse;

    return normalizeProductList(raw, page, limit);
  },
});

export const productService = Object.assign(productBaseService, {
  async getMyProducts(params?: ProductFilterParams) {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 6;
    const title = toTrimmed(params?.title);

    const raw = (await apiClient.get(API_ENDPOINTS.PRODUCT.MY_PRODUCTS, {
      params: {
        pageIndex: page,
        pageSize: limit,
        searchTerm: title,
      },
    })) as ProductListRawResponse;

    return normalizeProductList(raw, page, limit);
  },

  async updateMyProduct(id: string, data: UpdateMyProductDto) {
    const formData = new FormData();

    if (typeof data.title === "string" && data.title.trim()) {
      formData.append("Title", data.title.trim());
    }

    if (typeof data.description === "string") {
      formData.append("Description", data.description);
    }

    if (typeof data.condition === "string") {
      formData.append("Condition", data.condition);
    }

    if (typeof data.price === "number") {
      formData.append("Price", String(data.price));
    }

    if (typeof data.status === "number") {
      formData.append("Status", String(data.status));
    }

    if (Array.isArray(data.images) && data.images.length > 0) {
      data.images.forEach((file) => {
        formData.append("Images", file);
        formData.append("Image", file);
      });
    }

    if (data.video instanceof File) {
      formData.append("Video", data.video);
    }

    const updated = (await apiClient.put(
      `${API_ENDPOINTS.PRODUCT.POST}/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    )) as ProductApiItem;

    return normalizeProduct(updated);
  },

  async deleteMyProduct(id: string) {
    await apiClient.delete(`${API_ENDPOINTS.PRODUCT.POST}/${id}`);
  },
});

export const productCommentService = {
  async getByProductId(productId: string): Promise<ProductComment[]> {
    const raw = (await apiClient.get(
      API_ENDPOINTS.PRODUCT.COMMENTS(productId),
    )) as ProductCommentListRawResponse;

    const comments = flattenCommentItems(extractCommentItems(raw));
    return comments;
  },

  async create(data: CreateProductCommentDto): Promise<ProductComment> {
    const res = await apiClient.post(API_ENDPOINTS.PRODUCT.COMMENT, data);
    const created = res;
    const result = normalizeComment(created as ProductCommentApiItem);
    return result;
  },
};
