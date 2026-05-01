import { useCallback, useEffect, useState } from "react";
import { Search, Users, ShieldCheck, Sparkles } from "lucide-react";
import { useSearchParams } from "react-router-dom";

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
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-linear-to-r from-slate-950 via-slate-900 to-orange-600 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Badge className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-white/10">
              Users center
            </Badge>
            <h1 className="mt-4 text-3xl font-black italic uppercase tracking-tight sm:text-5xl">
              Quản lý người dùng
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-200 sm:text-base">
              Giao diện tập trung vào tốc độ duyệt, tìm kiếm và xử lý tài khoản
              theo phong cách marketplace.
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
                Active
              </p>
              <p className="mt-1 text-2xl font-black">{users.length}</p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300">
                VIP
              </p>
              <p className="mt-1 text-2xl font-black">12</p>
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
            <p className="text-sm text-slate-500">Tìm theo tên hoặc username</p>
          </div>
          <Button
            variant="outline"
            className="rounded-2xl border-slate-200 bg-slate-50"
          >
            <Sparkles className="mr-2 size-4" /> Smart actions
          </Button>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3 p-6">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên hoặc username..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-10 shadow-sm"
            />
          </div>

          {pagination && (
            <Badge
              variant="secondary"
              className="ml-auto rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.2em]"
            >
              <Users className="mr-2 size-3.5" /> Tổng: {pagination.totalItems}
            </Badge>
          )}
          <Badge
            variant="secondary"
            className="rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.2em]"
          >
            <ShieldCheck className="mr-2 size-3.5" /> Safe mode
          </Badge>
        </CardContent>
      </Card>

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
