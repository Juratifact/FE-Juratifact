import { useMemo } from "react";
import { useAuthStore } from "@/features/auth/store";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useAcceptOrder, useAvailableOrders } from "../hooks/useShipper";
import { AvailableOrderCard } from "../components/AvailableOrderCard";

export default function AvailableOrdersPage() {
  const { data: orders = [], isLoading } = useAvailableOrders();
  const acceptOrderMutation = useAcceptOrder();
  const { userId } = useAuthStore();

  const totalPrice = useMemo(
    () => orders.reduce((sum, order) => sum + (order.totalPrice ?? 0), 0),
    [orders],
  );

  const handleAccept = async (orderId: string) => {
    if (!userId) return;
    acceptOrderMutation.mutate(orderId);
  };

  if (isLoading) {
    return <LoadingSpinner className="py-16" size="lg" />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:py-8">
      <div className="flex flex-col gap-4 rounded-3xl border bg-card p-6 shadow-sm md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
            Shipper panel
          </p>
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">
            Đơn hàng khả dụng
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Danh sách đơn chờ nhận. Chọn một đơn để nhận và bắt đầu xử lý giao
            hàng.
          </p>
        </div>

        <Card className="w-full max-w-xs rounded-2xl border-dashed">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Tổng đơn chờ
              </p>
              <p className="text-2xl font-black">{orders.length}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Tổng phí
              </p>
              <p className="text-base font-bold text-primary">
                {totalPrice.toLocaleString("vi-VN")} đ
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title="Chưa có đơn nào khả dụng"
          description="Hiện tại chưa có đơn nào trong danh sách chờ nhận. Hãy quay lại sau."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {orders.map((order) => (
            <AvailableOrderCard
              key={order.orderId}
              order={order}
              onAccept={handleAccept}
              isPending={acceptOrderMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
