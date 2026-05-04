import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Pagination } from "@/shared/components/common/Pagination";
import { useIdentifyList } from "@/features/identify/hooks/useIdentifyList";
import { IdentifyTable } from "@/features/identify/components/IdentifyTable";
import { REPORT_STATUS_OPTIONS } from "@/shared/constants";
import { useDebounce } from "@/shared/hooks/useDebounce";

export default function IdentifyList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const debouncedSearch = useDebounce(searchInput, 500);

  const { documents, pagination, isLoading } = useIdentifyList();

  useEffect(() => {
    if (debouncedSearch !== searchParams.get("search")) {
      const params = new URLSearchParams(searchParams);
      if (debouncedSearch) params.set("search", debouncedSearch);
      else params.delete("search");
      params.set("page", "1");
      setSearchParams(params);
    }
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams);
      if (value) params.set(key, value);
      else params.delete(key);
      params.set("page", "1");
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Danh sách tài liệu xác minh</h2>
          <p className="text-sm text-muted-foreground">
            Danh sách người dùng đã gửi tài liệu xác minh
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={searchParams.get("status") || ""}
          onChange={(e) =>
            handleFilterChange("status", e.target.value || undefined)
          }
          className="h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Tất cả trạng thái</option>
          {REPORT_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={String(opt.value)}>
              {opt.label}
            </option>
          ))}
        </select>

        {pagination && (
          <Badge variant="secondary" className="ml-auto">
            Tổng: {pagination.totalItems}
          </Badge>
        )}
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-16" size="lg" />
      ) : !documents.length ? (
        <EmptyState
          title="Chưa có tài liệu"
          description="Chưa có ai gửi tài liệu xác minh."
        >
          <Button asChild>
            <Link to="/identify/create">Gửi xác minh</Link>
          </Button>
        </EmptyState>
      ) : (
        <>
          <IdentifyTable documents={documents} />
          {pagination && (
            <Pagination meta={pagination} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  );
}
