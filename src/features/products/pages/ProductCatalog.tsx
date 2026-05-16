import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {  X, Loader2} from "lucide-react";
import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useInfinityScroll } from "@/shared/hooks/useInfinityScroll";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { cn } from "@/lib/utils";
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
      payload.video = [nextVideo];
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
    <div className="min-h-screen bg-muted/20 pb-20 overflow-x-hidden">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden bg-background border-b">
        <div className="absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-primary/5" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="w-full max-w-7xl mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-left-4 duration-500">
                
                Sàn giao dịch uy tín số 1
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
              Khám phá thế giới <br /> 
              <span className="text-primary bg-linear-to-r from-primary to-blue-600 bg-clip-text text-transparent">Đồ cũ chất lượng cao</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-xl animate-in fade-in slide-in-from-left-4 duration-1000 delay-200">
              Nơi kết nối những người đam mê đồ cũ, đảm bảo minh bạch, an toàn và mức giá tốt nhất thị trường.
            </p>
          </div>
        </div>
      </div>

      {/* Modern Filter Section */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b shadow-xs">
        <div className="w-full max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 rounded-xl bg-muted p-1 border">
                  <button 
                    className={cn(
                        "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                        !hasActiveFilters ? "bg-background shadow-xs text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={clearFilters}
                  >
                    Tất cả
                  </button>
                  {PRODUCT_CONDITIONS.map((cond) => (
                    <button
                        key={cond.value}
                        className={cn(
                            "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                            searchParams.get("condition") === cond.value ? "bg-background shadow-xs text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                        onClick={() => handleFilterChange("condition", cond.value)}
                    >
                        {cond.label}
                    </button>
                  ))}
               </div>
            </div>

            <div className="flex items-center gap-4">
                {titleQuery && (
                    <Badge variant="secondary" className="h-9 px-4 rounded-xl gap-2 font-bold animate-in zoom-in duration-300">
                        "{titleQuery}"
                        <X 
                            className="h-3.5 w-3.5 cursor-pointer hover:text-destructive transition-colors" 
                            onClick={() => handleFilterChange("title", undefined)}
                        />
                    </Badge>
                )}
                
                <div className="h-8 w-px bg-border hidden md:block" />
                
                <span className="text-xs font-black text-muted-foreground/60 uppercase tracking-widest hidden sm:block">
                    {products.length} sản phẩm
                </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl px-0 md:px-4 py-6 md:py-10">

      {error && (
        <div className="mx-auto mb-6 w-full max-w-4xl rounded-xl border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Không thể tải sản phẩm. Vui lòng thử lại.
          </p>
        </div>
      )}

      {isLoading && !products.length ? (
        <LoadingSpinner className="py-20" size="lg" />
      ) : !products.length ? (
        <EmptyState
          title="Không tìm thấy sản phẩm"
          description="Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc."
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
                Đang tải thêm...
              </div>
            </div>
          )}

          {hasMore && !isFetchingNextPage && (
            <div
              ref={observerRef}
              className="mt-5 text-center text-xs text-muted-foreground"
            >
              Cuộn xuống để tải thêm sản phẩm
            </div>
          )}

          {!hasMore && products.length > 0 && (
            <div className="mt-8 py-8 text-center text-sm text-muted-foreground">
              Không còn sản phẩm nào
            </div>
          )}
        </>
      )}
      </div>

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
