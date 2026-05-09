import { useState, useCallback, useEffect } from "react";
import { Search } from "lucide-react";

import { Input } from "@/shared/components/ui/input";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Pagination } from "@/shared/components/common/Pagination";
import { useShipperOrders } from "../hooks/useShipper";
import { ShipperOrderTable } from "../components/ShipperOrderTable";
import { useSearchParams } from "react-router-dom";

const STATUS_OPTIONS = [
  { value: 2, label: "Chờ lấy hàng" },
  { value: 5, label: "Đã giao" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: 1, label: "Chờ thanh toán" },
  { value: 2, label: "Đã thanh toán" },
];

/**
 * Trang danh sách đơn hàng của shipper – bảng + tìm kiếm + phân trang.
 */
export default function ShipperMyOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Data hooks
  const { orders, pagination, isLoading } = useShipperOrders();

  // Local search with debounce
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const debouncedSearch = useDebounce(searchInput, 500);

  // Update URL when debounced search changes
  const updateSearchParam = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.set("page", "1"); // Reset to page 1
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  // Sync debounced search to URL
  useEffect(() => {
    if (debouncedSearch !== searchParams.get("search")) {
      updateSearchParam(debouncedSearch);
    }
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter handlers
  const handleFilterChange = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset to page 1
    setSearchParams(params);
  };

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

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên khách, số điện thoại..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <select
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={searchParams.get("status") || ""}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Payment Status Filter */}
        <select
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={searchParams.get("paymentStatus") || ""}
          onChange={(e) => handleFilterChange("paymentStatus", e.target.value)}
        >
          <option value="">Tất cả thanh toán</option>
          {PAYMENT_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner />
      ) : orders.length === 0 ? (
        <EmptyState
          title="Không có đơn hàng"
          description="Bạn chưa nhận đơn hàng nào hoặc các đơn hàng đã được lọc ra"
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
