import { MapPin, Phone } from "lucide-react";
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
    <div className="overflow-x-auto rounded-xl border border-border/50 bg-card shadow-sm">
      <Table className="min-w-[1000px]">
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px] font-semibold text-foreground">Mã đơn</TableHead>
            <TableHead className="w-[280px] font-semibold text-foreground">Địa chỉ lấy hàng</TableHead>
            <TableHead className="w-[280px] font-semibold text-foreground">Địa chỉ giao hàng</TableHead>
            <TableHead className="w-[150px] font-semibold text-foreground">Tổng tiền</TableHead>
            <TableHead className="w-[120px] font-semibold text-foreground">Trạng thái</TableHead>
            <TableHead className="text-right font-semibold text-foreground">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.orderId} className="group hover:bg-muted/50 transition-colors">
              <TableCell className="font-medium font-mono text-[10px] text-muted-foreground uppercase">
                {order.orderId.slice(0, 8)}
              </TableCell>
              <TableCell>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="line-clamp-2 text-xs text-muted-foreground font-medium leading-relaxed">
                      {order.sellerAddress || order.addressSeller || "Chưa cập nhật"}
                    </p>
                    {order.sellerPhone && (
                      <p className="text-[10px] text-muted-foreground/60 flex items-center gap-1">
                        <Phone className="h-2.5 w-2.5" />
                        {order.sellerPhone}
                      </p>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <p className="line-clamp-2 text-xs text-muted-foreground font-medium leading-relaxed min-w-0">
                    {order.addressBuyer || "Chưa cập nhật"}
                  </p>
                </div>
              </TableCell>
              <TableCell className="font-black text-foreground text-sm">
                {(order.totalPrice || 0).toLocaleString()} ₫
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-tighter">
                  Chờ shipper
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end">
                  <Button 
                    size="sm" 
                    className="rounded-full h-8 px-4 font-bold text-[11px] uppercase tracking-wider"
                    onClick={() => onAccept(order.orderId)}
                    disabled={isAccepting}
                  >
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
