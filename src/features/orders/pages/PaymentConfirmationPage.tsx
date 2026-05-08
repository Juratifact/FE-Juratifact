import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { CheckCircle, QrCode, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import { orderActions } from "../services";
import { useCancelOrder } from "../hooks/useOrders";

export default function PaymentConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentInfo = location.state?.paymentInfo;
  const cancelOrderMutation = useCancelOrder();

  const orderQuery = useQuery({
    queryKey: QUERY_KEYS.ORDER_DETAIL(paymentInfo?.orderId ?? ""),
    queryFn: () => orderActions.getStatus(paymentInfo?.orderId ?? ""),
    enabled: !!paymentInfo?.orderId,
    refetchInterval: 3000,
    retry: false,
  });

  useEffect(() => {
    if (orderQuery.data?.paymentStatus === 1) {
      toast.success("Thanh toán đã được xác nhận");
      navigate("/orders", { replace: true });
    }
  }, [navigate, orderQuery.data?.paymentStatus]);

  const handleCheckTransfer = async () => {
    const result = await orderQuery.refetch();
    if (result.data?.paymentStatus === 1) {
      toast.success("Thanh toán đã được xác nhận");
      navigate("/orders", { replace: true });
      return;
    }

    toast.info("Chưa xác nhận chuyển khoản, vui lòng thử lại sau.");
  };

  const handleCancelPayment = () => {
    if (!paymentInfo?.orderId) return;

    cancelOrderMutation.mutate(
      { id: paymentInfo.orderId },
      {
        onSuccess: () => {
          navigate("/cart", { replace: true });
        },
      },
    );
  };

  if (!paymentInfo) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <Card className="rounded-2xl">
          <CardContent className="pt-12 text-center">
            <p className="text-muted-foreground">
              Không tìm thấy thông tin thanh toán
            </p>
            <Button
              onClick={() => navigate("/orders")}
              className="mt-4 rounded-full"
            >
              Quay lại đơn hàng
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="space-y-6">
        {/* Success Badge */}
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Đơn hàng đã được tạo</h1>
          <p className="mt-2 text-muted-foreground">
            Mã đơn hàng:{" "}
            <span className="font-mono font-semibold">
              {paymentInfo.orderId}
            </span>
          </p>
        </div>

        {/* Payment QR Code Card */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Quét mã QR để thanh toán
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {paymentInfo.qrUrl ? (
              <div className="flex justify-center">
                <div className="flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted">
                  <img
                    src={paymentInfo.qrUrl}
                    alt="QR Code"
                    className="h-full w-full object-contain p-2"
                  />
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="text-center text-muted-foreground">
                  <p>Không tìm thấy mã QR thanh toán</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Vui lòng quét mã QR để hoàn tất thanh
                toán. Đơn hàng sẽ được xác nhận ngay sau khi thanh toán thành
                công.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-full"
            onClick={handleCancelPayment}
            disabled={cancelOrderMutation.isPending}
          >
            {cancelOrderMutation.isPending ? "Đang hủy..." : "Hủy thanh toán"}
          </Button>
          <Button
            className="flex-1 rounded-full"
            onClick={handleCheckTransfer}
            disabled={orderQuery.isFetching}
          >
            {orderQuery.isFetching ? "Đang kiểm tra..." : "Tôi đã chuyển khoản"}
          </Button>
        </div>
      </div>
    </div>
  );
}
