import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import type {
  CreateProductCommentDto,
  CreateProductDto,
  ProductFilterParams,
  UpdateMyProductDto,
  UpdateProductDto,
} from "../types";
import { productCommentService, productService } from "../services";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/shared/constants";
import { useMemo } from "react";

export function useProducts() {
  const [searchParams] = useSearchParams();
  const filter = useMemo<ProductFilterParams>(() => {
    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      title: searchParams.get("title") || undefined,
      condition: searchParams.get("condition") || undefined,
      sortBy:
        (searchParams.get("sortBy") as "price" | "date" | "relevance") ||
        "date",
      sortOrder: (searchParams.get("sortOrder") as "ASC" | "DESC") || "DESC",
    };
  }, [searchParams]);

  const query = useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, filter],
    queryFn: () => productService.getAll(filter),
    placeholderData: (prev) => prev,
  });

  return {
    products: query.data?.data ?? [],
    pagination: query.data?.meta,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useMyProducts(params?: {
  page?: number;
  limit?: number;
  title?: string;
}) {
  const filter = useMemo(
    () => ({
      page: params?.page ?? 1,
      limit: params?.limit ?? 6,
      title: params?.title || undefined,
    }),
    [params?.limit, params?.page, params?.title],
  );

  const query = useQuery({
    queryKey: [QUERY_KEYS.MY_PRODUCTS, filter],
    queryFn: () => productService.getMyProducts(filter),
    placeholderData: (prev) => prev,
  });

  return {
    products: query.data?.data ?? [],
    pagination: query.data?.meta,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useInfiniteProducts() {
  const [searchParams] = useSearchParams();

  const filter = useMemo<ProductFilterParams>(() => {
    return {
      limit: Number(searchParams.get("limit")) || 20,
      title: searchParams.get("title") || undefined,
      condition: searchParams.get("condition") || undefined,
      sortBy:
        (searchParams.get("sortBy") as "price" | "date" | "relevance") ||
        "date",
      sortOrder: (searchParams.get("sortOrder") as "ASC" | "DESC") || "DESC",
    };
  }, [searchParams]);

  const query = useInfiniteQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, "infinite", filter],
    // queryFn nhận {pageParam} từ React Query
    queryFn: async ({ pageParam = 1 }) => {
      return productService.getAll({
        ...filter,
        page: pageParam,
      });
    },
    // Tính page tiếp theo dựa trên meta
    getNextPageParam: (lastPage) => {
      const meta = lastPage?.meta;
      if (meta?.hasNextPage) {
        return meta.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  // Flatten tất cả pages thành 1 array
  const allProducts = query.data?.pages.flatMap((page) => page.data) ?? [];
  const hasMore = query.hasNextPage ?? false;

  return {
    products: allProducts,
    hasMore,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    error: query.error,
    fetchNextPage: query.fetchNextPage,
  };
}

/**
 * MUTATIONS
 */
export function useCreateProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDto) => productService.create(data),
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_PRODUCTS });
      navigate("/products");
    },
  });
}

export function useUpdateProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      productService.update(id, data),
    onSuccess: (_data, variables) => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_PRODUCTS });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCT_DETAIL(variables.id),
      });
      navigate("/products");
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.remove(id),
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_PRODUCTS });
    },
  });
}

export function useUpdateMyProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMyProductDto }) =>
      productService.updateMyProduct(id, data),
    onSuccess: () => {
      toast.success("Cập nhật sản phẩm thành công");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_PRODUCTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
    },
  });
}

export function useDeleteMyProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.deleteMyProduct(id),
    onSuccess: () => {
      toast.success("Đã xoá sản phẩm");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_PRODUCTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
    },
  });
}

export function useProductDetail(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT_DETAIL(id),
    queryFn: () => productService.getById(id),
    enabled: !!id,
  });
}

export function useCreateProductComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductCommentDto) =>
      productCommentService.create(data),
    onSuccess: (createdComment, variables) => {
      toast.success("Bình luận đã được gửi");
      queryClient.setQueryData(
        QUERY_KEYS.PRODUCT_COMMENTS(variables.productId),
        (current: unknown) => {
          const existingComments = Array.isArray(current) ? current : [];
          const nextComment = {
            ...createdComment,
            displayName:
              createdComment.displayName ?? createdComment.userName ?? "Bạn",
            parentCommentId: createdComment.parentCommentId,
          };

          return [nextComment, ...existingComments];
        },
      );

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCT_COMMENTS(variables.productId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCT_DETAIL(variables.productId),
      });
    },
  });
}

export function useProductComments(productId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT_COMMENTS(productId),
    queryFn: () => productCommentService.getByProductId(productId),
    enabled: !!productId,
  });
}
