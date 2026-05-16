import type { Transaction } from "../types";
import { TransactionStatus, TransactionType } from "../types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  Wallet, 
  ShieldCheck, 
  Undo2,
  Clock,
  XCircle,
  Ban
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export function TransactionTable({ transactions, isLoading }: TransactionTableProps) {
  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.ORDER_PAYMENT: return <ArrowDownLeft className="w-4 h-4 text-emerald-500" />;
      case TransactionType.SERVICE_FEE: return <ArrowUpRight className="w-4 h-4 text-amber-500" />;
      case TransactionType.SELLER_SETTLEMENT: return <Wallet className="w-4 h-4 text-primary" />;
      case TransactionType.COMMISSION_DEDUCTION: return <ShieldCheck className="w-4 h-4 text-purple-500" />;
      case TransactionType.REFUND: return <Undo2 className="w-4 h-4 text-blue-500" />;
      default: return <RefreshCw className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.SUCCESS:
        return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none font-medium">Thành công</Badge>;
      case TransactionStatus.PENDING:
        return <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-none font-medium flex items-center gap-1 w-fit"><Clock className="size-3" /> Đang xử lý</Badge>;
      case TransactionStatus.FAILED:
        return <Badge variant="secondary" className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-none font-medium flex items-center gap-1 w-fit"><XCircle className="size-3" /> Thất bại</Badge>;
      case TransactionStatus.EXPIRED:
        return <Badge variant="secondary" className="font-medium flex items-center gap-1 w-fit"><Ban className="size-3" /> Hết hạn</Badge>;
      case TransactionStatus.REFUNDED:
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-none font-medium flex items-center gap-1 w-fit"><Undo2 className="size-3" /> Đã hoàn tiền</Badge>;
      default:
        return <Badge variant="secondary" className="font-medium">Không rõ</Badge>;
    }
  };

  const getTypeName = (type: TransactionType) => {
    switch (type) {
      case TransactionType.ORDER_PAYMENT: return "Thanh toán đơn hàng";
      case TransactionType.SERVICE_FEE: return "Phí dịch vụ";
      case TransactionType.SELLER_SETTLEMENT: return "Quyết toán người bán";
      case TransactionType.COMMISSION_DEDUCTION: return "Khấu trừ hoa hồng";
      case TransactionType.REFUND: return "Hoàn tiền";
      default: return "Giao dịch khác";
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Loại giao dịch</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Số tiền</TableHead>
            <TableHead className="text-center">Trạng thái</TableHead>
            <TableHead className="text-right">Ngày thực hiện</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="font-medium py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    {getTransactionIcon(tx.transactionType)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{getTypeName(tx.transactionType)}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-tight">{tx.referenceCode}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate py-4">
                {tx.description || "Giao dịch hệ thống"}
              </TableCell>
              <TableCell className="font-bold py-4">
                <span className={cn(
                  tx.status === TransactionStatus.FAILED 
                    ? "text-muted-foreground" 
                    : "text-emerald-500"
                )}>
                  {tx.status !== TransactionStatus.FAILED && "+"}
                  {tx.amount.toLocaleString("vi-VN")}đ
                </span>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex justify-center">
                    {getStatusBadge(tx.status)}
                </div>
              </TableCell>
              <TableCell className="text-right text-muted-foreground text-sm whitespace-nowrap py-4">
                {new Date(tx.createdAt).toLocaleString("vi-VN")}
              </TableCell>
            </TableRow>
          ))}
          {!isLoading && transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-medium">
                Chưa có giao dịch nào được ghi nhận.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
