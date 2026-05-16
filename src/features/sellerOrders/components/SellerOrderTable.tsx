import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { getOrderStatusLabel, getPaymentStatusLabel } from "@/features/orders/types";
import type { SellerOrder } from "../types";

interface SellerOrderTableProps {
  orders: SellerOrder[];
  isLoading?: boolean;
}

export function SellerOrderTable({ orders, isLoading }: SellerOrderTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground">
        <p>Bạn chưa có đơn hàng nào.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã đơn</TableHead>
            <TableHead>Khách hàng</TableHead>
            <TableHead>Số lượng</TableHead>
            <TableHead>Tổng tiền</TableHead>
            <TableHead>Lợi nhuận</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Thanh toán</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-xs font-medium">
                {order.code}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{order.buyerName}</span>
                  <span className="text-xs text-muted-foreground">{order.buyerPhone}</span>
                </div>
              </TableCell>
              <TableCell>
                {order.items.reduce((acc, item) => acc + item.quantity, 0)}
              </TableCell>
              <TableCell>
                {order.totalPrice.toLocaleString("vi-VN")} ₫
              </TableCell>
              <TableCell className="font-black text-emerald-500">
                +{order.sellerReceivableAmount.toLocaleString("vi-VN")} ₫
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground">
                  {getOrderStatusLabel(order.status)}
                </span>
              </TableCell>
              <TableCell>
                 <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
                   {getPaymentStatusLabel(order.paymentStatus)}
                 </span>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/seller/orders/${order.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Chi tiết
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
