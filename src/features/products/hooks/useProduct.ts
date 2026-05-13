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
  ProductComment,
  UpdateProductCommentDto,
  UpdateMyProductDto,
  UpdateProductDto,
} from "../types";
import { productCommentService, productService } from "../services";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/shared/constants";
import { useMemo } from "react";
import type { ProductListResponse, Product } from "../types";

type ProductCache = ProductListResponse | undefined;

const patchProductInList = (
  currentData: ProductCache,
  productId: string,
  updates: Partial<Product>,
): ProductCache => {
  if (!currentData?.data || !Array.isArray(currentData.data)) {
    return currentData;
  }

  return {
    ...currentData,
    data: currentData.data.map((product) =>
      product.id === productId ? { ...product, ...updates } : product,
    ),
  };
};

const removeProductFromList = (
  currentData: ProductCache,
  productId: string,
): ProductCache => {
  if (!currentData?.data || !Array.isArray(currentData.data)) {
    return currentData;
  }

  return {
    ...currentData,
    data: currentData.data.filter((product) => product.id !== productId),
  };
};

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
    queryFn: async ({ pageParam = 1 }) => {
      return productService.getAll({
        ...filter,
        page: pageParam,
      });
    },
    getNextPageParam: (lastPage) => {
      const meta = lastPage?.meta;
      if (meta?.hasNextPage) {
        return meta.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

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
    onSuccess: (updatedProduct, variables) => {
      toast.success("Product updated successfully");
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.PRODUCTS },
        (currentData) =>
          patchProductInList(
            currentData as ProductCache,
            variables.id,
            updatedProduct as Partial<Product>,
          ),
      );
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.MY_PRODUCTS },
        (currentData) =>
          patchProductInList(
            currentData as ProductCache,
            variables.id,
            updatedProduct as Partial<Product>,
          ),
      );
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCT_DETAIL(variables.id),
      });
      queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.PRODUCTS],
        type: "active",
      });
      queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.MY_PRODUCTS],
        type: "active",
      });
      navigate("/products");
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.remove(id),
    onSuccess: (_data, productId) => {
      toast.success("Product deleted successfully");
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.PRODUCTS },
        (currentData) =>
          removeProductFromList(currentData as ProductCache, productId),
      );
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.MY_PRODUCTS },
        (currentData) =>
          removeProductFromList(currentData as ProductCache, productId),
      );
      queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.PRODUCTS],
        type: "active",
      });
      queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.MY_PRODUCTS],
        type: "active",
      });
    },
  });
}

export function useUpdateMyProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMyProductDto }) =>
      productService.updateMyProduct(id, data),
    onSuccess: (updatedProduct, variables) => {
      toast.success("Cập nhật sản phẩm thành công");
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.MY_PRODUCTS },
        (currentData) =>
          patchProductInList(
            currentData as ProductCache,
            variables.id,
            updatedProduct as Partial<Product>,
          ),
      );
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.PRODUCTS },
        (currentData) =>
          patchProductInList(
            currentData as ProductCache,
            variables.id,
            updatedProduct as Partial<Product>,
          ),
      );
      queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.MY_PRODUCTS],
        type: "active",
      });
      queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.PRODUCTS],
        type: "active",
      });
    },
  });
}

export function useDeleteMyProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.deleteMyProduct(id),
    onSuccess: (_data, productId) => {
      toast.success("Đã xoá sản phẩm");
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.MY_PRODUCTS },
        (currentData) =>
          removeProductFromList(currentData as ProductCache, productId),
      );
      queryClient.setQueriesData(
        { queryKey: QUERY_KEYS.PRODUCTS },
        (currentData) =>
          removeProductFromList(currentData as ProductCache, productId),
      );
      queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.MY_PRODUCTS],
        type: "active",
      });
      queryClient.refetchQueries({
        queryKey: [QUERY_KEYS.PRODUCTS],
        type: "active",
      });
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

export function useUpdateProductComment(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      data,
    }: {
      commentId: string;
      data: UpdateProductCommentDto;
    }) => productCommentService.update(commentId, data),
    onSuccess: (updatedComment) => {
      toast.success("Đã cập nhật bình luận");

      queryClient.setQueryData(
        QUERY_KEYS.PRODUCT_COMMENTS(productId),
        (current: unknown) => {
          if (!Array.isArray(current)) return current;

          return current.map((item) => {
            const comment = item as ProductComment;
            const currentId = comment.commentId ?? comment.id;
            const updatedId = updatedComment.commentId ?? updatedComment.id;

            if (currentId !== updatedId) {
              return comment;
            }

            return {
              ...comment,
              ...updatedComment,
              id: updatedComment.id ?? comment.id,
              commentId: updatedComment.commentId ?? comment.commentId,
            };
          });
        },
      );

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCT_COMMENTS(productId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCT_DETAIL(productId),
      });
    },
  });
}

export function useDeleteProductComment(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => productCommentService.remove(commentId),
    onSuccess: (_data, commentId) => {
      toast.success("Đã xoá bình luận");

      queryClient.setQueryData(
        QUERY_KEYS.PRODUCT_COMMENTS(productId),
        (current: unknown) => {
          if (!Array.isArray(current)) return current;

          return current.filter((item) => {
            const comment = item as ProductComment;
            const currentId = comment.commentId ?? comment.id;
            return currentId !== commentId;
          });
        },
      );

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCT_COMMENTS(productId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCT_DETAIL(productId),
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
