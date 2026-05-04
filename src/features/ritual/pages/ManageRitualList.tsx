import { useState, useCallback, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Search } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Badge } from "@/shared/components/ui/badge";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Pagination } from "@/shared/components/common/Pagination";
import { DIFFICULTY_LEVELS } from "@/shared/constants";
import { useRituals, useDeleteRitual } from "../hooks/useRituals";
import { RitualTable } from "../components/RitualTable";

/**
 * Trang admin quản lý danh sách rituals – bảng + tìm kiếm + phân trang.
 */
export default function ManageRitualList() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Data hooks
  const { rituals, pagination, isLoading } = useRituals();
  const deleteMutation = useDeleteRitual();

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
          <h2 className="text-2xl font-bold">Quản lý nghi lễ</h2>
          <p className="text-sm text-muted-foreground">
            Tạo, sửa, xoá các nghi lễ trong hệ thống
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/ritual/create">
            <Plus className="mr-2 h-4 w-4" />
            Tạo nghi lễ
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={searchParams.get("difficultyLevel") || ""}
          onChange={(e) =>
            handleFilterChange("difficultyLevel", e.target.value || undefined)
          }
          className="h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Tất cả độ khó</option>
          {DIFFICULTY_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>

        {pagination && (
          <Badge variant="secondary" className="ml-auto">
            Tổng: {pagination.totalItems}
          </Badge>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingSpinner className="py-16" size="lg" />
      ) : !rituals.length ? (
        <EmptyState
          title="Chưa có nghi lễ nào"
          description="Bắt đầu bằng cách tạo nghi lễ đầu tiên."
        >
          <Button asChild>
            <Link to="/admin/ritual/create">
              <Plus className="mr-2 h-4 w-4" />
              Tạo nghi lễ
            </Link>
          </Button>
        </EmptyState>
      ) : (
        <>
          <RitualTable
            rituals={rituals}
            onDelete={(id) => deleteMutation.mutate(id)}
            isDeleting={deleteMutation.isPending}
          />

          {pagination && (
            <Pagination meta={pagination} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  );
}
