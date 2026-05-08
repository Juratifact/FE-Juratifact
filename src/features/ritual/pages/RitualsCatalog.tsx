import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, X } from "lucide-react";

import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { Pagination } from "@/shared/components/common/Pagination";
import { DIFFICULTY_LEVELS } from "@/shared/constants";
import { useRituals, useRitualCategories } from "../hooks/useRituals";
import { RitualCard } from "../components/RitualCard";

/**
 * Trang danh sách nghi lễ cho User – có search, filter, pagination.
 * Tất cả state lưu trên URL (searchParams) → có thể bookmark/share.
 */
export default function RitualsCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Data hooks
  const { rituals, pagination, isLoading } = useRituals();
  const { data: categories } = useRitualCategories();

  /**
   * Local search state + Debounce pattern:
   *
   * FLOW:
   * 1. User gõ chữ → `searchInput` update ngay lập tức (controlled input)
   * 2. `useDebounce` chờ 500ms sau lần gõ cuối → tạo `debouncedSearch`
   * 3. `useEffect` bắt thay đổi của `debouncedSearch` → update URL
   * 4. URL update → trigger `useRituals()` hook → gọi API
   *
   * TẠI SAO CẦN LOCAL STATE?
   * - Không update URL trực tiếp khi user gõ (gây flicker URL bar)
   * - Chờ user gõ xong mới update URL → giảm số lần gọi API
   *
   * VÍ DỤ: User gõ "cúng rằm" (9 ký tự)
   * - Không debounce: 9 lần gọi API ❌
   * - Có debounce: 1 lần gọi API (sau 500ms) ✅
   */
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const debouncedSearch = useDebounce(searchInput, 500);

  /**
   * Sync debounced search → URL params.
   *
   * Chỉ chạy khi `debouncedSearch` thay đổi (500ms sau khi user ngừng gõ).
   *
   * eslint-disable: Bỏ qua warning thiếu deps (searchParams, setSearchParams).
   * Lý do: Thêm vào deps → vòng lặp vô hạn:
   *   debouncedSearch → update URL → searchParams change → useEffect chạy lại → loop ♾️
   */
  useEffect(() => {
    if (debouncedSearch !== searchParams.get("search")) {
      const params = new URLSearchParams(searchParams);
      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      } else {
        params.delete("search");
      }
      params.set("page", "1"); // Reset về trang 1 khi search mới
      setSearchParams(params);
    }
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Filter handlers - Update URL params cho các filter khác (không search).
   *
   * PATTERN CHUNG:
   * - Tạo URLSearchParams mới từ params hiện tại (giữ nguyên các params khác)
   * - Set/delete param tương ứng
   * - Reset về page 1 (filter mới → xem từ đầu)
   * - setSearchParams → trigger re-render + API call
   *
   * TẠI SAO LƯU TRÊN URL?
   * ✅ Bookmark được: Copy link → bạn bè mở đúng filters
   * ✅ Back/Forward browser: Quay lại filters trước đó
   * ✅ Share được: Gửi link có sẵn bộ lọc
   * ✅ Refresh page: Giữ nguyên filters (không mất state)
   */
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

  /**
   * Clear all filters - Reset về trạng thái ban đầu.
   * - Xoá toàn bộ URL params
   * - Reset local search input về rỗng
   * - useEffect sẽ tự động sync → gọi API không filter
   */
  const clearFilters = () => {
    const params = new URLSearchParams();
    setSearchParams(params);
    setSearchInput("");
  };

  /**
   * Pagination handler - Chỉ update param "page", giữ nguyên filters.
   * Không reset về page 1 (vì user đang chủ động chuyển trang).
   */
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
  };

  /**
   * Check có filter nào đang active không?
   * Dùng để hiển thị nút "Xoá bộ lọc" (conditional rendering).
   * !! (double negation) convert string | null → boolean.
   */
  const hasActiveFilters =
    !!searchParams.get("difficultyLevel") ||
    !!searchParams.get("ritualCategoryId") ||
    !!searchParams.get("search");

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Nghi lễ truyền thống</h1>
        <p className="mt-1 text-muted-foreground">
          Khám phá và tìm hiểu các nghi lễ cúng kiếng Việt Nam
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 space-y-4">
        {/* Search bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Tìm kiếm nghi lễ..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            Lọc:
          </div>

          {/* Độ khó */}
          <select
            value={searchParams.get("difficultyLevel") || ""}
            onChange={(e) =>
              handleFilterChange("difficultyLevel", e.target.value || undefined)
            }
            className="h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Tất cả độ khó</option>
            {DIFFICULTY_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>

          {/* Danh mục */}
          <select
            value={searchParams.get("ritualCategoryId") || ""}
            onChange={(e) =>
              handleFilterChange(
                "ritualCategoryId",
                e.target.value || undefined,
              )
            }
            className="h-9 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Tất cả danh mục</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Clear filters */}
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="mr-1 h-3 w-3" />
              Xoá bộ lọc
            </Button>
          )}

          {/* Result count */}
          {pagination && (
            <Badge variant="secondary" className="ml-auto">
              {pagination.totalItems} kết quả
            </Badge>
          )}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <LoadingSpinner className="py-20" size="lg" />
      ) : !rituals?.length ? (
        <EmptyState
          title="Không tìm thấy nghi lễ"
          description="Thử thay đổi từ khoá tìm kiếm hoặc bộ lọc."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rituals.map((ritual) => (
              <RitualCard key={ritual.id} ritual={ritual} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && (
            <Pagination
              meta={pagination}
              onPageChange={handlePageChange}
              className="mt-8"
            />
          )}
        </>
      )}
    </div>
  );
}
