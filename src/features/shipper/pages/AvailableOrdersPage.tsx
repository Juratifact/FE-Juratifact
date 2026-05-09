import { useAuthStore } from "@/features/auth/store";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { useAcceptOrder, useAvailableOrders } from "../hooks/useShipper";
import { ShipperAvailableOrderTable } from "../components/ShipperAvailableOrderTable";

export default function AvailableOrdersPage() {
  const { data: orders = [], isLoading } = useAvailableOrders();
  const acceptOrderMutation = useAcceptOrder();
  const { userId } = useAuthStore();

  const handleAccept = async (orderId: string) => {
    if (!userId) return;
    acceptOrderMutation.mutate(orderId);
  };

  if (isLoading) {
    return <LoadingSpinner className="py-16" size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Đơn hàng khả dụng</h2>
          <p className="text-sm text-muted-foreground">
            Danh sách đơn hàng đang chờ shipper nhận
          </p>
        </div>
      </div>

      {/* Content */}
      {orders.length === 0 ? (
        <EmptyState
          title="Chưa có đơn nào khả dụng"
          description="Hiện tại chưa có đơn nào trong danh sách chờ nhận. Hãy quay lại sau."
        />
      ) : (
        <ShipperAvailableOrderTable
          orders={orders}
          onAccept={handleAccept}
          isAccepting={acceptOrderMutation.isPending}
        />
      )}
    </div>
  );
}
