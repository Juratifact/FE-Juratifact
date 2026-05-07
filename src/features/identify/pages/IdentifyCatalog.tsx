import { Link } from "react-router-dom";
import { Plus, Clock } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { useGetMyIdentifyDocument } from "../hooks/useIdentify";
import { IdentifyCard } from "../components/IdentifyCard";

export default function IdentifyCatalog() {
  const { data: document, isLoading } = useGetMyIdentifyDocument();

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Xác minh tài liệu</h1>
          <p className="mt-1 text-muted-foreground">
            Quản lý tài liệu xác minh của bạn
          </p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner className="py-20" size="lg" />
      ) : !document ? (
        <div className="space-y-4">
          <EmptyState
            title="Chưa có tài liệu xác minh"
            description="Gửi tài liệu xác minh để truy cập các tính năng đầy đủ"
          />
          <Button asChild className="w-full">
            <Link to="/identify/create">
              <Plus className="mr-2 h-4 w-4" />
              Gửi tài liệu xác minh
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <IdentifyCard document={document} />

          {document.status === 0 || document.status === 3 ? (
            <div className="rounded-md bg-amber-50 p-4 dark:bg-amber-950">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <div className="text-sm text-amber-900 dark:text-amber-300">
                  Tài liệu của bạn đang được xử lý. Vui lòng chờ thông báo kết
                  quả.
                </div>
              </div>
            </div>
          ) : document.status === 1 ? (
            <div className="rounded-md bg-green-50 p-4 dark:bg-green-950">
              <div className="text-sm text-green-900 dark:text-green-300">
                ✓ Tài liệu của bạn đã được xác minh thành công!
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
