import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
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
    <div className="container mx-auto max-w-7xl space-y-8 p-6">
      {/* Header*/}
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80"
            >
              Community Management
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý tài khoản, phân quyền và giám sát hoạt động cộng đồng.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex gap-6 border-r pr-6 border-border">
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Tổng cộng
              </p>
              <p className="text-xl font-bold tracking-tight">
                {pagination?.totalItems ?? 0}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Thanh công cụ tìm kiếm & lọc */}
      <Card className="border-none shadow-sm ring-1 ring-border bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              placeholder="Tìm tên, email hoặc username..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-10 pl-10 border-none bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Danh sách dữ liệu */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex h-72 items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : !users.length ? (
          <EmptyState
            title="Không tìm thấy kết quả"
            description="Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc của bạn."
          />
        ) : (
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <UserTable users={users} />

            {pagination && (
              <div className="border-t border-border bg-muted/5 p-4">
                <Pagination meta={pagination} onPageChange={handlePageChange} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
