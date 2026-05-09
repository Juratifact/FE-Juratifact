import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { useState } from "react";
import { getOrderStatusLabel, getPaymentStatusLabel } from "../types";
import type { Order, GroupedOrder } from "../types";

interface OrderCardProps {
  order: Order | GroupedOrder;
  onConfirmReceipt?: (orderId: string) => void;
  isConfirmingReceipt?: boolean;
  onCancelOrder?: (orderId: string, reason: string) => void;
  isCancellingOrder?: boolean;
}

export function OrderCard({
  order,
  onConfirmReceipt,
  isConfirmingReceipt,
  onCancelOrder,
  isCancellingOrder,
}: OrderCardProps) {
  const [cancelReason, setCancelReason] = useState("");
  const isGroupedOrder = (value: Order | GroupedOrder): value is GroupedOrder =>
    Object.prototype.hasOwnProperty.call(value, "paymentStatus");

  const paymentStatus = order.paymentStatus;
  const priceFormatter = new Intl.NumberFormat("vi-VN");

  return (
    <Card className="mx-auto w-full max-w-2xl overflow-hidden border-border bg-card shadow-sm transition-all hover:shadow-md">
      <CardHeader className="px-6 py-4 space-y-0 flex-row items-center justify-between bg-muted/30">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
            Reference
          </span>
          <span className="font-mono text-xs font-semibold">
            #{order.code ?? order.id.toString().slice(0, 8)}
          </span>
        </div>
        <Badge
          variant="secondary"
          className="rounded-md font-medium text-[11px] uppercase tracking-wider"
        >
          {getOrderStatusLabel(order.status)}
        </Badge>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase font-bold tracking-tight text-muted-foreground">
              Khách hàng
            </p>
            <p className="text-[13px] font-medium leading-none">
              {isGroupedOrder(order) ? order.recipientName : "N/A"}
            </p>
          </div>
          {isGroupedOrder(order) && order.sellerName && (
            <div className="space-y-1.5 text-right">
              <p className="text-[10px] uppercase font-bold tracking-tight text-muted-foreground">
                Người bán
              </p>
              <p className="text-[13px] font-medium leading-none italic text-primary">
                {order.sellerName}
              </p>
            </div>
          )}
        </div>

        <Separator className="opacity-60" />
        <div className="space-y-4">
          {order.items?.map((it) => (
            <div
              key={it.productId}
              className="flex items-start justify-between"
            >
              <div className="flex gap-4">
                <span className="text-xs font-mono text-muted-foreground pt-0.5">
                  {it.quantity}x
                </span>
                <div className="space-y-1">
                  <p className="text-[13px] font-semibold leading-none italic">
                    {it.productName ?? "Sản phẩm"}
                  </p>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-tighter">
                    {it.condition ?? "Like New"}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold tabular-nums">
                {priceFormatter.format(Number(it.unitPrice))}đ
              </span>
            </div>
          ))}
        </div>
        <div className="pt-2 border-t border-dashed space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase text-muted-foreground tracking-widest">
              {getPaymentStatusLabel(paymentStatus)}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] font-medium text-muted-foreground">
                Total
              </span>
              <span className="text-xl font-black tracking-tighter">
                {priceFormatter.format(Number(order.totalAmount))}đ
              </span>
            </div>
          </div>
          {order.status === 4 && onConfirmReceipt && (
            <div className="flex justify-end pt-2">
              <Button
                size="sm"
                onClick={() => onConfirmReceipt(order.id)}
                disabled={isConfirmingReceipt}
              >
                Đã nhận được hàng
              </Button>
            </div>
          )}
          {order.status === 1 && paymentStatus === 1 && onCancelOrder && (
            <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold">Lý do huỷ đơn</p>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Nhập lý do huỷ đơn"
                  className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onCancelOrder(order.id, cancelReason.trim())}
                  disabled={!cancelReason.trim() || isCancellingOrder}
                >
                  Huỷ đơn hàng
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
