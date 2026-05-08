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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Chi tiết đơn hàng</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => confirm.mutate(order.id)}
            disabled={confirm.isPending}
          >
            Xác nhận nhận hàng
          </Button>
          <Button
            variant="destructive"
            onClick={() => cancel.mutate({ id: order.id })}
            disabled={cancel.isPending}
          >
            Huỷ đơn
          </Button>
        </div>
      </div>

      <OrderCard order={order} />
    </div>
  );
}
