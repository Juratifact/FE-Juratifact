import { MapPin, DollarSign, CheckCircle } from "lucide-react";
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
import type { ShipperAvailableOrder } from "../types";

interface ShipperAvailableOrderTableProps {
  orders: ShipperAvailableOrder[];
  onAccept: (id: string) => void;
  isAccepting?: boolean;
}

export function ShipperAvailableOrderTable({
  orders,
  onAccept,
  isAccepting,
}: ShipperAvailableOrderTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[120px] font-semibold text-slate-900">Mã đơn</TableHead>
            <TableHead className="font-semibold text-slate-900">Địa chỉ lấy hàng</TableHead>
            <TableHead className="font-semibold text-slate-900">Địa chỉ giao hàng</TableHead>
            <TableHead className="font-semibold text-slate-900">Tổng tiền</TableHead>
            <TableHead className="font-semibold text-slate-900">Trạng thái</TableHead>
            <TableHead className="text-right font-semibold text-slate-900">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.orderId} className="group hover:bg-slate-50/80 transition-colors">
              <TableCell className="font-medium font-mono text-xs text-slate-500">
                {order.orderId.slice(0, 8).toUpperCase()}...
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-1 h-3.5 w-3.5 shrink-0 text-blue-500/70" />
                  <p className="truncate text-sm text-slate-600 font-medium">
                    {order.addressSeller || "Chưa cập nhật"}
                  </p>
                </div>
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-1 h-3.5 w-3.5 shrink-0 text-orange-500/70" />
                  <p className="truncate text-sm text-slate-600 font-medium">
                    {order.addressBuyer || "Chưa cập nhật"}
                  </p>
                </div>
              </TableCell>
              <TableCell className="font-bold text-slate-900">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  {(order.totalPrice || 0).toLocaleString()} ₫
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="rounded-full bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium border-slate-200 text-slate-600">
                  Chờ shipper
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button 
                    size="sm" 
                    className="rounded-full h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-md active:scale-95 border-none"
                    onClick={() => onAccept(order.orderId)}
                    disabled={isAccepting}
                  >
                    <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                    {isAccepting ? "Đang nhận..." : "Nhận đơn"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
