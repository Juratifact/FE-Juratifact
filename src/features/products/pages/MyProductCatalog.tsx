import { useState } from "react";
import { Link } from "react-router-dom";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { Pagination } from "@/shared/components/common/Pagination";
import { ProductForm } from "../components/ProductForm";
import {
  useDeleteMyProduct,
  useMyProducts,
  useUpdateMyProduct,
} from "../hooks/useProduct";
import { ProductCard } from "../components/ProductCard";
import { ConfirmationModal } from "@/shared/components/common/ConfirmationModal";
import type { Product, UpdateMyProductDto } from "../types";
import type { ProductFormData } from "../schema";

interface MyProductCatalogProps {
  embedded?: boolean;
}

export default function MyProductCatalog({ embedded }: MyProductCatalogProps) {
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const updateMyProductMutation = useUpdateMyProduct();
  const deleteMyProductMutation = useDeleteMyProduct();

  const { products, pagination, isLoading, error } = useMyProducts({
    page,
    limit: pageSize,
  });

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

    if (data.video && data.video.length > 0) {
      payload.video = Array.from(data.video);
    }

    return payload;
  };

  const handleEditSubmit = (data: ProductFormData) => {
    if (!editingProduct) return;

    const payload = buildUpdatePayload(editingProduct, data);
    if (Object.keys(payload).length === 0) {
      setEditingProduct(null);
      return;
    }

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

  const content = (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold">Sản phẩm của tôi</h2>
          <p className="text-sm text-muted-foreground">
            Theo dõi và quản lý các sản phẩm bạn đang đăng bán.
          </p>
        </div>
        <Button asChild className="rounded-full shadow-md transition-all hover:shadow-lg active:scale-95">
          <Link to="/products/create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Đăng sản phẩm mới</span>
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Badge variant="secondary">
          {pagination?.totalItems ?? products.length} sản phẩm
        </Badge>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Không tải được danh sách sản phẩm của bạn.
        </div>
      )}

      {isLoading && !products.length ? (
        <LoadingSpinner className="py-16" size="lg" />
      ) : !products.length ? (
        <EmptyState
          title="Chưa có sản phẩm nào"
          description="Bạn chưa đăng sản phẩm nào hoặc bộ lọc hiện tại không có kết quả."
        />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                mode="owner"
                onEdit={(item) => setEditingProduct(item)}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {pagination && (
            <Pagination
              meta={pagination}
              onPageChange={setPage}
              className="pt-2"
            />
          )}
        </>
      )}
    </div>
  );

  return (
    <div className={cn(!embedded && "container mx-auto px-4 py-8")}>
      {content}

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
