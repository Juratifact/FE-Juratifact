import { Link } from "react-router-dom";
import { Check, X, Eye } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { getOrderStatusLabel, getPaymentStatusLabel } from "../types";
import type { GroupedOrder } from "../types";

interface OrderTableProps {
  orders: GroupedOrder[];
  onConfirmReceipt?: (id: string) => void;
  onCancel?: (id: string, reason: string) => void;
  isProcessing?: boolean;
}

export function OrderTable({
  orders,
  onConfirmReceipt,
  onCancel,
  isProcessing,
}: OrderTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã đơn</TableHead>
            <TableHead>Khách hàng</TableHead>
            <TableHead>Người bán</TableHead>
            <TableHead>Số lượng</TableHead>
            <TableHead>Tổng tiền</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Thanh toán</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((o) => (
            <TableRow key={o.id}>
              <TableCell className="font-medium font-mono text-xs">
                {o.code ?? o.id.slice(0, 8)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {o.recipientName ?? "—"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {o.sellerName ?? "—"}
              </TableCell>
              <TableCell>
                {o.items?.reduce((s, it) => s + it.quantity, 0)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {Number(o.totalAmount).toLocaleString("vi-VN")} ₫
              </TableCell>
              <TableCell className="text-muted-foreground">
                {getOrderStatusLabel(o.status)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {getPaymentStatusLabel(o.paymentStatus)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      to={`/orders/${o.id}?productId=${o.items?.[0]?.productId}`}
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Chi tiết
                    </Link>
                  </Button>
                  {o.status === 4 && onConfirmReceipt && (
                    <Button
                      size="sm"
                      onClick={() => onConfirmReceipt(o.id)}
                      disabled={isProcessing}
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Đã nhận
                    </Button>
                  )}
                  {o.status === 1 && o.paymentStatus === 1 && onCancel && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        const reason =
                          window.prompt("Nhập lý do huỷ đơn") ?? "";
                        if (reason.trim()) onCancel(o.id, reason.trim());
                      }}
                      disabled={isProcessing}
                    >
                      <X className="mr-1 h-3 w-3" />
                      Huỷ đơn
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
