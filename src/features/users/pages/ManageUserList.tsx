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
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    if (debouncedSearch !== searchParams.get("search")) {
      updateSearchParam(debouncedSearch);
    }
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Quản lý người dùng</h2>
        <p className="text-sm text-muted-foreground">
          Danh sách tài khoản trong hệ thống
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên hoặc username..."
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

      {isLoading ? (
        <LoadingSpinner className="py-16" size="lg" />
      ) : !users.length ? (
        <EmptyState
          title="Không có người dùng"
          description="Không tìm thấy dữ liệu phù hợp."
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
