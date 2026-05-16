import { useState } from "react";
import { TransactionTable } from "../components/TransactionTable";
import { useTransactions } from "../hooks/useTransactions";
import { TransactionType, TransactionStatus } from "../types";
import { Badge } from "@/shared/components/ui/badge";
import { Pagination } from "@/shared/components/common/Pagination";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";

export default function TransactionManagementPage() {
  const [page, setPage] = useState(1);
  const [type, setPageType] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const { transactions, pagination, isLoading, error } = useTransactions({
    pageIndex: page,
    pageSize: 10,
    transactionType: type === "all" ? undefined : Number(type),
    status: status === "all" ? undefined : Number(status),
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (error) {
    return (
      <div className="p-8 text-center bg-destructive/5 rounded-lg border border-dashed border-destructive/20">
        <p className="text-destructive font-semibold">Đã xảy ra lỗi khi tải danh sách giao dịch.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold italic uppercase tracking-tight">Lịch sử giao dịch</h2>
          <p className="text-sm text-muted-foreground">
            Theo dõi toàn bộ biến động số dư và giao dịch hệ thống
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={type}
          onChange={(e) => {
            setPageType(e.target.value);
            setPage(1);
          }}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">Tất cả loại</option>
          <option value={TransactionType.ORDER_PAYMENT.toString()}>Thanh toán đơn</option>
          <option value={TransactionType.SERVICE_FEE.toString()}>Phí dịch vụ</option>
          <option value={TransactionType.SELLER_SETTLEMENT.toString()}>Quyết toán NB</option>
          <option value={TransactionType.COMMISSION_DEDUCTION.toString()}>Khấu trừ hoa hồng</option>
          <option value={TransactionType.REFUND.toString()}>Hoàn tiền</option>
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value={TransactionStatus.SUCCESS.toString()}>Thành công</option>
          <option value={TransactionStatus.PENDING.toString()}>Đang xử lý</option>
          <option value={TransactionStatus.FAILED.toString()}>Thất bại</option>
          <option value={TransactionStatus.EXPIRED.toString()}>Hết hạn</option>
          <option value={TransactionStatus.REFUNDED.toString()}>Đã hoàn tiền</option>
        </select>

        {pagination && (
          <Badge variant="secondary" className="ml-auto">
            Tổng: {pagination.totalItems}
          </Badge>
        )}
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-16" size="lg" />
      ) : (
        <div className="space-y-6">
          <TransactionTable transactions={transactions} isLoading={isLoading} />
          
          {pagination && (
            <div className="flex justify-center">
              <Pagination 
                meta={{
                  totalItems: pagination.totalItems,
                  totalPages: pagination.totalPages,
                  itemsPerPage: pagination.pageSize,
                  currentPage: pagination.pageIndex,
                  hasPreviousPage: pagination.hasPreviousPage,
                  hasNextPage: pagination.hasNextPage
                }} 
                onPageChange={handlePageChange} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
