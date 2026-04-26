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
  sellerId?: string;
  SellerId?: string;
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

const sellerProfileCache = new Map<string, SellerApiItem>();

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

const fetchSellerProfiles = async (sellerIds: string[]) => {
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
    imageUrls: normalizeArray(item.imageUrls ?? item.imageUrl),
    videoUrls: normalizeArray(item.videoUrls ?? item.video),
    comments: item.comments ?? [],
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

const toTrimmed = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const matchesCondition = (product: Product, condition?: string) => {
  if (!condition) return true;
  return (
    normalizeCondition(product.condition) === normalizeCondition(condition)
  );
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

    const rawItems = (raw.items ?? raw.data ?? []) as ProductApiItem[];

    await fetchSellerProfiles(rawItems.map((item) => getSellerId(item) ?? ""));

    let items = rawItems.map(normalizeProduct);

    if (condition) {
      items = items.filter((item) => matchesCondition(item, condition));
    }

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
