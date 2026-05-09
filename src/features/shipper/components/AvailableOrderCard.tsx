import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import type { ShipperAvailableOrder } from "../types";

interface AvailableOrderCardProps {
  order: ShipperAvailableOrder;
  onAccept: (orderId: string) => void;
  isPending?: boolean;
}

export function AvailableOrderCard({
  order,
  onAccept,
  isPending = false,
}: AvailableOrderCardProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border-border/70 bg-card shadow-sm transition-all hover:shadow-md">
      <CardHeader className="border-b bg-muted/20 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Mã đơn
            </p>
            <p className="font-mono text-sm font-semibold">
              #{order.orderId.slice(0, 8)}
            </p>
          </div>
          <Badge variant="outline" className="rounded-full px-3 py-1">
            Chờ shipper
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-5">
        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Địa chỉ người bán
            </p>
            <p className="font-medium leading-5 text-foreground">
              {order.addressSeller ?? "Chưa có"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Địa chỉ người nhận
            </p>
            <p className="font-medium leading-5 text-foreground">
              {order.addressBuyer ?? "Chưa có"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Tổng phí
            </p>
            <p className="mt-0.5 text-lg font-black tracking-tight text-primary">
              {(order.totalPrice ?? 0).toLocaleString("vi-VN")} đ
            </p>
          </div>

          <Button
            className="rounded-full px-5"
            onClick={() => onAccept(order.orderId)}
            disabled={isPending}
          >
            {isPending ? "Đang nhận..." : "Nhận đơn"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
