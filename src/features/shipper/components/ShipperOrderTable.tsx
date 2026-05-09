import { Link } from "react-router-dom";
import { Eye, Trash2, MapPin, DollarSign } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { ShipperOrder } from "../types";

interface ShipperOrderTableProps {
  orders: ShipperOrder[];
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

const statusVariant: Record<
  number,
  "default" | "secondary" | "destructive" | "outline"
> = {
  2: "outline",
  3: "default",
  4: "secondary",
  5: "secondary",
  6: "destructive",
};

const statusLabel: Record<number, string> = {
  0: "Chờ thanh toán",
  1: "Đã thanh toán",
  2: "Đã phân công",
  3: "Đang giao",
  4: "Đã giao",
  5: "Hoàn thành",
  6: "Đã huỷ",
  7: "Tranh chấp",
};

const paymentStatusLabel: Record<number, string> = {
  1: "Chờ thanh toán",
  2: "Đã thanh toán",
  0: "Khác",
};

/**
 * Table hiển thị danh sách đơn hàng của shipper.
 * Sử dụng shadcn Table + Button + Badge.
 */
export function ShipperOrderTable({
  orders,
  onDelete,
  isDeleting,
}: ShipperOrderTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã đơn</TableHead>
            <TableHead>Khách hàng</TableHead>
            <TableHead>Địa chỉ giao</TableHead>
            <TableHead>Tổng tiền</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Thanh toán</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.orderId}>
              <TableCell className="font-medium font-mono text-xs">
                {order.orderId.slice(0, 8)}...
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.customerPhone}
                  </p>
                </div>
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-1 h-3 w-3 shrink-0 text-muted-foreground" />
                  <p className="truncate text-sm text-muted-foreground">
                    {order.shippingAddress}
                  </p>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  {order.totalPrice.toLocaleString()} ₫
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant[order.status] ?? "outline"}>
                  {statusLabel[order.status] ?? "Không xác định"}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {paymentStatusLabel[order.paymentStatus] ?? "Không xác định"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/shipper/my-orders/${order.orderId}`}>
                      <Eye className="mr-1 h-3 w-3" />
                      Chi tiết
                    </Link>
                  </Button>
                  {onDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive/30 hover:bg-destructive/10"
                      onClick={() => {
                        if (window.confirm("Bạn có chắc muốn xoá?")) {
                          onDelete(order.orderId);
                        }
                      }}
                      disabled={isDeleting}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Xoá
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
