import { useState, useCallback, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Search } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Pagination } from "@/shared/components/common/Pagination";
import {
  useOrders,
  useConfirmReceipt,
  useCancelOrder,
} from "../hooks/useOrders";
import { OrderTable } from "../components/OrderTable";

export default function ManageOrderList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { orders, pagination, isLoading } = useOrders();
  const confirmMutation = useConfirmReceipt();
  const cancelMutation = useCancelOrder();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const debouncedSearch = useDebounce(searchInput, 400);

  const updateSearchParam = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) params.set("search", value);
      else params.delete("search");
      params.set("page", "1");
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    if (debouncedSearch !== searchParams.get("search"))
      updateSearchParam(debouncedSearch);
  }, [debouncedSearch, searchParams, updateSearchParam]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý đơn hàng</h2>
          <p className="text-sm text-muted-foreground">
            Danh sách đơn hàng hệ thống
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/orders/create">
            <Plus className="mr-2 h-4 w-4" />
            Tạo đơn
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-16" size="lg" />
      ) : !orders.length ? (
        <EmptyState
          title="Chưa có đơn hàng"
          description="Chưa có đơn hàng nào trong hệ thống."
        />
      ) : (
        <>
          <OrderTable
            orders={orders}
            onConfirm={(id) => confirmMutation.mutate(id)}
            onCancel={(id) => cancelMutation.mutate({ id })}
            isProcessing={confirmMutation.isPending || cancelMutation.isPending}
          />

          {pagination && (
            <Pagination meta={pagination} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  );
}
