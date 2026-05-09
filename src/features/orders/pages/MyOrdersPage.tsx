import {
  useMyOrders,
  useConfirmReceipt,
  useCancelOrder,
} from "../hooks/useOrders";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { OrderCard } from "../components/OrderCard";
import type { GroupedOrder } from "../types";

export default function MyOrdersPage() {
  const { data: orders = [], isLoading } = useMyOrders();
  const confirmReceipt = useConfirmReceipt();
  const cancelOrder = useCancelOrder();

  if (isLoading) return <LoadingSpinner className="py-16" size="lg" />;
  if (!orders.length)
    return (
      <EmptyState
        title="Bạn chưa có đơn hàng"
        description="Hãy tạo đơn hàng để tiếp tục."
      />
    );

  return (
    <div className="space-y-4">
      {orders.map((o: GroupedOrder) => (
        <OrderCard
          key={o.id}
          order={o}
          onConfirmReceipt={confirmReceipt.mutate}
          isConfirmingReceipt={confirmReceipt.isPending}
          onCancelOrder={(orderId, reason) =>
            cancelOrder.mutate({ id: orderId, data: { reason } })
          }
          isCancellingOrder={cancelOrder.isPending}
        />
      ))}
    </div>
  );
}
