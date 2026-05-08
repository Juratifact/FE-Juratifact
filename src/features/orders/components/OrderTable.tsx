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
import { getOrderStatusLabel } from "../types";
import type { Order } from "../types";

interface OrderTableProps {
  orders: Order[];
  onConfirm?: (id: string) => void;
  onCancel?: (id: string) => void;
  isProcessing?: boolean;
}

export function OrderTable({
  orders,
  onConfirm,
  onCancel,
  isProcessing,
}: OrderTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã</TableHead>
            <TableHead>Người đặt</TableHead>
            <TableHead>Số lượng</TableHead>
            <TableHead>Tổng tiền</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((o) => (
            <TableRow key={o.id}>
              <TableCell className="font-medium">{o.code ?? o.id}</TableCell>
              <TableCell className="text-muted-foreground">
                {o.userId ?? "—"}
              </TableCell>
              <TableCell>
                {o.items?.reduce((s, it) => s + it.quantity, 0)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {o.totalAmount}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {getOrderStatusLabel(o.status)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/orders/${o.id}`}>
                      <Eye className="mr-1 h-3 w-3" />
                      Xem
                    </Link>
                  </Button>
                  {onConfirm && (
                    <Button
                      size="sm"
                      onClick={() => onConfirm(o.id)}
                      disabled={isProcessing}
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Nhận
                    </Button>
                  )}
                  {onCancel && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onCancel(o.id)}
                      disabled={isProcessing}
                    >
                      <X className="mr-1 h-3 w-3" />
                      Huỷ
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
