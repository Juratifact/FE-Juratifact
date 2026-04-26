import { useState } from "react";
import { Search } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { UserCard } from "../components/UserCard";
import { useSearchUserByName } from "../hooks/useUsers";

export default function UserSearchPage() {
  const [keyword, setKeyword] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const { data: users, isLoading, isError } = useSearchUserByName(searchValue);

  const handleSearch = () => {
    const normalized = keyword.trim();
    setSearchValue(normalized);
  };

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold">Tìm người dùng theo username</h1>
        <p className="text-sm text-muted-foreground">
          API: GET /User/GetUserByName
        </p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            className="pl-10"
            placeholder="Nhập username..."
          />
        </div>
        <Button onClick={handleSearch}>Tìm</Button>
      </div>

      {!searchValue ? (
        <EmptyState
          title="Nhập username để tìm kiếm"
          description="Ví dụ: nguyenvanA"
        />
      ) : isLoading ? (
        <LoadingSpinner className="py-16" size="lg" />
      ) : isError ? (
        <EmptyState
          title="Không thể tìm kiếm"
          description="Vui lòng thử lại sau."
        />
      ) : !users?.length ? (
        <EmptyState
          title="Không tìm thấy người dùng"
          description="Hãy kiểm tra lại username."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
