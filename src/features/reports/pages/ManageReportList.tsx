import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Pagination } from "@/shared/components/common/Pagination";
import {
  useReports,
  useDeleteReport,
  useApproveReport,
  useRejectReport,
} from "../hooks/useReports";
import { ReportTable } from "../components/ReportTable";

export default function ManageReportList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { reports, pagination, isLoading } = useReports();
  const deleteMutation = useDeleteReport();
  const approveMutation = useApproveReport();
  const rejectMutation = useRejectReport();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const debouncedSearch = useDebounce(searchInput, 500);

  const updateSearchParam = useCallback(
    (value: string) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (value) params.set("search", value);
        else params.delete("search");
        params.set("page", "1");
        return params;
      });
    },
    [setSearchParams],
  );

  useEffect(() => {
    const currentSearch = searchParams.get("search") ?? "";
    if (debouncedSearch !== currentSearch) {
      updateSearchParam(debouncedSearch);
    }
  }, [debouncedSearch, searchParams, updateSearchParam]);

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", String(page));
      return params;
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa báo cáo này?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý báo cáo</h2>
          <p className="text-sm text-muted-foreground">
            Xử lý các khiếu nại và vi phạm nội dung trên toàn hệ thống.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm lí do báo cáo..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>

        {pagination && (
          <Badge variant="secondary" className="ml-auto">
            Tổng: {pagination.totalItems}
          </Badge>
        )}
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <LoadingSpinner className="py-16" size="lg" />
      ) : reports.length === 0 ? (
        <EmptyState
          title="Hàng chờ trống"
          description="Tuyệt vời! Không có báo cáo nào cần xử lý tại thời điểm này."
        />
      ) : (
        <>
          <ReportTable
            reports={reports}
            onApprove={(id) => approveMutation.mutate(id)}
            onReject={(id) => rejectMutation.mutate(id)}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
            isLoading={approveMutation.isPending || rejectMutation.isPending}
          />

          {pagination && (
            <div className="flex justify-center pt-4">
              <Pagination meta={pagination} onPageChange={handlePageChange} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
