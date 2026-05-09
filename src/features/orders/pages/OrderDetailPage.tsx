import { useParams } from "react-router-dom";
import {
  useOrderDetail,
  useConfirmReceipt,
  useCancelOrder,
} from "../hooks/useOrders";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { OrderCard } from "../components/OrderCard";
import { Button } from "@/shared/components/ui/button";

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const { data: order, isLoading } = useOrderDetail(orderId ?? "");
  const confirm = useConfirmReceipt();
  const cancel = useCancelOrder();

  if (isLoading) return <LoadingSpinner className="py-16" size="lg" />;
  if (!order) return <div>Đơn hàng không tìm thấy</div>;

  console.log("Order:", order);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Chi tiết đơn hàng</h1>
        <div className="flex gap-2">
          {/* Show confirm receipt button only when order is delivered (status = 4) */}
          {(order.status === 4 || order.status === 3) && (
            <Button
              onClick={() => confirm.mutate(order.id)}
              disabled={confirm.isPending}
            >
              Đã nhận được hàng
            </Button>
          )}
          {/* Show cancel button only for orders that can be cancelled */}
          {order.status !== 4 &&
            order.status !== 5 &&
            order.status !== 6 &&
            order.status !== 3 && (
              <Button
                variant="destructive"
                onClick={() => cancel.mutate({ id: order.id })}
                disabled={cancel.isPending}
              >
                Huỷ đơn
              </Button>
            )}
        </div>
      </div>

      <OrderCard order={order} />
    </div>
  );
}
