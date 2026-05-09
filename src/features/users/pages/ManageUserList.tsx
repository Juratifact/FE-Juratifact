import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Pagination } from "@/shared/components/common/Pagination";
import { useUsers } from "../hooks/useUsers";
import { UserTable } from "../components/UserTable";

export default function ManageUserList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { users, pagination, isLoading } = useUsers();

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
  }, [debouncedSearch, searchParams, updateSearchParam]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý người dùng</h2>
          <p className="text-sm text-muted-foreground">
            Quản lý tài khoản, phân quyền và giám sát hoạt động cộng đồng.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm email hoặc username..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>

        {pagination && (
          <Badge variant="secondary" className="ml-auto">
            Tổng cộng: {pagination.totalItems}
          </Badge>
        )}
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <LoadingSpinner className="py-16" size="lg" />
      ) : !users.length ? (
        <EmptyState
          title="Không tìm thấy kết quả"
          description="Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn."
        />
      ) : (
        <>
          <UserTable users={users} />

          {pagination && (
            <Pagination meta={pagination} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  );
}
