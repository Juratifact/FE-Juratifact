import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, FlagTriangleRight, ShieldAlert, Sparkles } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
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

const STATUS_OPTIONS = [
  { value: String(REPORT_STATUS_MAP.PROCESSING), label: "Chờ xử lý" },
  { value: String(REPORT_STATUS_MAP.APPROVED), label: "Đã duyệt" },
  { value: String(REPORT_STATUS_MAP.REJECTED), label: "Bị từ chối" },
  { value: String(REPORT_STATUS_MAP.DISMISSED), label: "Bỏ qua" },
];

/**
 * Trang admin quản lý danh sách báo cáo – bảng + tìm kiếm + phân trang.
 */
export default function ManageReportList() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Data hooks
  const { reports, pagination, isLoading } = useReports();
  const deleteMutation = useDeleteReport();
  const approveMutation = useApproveReport();
  const rejectMutation = useRejectReport();

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
    params.set("page", "1");
    setSearchParams(params);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
  };

  // Handle actions
  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa báo cáo này?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleApprove = (id: string) => {
    approveMutation.mutate(id);
  };

  const handleReject = (id: string) => {
    rejectMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-r from-slate-950 via-slate-900 to-orange-600 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-white/10">
              Reports center
            </Badge>
            <h1 className="mt-4 text-3xl font-black italic uppercase tracking-tight sm:text-5xl">
              Quản lý báo cáo
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-200 sm:text-base">
              Duyệt báo cáo nhanh với bố cục rõ ràng, màu nhấn mạnh và thao tác
              phù hợp màn hình quản trị.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">
                Tổng
              </p>
              <p className="mt-1 text-2xl font-black">
                {pagination?.totalItems ?? 0}
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">
                Pending
              </p>
              <p className="mt-1 text-2xl font-black">
                {
                  reports.filter(
                    (item) => item.status === REPORT_STATUS_MAP.PROCESSING,
                  ).length
                }
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">
                Handled
              </p>
              <p className="mt-1 text-2xl font-black">
                {
                  reports.filter(
                    (item) => item.status !== REPORT_STATUS_MAP.PROCESSING,
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex flex-col gap-4 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl font-black italic uppercase">
              Bộ lọc nhanh
            </CardTitle>
            <p className="text-sm text-slate-500">
              Tìm báo cáo theo từ khóa và trạng thái
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-2xl border-slate-200 bg-slate-50"
          >
            <Sparkles className="mr-2 size-4" /> Review queue
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 p-6 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm báo cáo..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-10 shadow-sm"
            />
          </div>

          <div className="md:col-span-1">
            <select
              value={searchParams.get("status") || ""}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm shadow-sm outline-none"
            >
              <option value="">Tất cả trạng thái</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1 flex items-center justify-end gap-2">
            <Badge
              variant="secondary"
              className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.2em]"
            >
              <FlagTriangleRight className="mr-2 size-3.5" /> Queue
            </Badge>
            <Badge
              variant="secondary"
              className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.2em]"
            >
              <ShieldAlert className="mr-2 size-3.5" /> Safe
            </Badge>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <LoadingSpinner />
      ) : reports.length === 0 ? (
        <EmptyState
          title="Không có báo cáo"
          description="Không tìm thấy báo cáo nào với tiêu chí tìm kiếm của bạn"
        />
      ) : (
        <>
          <ReportTable
            reports={reports}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
            isLoading={approveMutation.isPending || rejectMutation.isPending}
          />

          {pagination && (
            <Pagination meta={pagination} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  );
}
