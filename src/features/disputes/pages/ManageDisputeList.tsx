import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAllDisputes, useResolveDispute, useAssignDispute } from "../hooks/useDisputes";
import { useAuthStore } from "@/features/auth/store";
import { AdminDisputeTable } from "../components/AdminDisputeTable";
import { ResolveDisputeDialog } from "../components/ResolveDisputeDialog";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { Pagination } from "@/shared/components/common/Pagination";
import { Badge } from "@/shared/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import type { DisputeItem } from "../types";

export default function ManageDisputeList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const statusParam = searchParams.get("status");
  const status = statusParam !== null && statusParam !== "" ? Number(statusParam) : undefined;

  const { data: disputesData, isLoading } = useAllDisputes({
    status,
    pageIndex: page,
    pageSize: 10,
  });

  const resolveMutation = useResolveDispute();
  const assignMutation = useAssignDispute();
  const userId = useAuthStore((s) => s.userId);

  const [selectedDispute, setSelectedDispute] = useState<DisputeItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const disputes = disputesData?.items || [];
  const totalItems = disputesData?.totalItems || 0;
  const itemsPerPage = disputesData?.pageSize || 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginationMeta = {
    totalItems,
    totalPages,
    itemsPerPage,
    currentPage: page,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("page", String(newPage));
      return params;
    });
  };

  const handleStatusChange = (val: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (val === "all") {
        params.delete("status");
      } else {
        params.set("status", val);
      }
      params.set("page", "1"); // Reset to page 1 on filter transition
      return params;
    });
  };

  const activeTabValue = status === undefined ? "all" : String(status);

  const handleResolveClick = (dispute: DisputeItem) => {
    setSelectedDispute(dispute);
    setDialogOpen(true);
  };

  const handleResolveConfirm = (result: number, adminNote: string) => {
    if (selectedDispute) {
      resolveMutation.mutate(
        {
          disputeId: selectedDispute.disputeId,
          data: { result, adminNote },
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setSelectedDispute(null);
          },
        }
      );
    }
  };

  const handleAssignClick = (disputeId: string) => {
    if (userId) {
      assignMutation.mutate({ disputeId, assignedAdminId: userId });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quản lý tranh chấp</h2>
          <p className="text-sm text-muted-foreground">
            Giải quyết các khiếu nại, tranh chấp đơn hàng giữa người mua và người bán trên toàn hệ thống.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs value={activeTabValue} onValueChange={handleStatusChange} className="w-auto">
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="0">Đã mở</TabsTrigger>
            <TabsTrigger value="1">Đang xử lý</TabsTrigger>
            <TabsTrigger value="2">Đã xử lý</TabsTrigger>
          </TabsList>
        </Tabs>

        {disputesData && (
          <Badge variant="secondary" className="font-semibold py-1 px-3">
            Tổng số: {totalItems}
          </Badge>
        )}
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <LoadingSpinner className="py-16" size="lg" />
      ) : disputes.length === 0 ? (
        <EmptyState
          title="Không có tranh chấp nào"
          description="Hiện không có tranh chấp hoặc khiếu nại nào cần xử lý trong danh sách này."
        />
      ) : (
        <>
          <AdminDisputeTable
            disputes={disputes}
            onResolve={handleResolveClick}
            onAssign={handleAssignClick}
            isAssigning={assignMutation.isPending}
          />

          {paginationMeta.totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination meta={paginationMeta} onPageChange={handlePageChange} />
            </div>
          )}
        </>
      )}

      {/* Resolve Modal Dialog */}
      <ResolveDisputeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleResolveConfirm}
        isProcessing={resolveMutation.isPending}
      />
    </div>
  );
}
