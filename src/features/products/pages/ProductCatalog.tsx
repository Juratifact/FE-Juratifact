import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Filter, X, Loader2} from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useInfinityScroll } from "@/shared/hooks/useInfinityScroll";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { PRODUCT_CONDITIONS } from "@/shared/constants";
import {
  useInfiniteProducts,
  useDeleteMyProduct,
  useUpdateMyProduct,
} from "../hooks/useProduct";
import { ProductCard } from "../components/ProductCard";
import { ProductForm } from "../components/ProductForm";
import { ConfirmationModal } from "@/shared/components/common/ConfirmationModal";
import { useAddProductToCart } from "@/features/cart/hooks/useCart";
import { useAuthStore } from "@/features/auth/store";
import type { Product, UpdateMyProductDto } from "../types";
import type { ProductFormData } from "../schema";

export default function ProductCatalog() {
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = useAuthStore((state) => state.access_token);
  const addToCartMutation = useAddProductToCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const updateMyProductMutation = useUpdateMyProduct();
  const deleteMyProductMutation = useDeleteMyProduct();

  const {
    products,
    hasMore,
    isLoading,
    isFetchingNextPage,
    error,
    fetchNextPage,
  } = useInfiniteProducts();

  const buildUpdatePayload = (
    original: Product,
    data: ProductFormData,
  ): UpdateMyProductDto => {
    const payload: UpdateMyProductDto = {
      title: data.title.trim() || original.title,
      description: data.description ?? original.description ?? "",
      condition: data.condition,
      price: data.price,
      status: original.status,
    };

    if (data.image && data.image.length > 0) {
      payload.images = Array.from(data.image);
    }

    if (data.imageUrls) {
      payload.imageUrls = data.imageUrls;
    }

    const nextVideo = data.video?.[0] ?? null;
    if (nextVideo) {
      payload.video = nextVideo;
    }

    return payload;
  };

  const handleEditSubmit = (data: ProductFormData) => {
    if (!editingProduct) return;

    const payload = buildUpdatePayload(editingProduct, data);
    updateMyProductMutation.mutate(
      { id: editingProduct.id, data: payload },
      {
        onSuccess: () => setEditingProduct(null),
      },
    );
  };

  const handleDelete = (product: Product) => {
    setDeletingProduct(product);
  };

  const handleConfirmDelete = () => {
    if (!deletingProduct) return;
    deleteMyProductMutation.mutate(deletingProduct.id, {
      onSuccess: () => setDeletingProduct(null),
    });
  };

  const { observerRef } = useInfinityScroll({
    hasMore,
    isLoading: isFetchingNextPage,
    onLoadMore: () => {
      void fetchNextPage();
    },
    threshold: 0.1,
  });


  const handleFilterChange = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    setSearchParams(params);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("condition");
    params.delete("sortBy");
    params.delete("sortOrder");
    params.delete("page");
    setSearchParams(params);
  };

  const hasActiveFilters =
    !!searchParams.get("condition") || !!searchParams.get("sortBy");

  const titleQuery = searchParams.get("title") || "";

  const handleAddToCart = (product: Product) => {
    if (!accessToken) {
      window.scrollTo(0, 0);
      navigate("/login", { state: { from: location } });
      return;
    }

    addToCartMutation.mutate({
      productId: product.id,
      quantity: 1,
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mx-auto mb-6 w-full max-w-4xl rounded-2xl border bg-card p-6 shadow-sm md:p-7">
        <h1 className="text-3xl font-black tracking-tight md:text-4xl">
          Product Marketplace
        </h1>
        <p className="mt-2 text-muted-foreground md:text-base">
          Discover high-quality pre-owned items at the best prices.
        </p>
      </div>

      <div className="sticky top-2 z-20 mx-auto mb-6 w-full max-w-4xl rounded-2xl border bg-background/95 p-3 shadow-sm backdrop-blur supports-backdrop-filter:bg-background/80 md:p-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 rounded-full border bg-muted px-2.5 py-1.5 text-xs text-muted-foreground">
            <Filter className="h-4 w-4" />
            Filters:
          </div>

          {titleQuery && (
            <Badge variant="outline" className="gap-1 rounded-full">
              Search: {titleQuery}
            </Badge>
          )}

          <select
            value={searchParams.get("condition") || ""}
            onChange={(e) =>
              handleFilterChange("condition", e.target.value || undefined)
            }
            className="h-9 rounded-full border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All conditions</option>
            {PRODUCT_CONDITIONS.map((cond) => (
              <option key={cond.value} value={cond.value}>
                {cond.label}
              </option>
            ))}
          </select>


          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={clearFilters}
            >
              <X className="mr-1 h-3 w-3" />
              Clear filters
            </Button>
          )}

          <Badge variant="secondary" className="ml-auto rounded-full">
            {products.length} results
          </Badge>
        </div>
      </div>

      {error && (
        <div className="mx-auto mb-6 w-full max-w-4xl rounded-xl border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Failed to load products. Please try again.
          </p>
        </div>
      )}

      {isLoading && !products.length ? (
        <LoadingSpinner className="py-20" size="lg" />
      ) : !products.length ? (
        <EmptyState
          title="No products found"
          description="Try changing your search keyword or filters."
        />
      ) : (
        <>
          <div className="mx-auto w-full max-w-4xl space-y-5">
            {products.map((product) => (
              <div key={product.id}>
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onEdit={(item) => setEditingProduct(item)}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>

          {isFetchingNextPage && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading more...
              </div>
            </div>
          )}

          {hasMore && !isFetchingNextPage && (
            <div
              ref={observerRef}
              className="mt-5 text-center text-xs text-muted-foreground"
            >
              Scroll down to load more products
            </div>
          )}

          {!hasMore && products.length > 0 && (
            <div className="mt-8 py-8 text-center text-sm text-muted-foreground">
              No more products
            </div>
          )}
        </>
      )}

      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <Card className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <p className="text-sm font-semibold">Chỉnh sửa sản phẩm</p>
                <p className="text-xs text-muted-foreground">
                  Chỉ các trường thay đổi mới được gửi lên API.
                </p>
              </div>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full"
                onClick={() => setEditingProduct(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <CardContent className="max-h-[calc(90vh-73px)] overflow-auto p-5 md:p-6">
              <ProductForm
                key={editingProduct.id}
                defaultValues={{
                  title: editingProduct.title,
                  description: editingProduct.description ?? "",
                  condition: editingProduct.condition,
                  price: editingProduct.price,
                }}
                initialImageUrls={editingProduct.imageUrls}
                onSubmit={handleEditSubmit}
                isPending={updateMyProductMutation.isPending}
                submitLabel="Lưu thay đổi"
              />
            </CardContent>
          </Card>
        </div>
      )}

      <ConfirmationModal
        isOpen={!!deletingProduct}
        title="Xoá sản phẩm?"
        description={`Bạn có chắc chắn muốn xoá "${deletingProduct?.title}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xoá ngay"
        cancelLabel="Huỷ"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingProduct(null)}
        isPending={deleteMyProductMutation.isPending}
      />
    </div>
  );
}
