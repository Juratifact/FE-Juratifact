
import { Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Pagination } from "@/shared/components/common/Pagination";
import { Badge } from "@/shared/components/ui/badge";

import { usePromotions, useDeletePromotion } from "../hooks/usePromotions";
import { PromotionPackageTable } from "../components/PromotionPackageTable";
import { useNavigate } from "react-router-dom";

export default function AvailablePromotions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { promotions, pagination, isLoading, error } = usePromotions();
  const deleteMutation = useDeletePromotion();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
  };

  const handleDelete = (packageId: string) => {
    deleteMutation.mutate(packageId);
  };

  if (error) {
    return (
      <div className="p-8 text-center bg-destructive/5 rounded-lg border border-dashed border-destructive/20">
        <p className="text-destructive font-semibold">Đã xảy ra lỗi khi tải danh sách gói ưu đãi.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold italic uppercase tracking-tight">Quản lý Gói ưu đãi</h2>
          <p className="text-sm text-muted-foreground">
            Quản lý và cập nhật các gói ưu đãi hiển thị trên sàn
          </p>
        </div>
        <Button
          onClick={() => navigate("create")}
          className="rounded-lg h-10 px-4 font-bold"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tạo gói mới
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {pagination && (
          <Badge variant="secondary" className="ml-auto">
            Tổng: {pagination.totalItems}
          </Badge>
        )}
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-16" size="lg" />
      ) : !promotions.length ? (
        <EmptyState
            title="Không tìm thấy gói ưu đãi"
            description="Hiện không có gói ưu đãi nào khả dụng."
        />
      ) : (
        <div className="space-y-6">
          <PromotionPackageTable 
            packages={promotions} 
            onDelete={handleDelete} 
            isDeleting={deleteMutation.isPending}
          />

          {pagination && (
            <div className="flex justify-center">
              <Pagination meta={pagination} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
