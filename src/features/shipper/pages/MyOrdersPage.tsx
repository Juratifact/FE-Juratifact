import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Pagination } from "@/shared/components/common/Pagination";
import { useShipperOrders } from "../hooks/useShipper";
import { ShipperOrderTable } from "../components/ShipperOrderTable";
import { useSearchParams } from "react-router-dom";

export default function ShipperMyOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Data hooks
  const { orders, pagination, isLoading } = useShipperOrders();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Đơn hàng của tôi</h2>
          <p className="text-sm text-muted-foreground">
            Quản lý và theo dõi các đơn hàng đã nhận
          </p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner />
      ) : orders.length === 0 ? (
        <EmptyState
          title="Không có đơn hàng"
          description="Bạn chưa nhận đơn hàng nào."
        />
      ) : (
        <>
          <ShipperOrderTable orders={orders} />

          {/* Pagination */}
          {pagination && pagination.total > 0 && (
            <Pagination
              meta={{
                totalItems: pagination.total,
                totalPages: Math.ceil(pagination.total / pagination.limit),
                itemsPerPage: pagination.limit,
                currentPage: pagination.page,
                hasPreviousPage: pagination.page > 1,
                hasNextPage:
                  pagination.page <
                  Math.ceil(pagination.total / pagination.limit),
              }}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
