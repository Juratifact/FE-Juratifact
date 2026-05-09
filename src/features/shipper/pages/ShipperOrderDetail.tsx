import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, MapPin, Phone, Calendar, FileText } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import {
  useShipperOrderDetail,
  useConfirmPickup,
  useConfirmDelivery,
} from "../hooks/useShipper";
import type { OrderItem } from "../types";

const statusLabel: Record<number, string> = {
  0: "Chờ thanh toán",
  1: "Đã thanh toán",
  2: "Đã phân công",
  3: "Đang giao",
  4: "Đã giao",
  5: "Hoàn thành",
  6: "Đã huỷ",
  7: "Tranh chấp",
};

const paymentStatusLabel: Record<number, string> = {
  1: "Chờ thanh toán",
  2: "Đã thanh toán",
  0: "Khác",
};

/**
 * Chi tiết đơn hàng của shipper
 */
export default function ShipperOrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const {
    data: order,
    isLoading,
    error,
  } = useShipperOrderDetail(orderId || "");

  const [file, setFile] = useState<File | null>(null);
  const confirmPickupMutation = useConfirmPickup();
  const confirmDeliveryMutation = useConfirmDelivery();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <p className="text-muted-foreground">
          Không thể tải thông tin đơn hàng
        </p>
        <Button asChild>
          <Link to="/shipper/my-orders">Quay lại</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/shipper/my-orders">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      {/* Order Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Đơn hàng {order.orderId.slice(0, 8)}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Ngày tạo: {new Date(order.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>
            <Badge className="text-lg" variant="secondary">
              {statusLabel[order.status] ?? "Không xác định"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-muted-foreground">
                Tên khách hàng
              </p>
              <p className="text-base font-medium">{order.customerName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-muted-foreground">
                Số điện thoại
              </p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-base font-medium">{order.customerPhone}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-2 rounded-lg bg-muted/50 p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <p className="font-semibold text-muted-foreground">
                Địa chỉ giao hàng
              </p>
            </div>
            <p className="ml-6 text-base">{order.shippingAddress}</p>
          </div>

          {/* Order Items */}
          <div className="space-y-3">
            <p className="font-semibold">Sản phẩm:</p>
            <div className="space-y-2">
              {order.items.map((item: OrderItem) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                >
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      ID: {item.productId.slice(0, 8)}...
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-base">
                      {item.price.toLocaleString()} ₫
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Details */}
          <div className="space-y-2 border-t pt-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Tổng tiền hàng:</p>
              <p className="font-medium">
                {(order.totalPrice - order.shippingFee).toLocaleString()} ₫
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Phí vận chuyển:</p>
              <p className="font-medium">
                {order.shippingFee.toLocaleString()} ₫
              </p>
            </div>
            <div className="flex items-center justify-between border-t pt-2">
              <p className="font-semibold">Tổng cộng:</p>
              <p className="text-lg font-bold text-green-600">
                {order.totalPrice.toLocaleString()} ₫
              </p>
            </div>
          </div>

          {/* Payment & Status Info */}
          <div className="grid gap-4 sm:grid-cols-2 border-t pt-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">
                Phương thức thanh toán
              </p>
              <p className="font-medium">{order.paymentMethod}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground">
                Trạng thái thanh toán
              </p>
              <Badge variant="outline">
                {paymentStatusLabel[order.paymentStatus] ?? "Không xác định"}
              </Badge>
            </div>
          </div>

          {/* Pickup & Delivery Times */}
          {(order.pickupAt || order.deliveryAt) && (
            <div className="grid gap-4 sm:grid-cols-2">
              {order.pickupAt && (
                <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">
                      Lấy hàng
                    </p>
                    <p className="font-medium">
                      {new Date(order.pickupAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
              )}
              {order.deliveryAt && (
                <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">
                      Giao hàng
                    </p>
                    <p className="font-medium">
                      {new Date(order.deliveryAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* POD Images */}
          {(order.shipperPod1Url || order.shipperPod2Url) && (
            <div className="space-y-3 border-t pt-4">
              <p className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Chứng minh giao nhận
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {order.shipperPod1Url && (
                  <a
                    href={order.shipperPod1Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="overflow-hidden rounded-lg border hover:border-blue-500 transition-colors"
                  >
                    <img
                      src={order.shipperPod1Url}
                      alt="POD 1"
                      className="aspect-square w-full object-cover"
                    />
                  </a>
                )}
                {order.shipperPod2Url && (
                  <a
                    href={order.shipperPod2Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="overflow-hidden rounded-lg border hover:border-blue-500 transition-colors"
                  >
                    <img
                      src={order.shipperPod2Url}
                      alt="POD 2"
                      className="aspect-square w-full object-cover"
                    />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Confirm actions: upload evidence + confirm pickup/delivery */}
          <div className="space-y-3 border-t pt-4">
            <p className="font-semibold">Xác nhận</p>
            <div className="space-y-3">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">
                  Tải lên hình ảnh chứng minh
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="rounded-md border px-3 py-2"
                  required
                />
                {!file && (
                  <p className="text-xs text-red-600">
                    Vui lòng chọn hình ảnh trước khi xác nhận
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {/* Show pickup button only if status is pending (2) */}
                {order.status === 2 && (
                  <Button
                    disabled={!file || confirmPickupMutation.isPending}
                    onClick={() => {
                      if (!file) {
                        toast.error(
                          "Vui lòng chọn hình ảnh trước khi xác nhận",
                        );
                        return;
                      }
                      confirmPickupMutation.mutate({
                        orderId: order.orderId,
                        file,
                      });
                    }}
                    className="flex-1"
                  >
                    Xác nhận nhận hàng
                  </Button>
                )}
                {/* Show delivery button only if already picked up (status !== 2) */}
                {order.status !== 2 && (
                  <Button
                    disabled={!file || confirmDeliveryMutation.isPending}
                    onClick={() => {
                      if (!file) {
                        toast.error(
                          "Vui lòng chọn hình ảnh trước khi xác nhận",
                        );
                        return;
                      }
                      confirmDeliveryMutation.mutate({
                        orderId: order.orderId,
                        file,
                      });
                    }}
                    className="flex-1"
                  >
                    Xác nhận giao hàng
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
