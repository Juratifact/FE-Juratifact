import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
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
import { REPORT_STATUS_MAP } from "../types";
import { Separator } from "@/shared/components/ui/separator";

const STATUS_OPTIONS = [
  { value: String(REPORT_STATUS_MAP.PROCESSING), label: "Chờ xử lý" },
  { value: String(REPORT_STATUS_MAP.APPROVED), label: "Đã duyệt" },
  { value: String(REPORT_STATUS_MAP.REJECTED), label: "Bị từ chối" },
  { value: String(REPORT_STATUS_MAP.DISMISSED), label: "Bỏ qua" },
];

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
      const params = new URLSearchParams(searchParams);
      if (value) params.set("search", value);
      else params.delete("search");
      params.set("page", "1");
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    if (debouncedSearch !== searchParams.get("search")) {
      updateSearchParam(debouncedSearch);
    }
  }, [debouncedSearch]);

  const handleFilterChange = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa báo cáo này?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl space-y-8 p-6">
      {/* Header Section - Modern & Clean */}
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
            >
              Compliance
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý báo cáo</h1>
          <p className="text-sm text-muted-foreground">
            Xử lý các khiếu nại và vi phạm nội dung trên toàn hệ thống.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Stats in Header */}
          <div className="flex gap-4 border-l pl-6 dark:border-border">
            <div className="text-center">
              <p className="text-[10px] font-medium uppercase text-muted-foreground">
                Tổng số
              </p>
              <p className="text-xl font-bold">{pagination?.totalItems ?? 0}</p>
            </div>
            <Separator orientation="vertical" className="h-10" />
            <div className="text-center">
              <p className="text-[10px] font-medium uppercase text-amber-600">
                Cần xử lý
              </p>
              <p className="text-xl font-bold text-amber-600">
                {
                  reports.filter(
                    (r) => r.status === REPORT_STATUS_MAP.PROCESSING,
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Toolbar */}
      <Card className="border-none shadow-sm ring-1 ring-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Filter className="size-4" />
            Bộ lọc dữ liệu
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                placeholder="Tìm lí do báo cáo"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-10 pl-10 focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={searchParams.get("status") || ""}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Mọi trạng thái</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : reports.length === 0 ? (
          <EmptyState
            title="Hàng chờ trống"
            description="Tuyệt vời! Không có báo cáo nào cần xử lý tại thời điểm này."
          />
        ) : (
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <ReportTable
              reports={reports}
              onApprove={(id) => approveMutation.mutate(id)}
              onReject={(id) => rejectMutation.mutate(id)}
              onDelete={handleDelete}
              isDeleting={deleteMutation.isPending}
              isLoading={approveMutation.isPending || rejectMutation.isPending}
            />

            {pagination && (
              <div className="border-t border-border bg-muted/20 p-4">
                <Pagination meta={pagination} onPageChange={handlePageChange} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
