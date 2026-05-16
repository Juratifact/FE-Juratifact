import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, MapPin, Phone, Calendar, FileText, CheckCircle, Loader2 } from "lucide-react";


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
import { cn } from "@/lib/utils";

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
  1: "Đã thanh toán",
  2: "Đã quyết toán",
  0: "Chưa thanh toán",
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
        <Link to="/admin/shipper/my-orders">
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
            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Người mua
              </p>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-muted-foreground">
                  Họ tên
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

            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Người bán
              </p>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-muted-foreground">
                  Số điện thoại
                </p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-base font-medium">
                    {order.sellerPhone || "Chưa cập nhật"}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-muted-foreground">
                  Địa chỉ lấy hàng
                </p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="text-base font-medium">
                    {order.sellerAddress || "Chưa cập nhật"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-3 rounded-2xl bg-muted/30 p-5 border border-border/50">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Địa chỉ giao hàng
              </p>
            </div>
            <p className="text-base font-medium leading-relaxed">{order.shippingAddress}</p>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Sản phẩm:</p>
            <div className="grid gap-3">
              {order.items.map((item: OrderItem) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/20 p-4 transition-colors hover:bg-muted/30"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm truncate">{item.productName}</p>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      ID: {item.productId.slice(0, 8)}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-black text-primary text-sm">
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
            <div className="flex items-center justify-between border-t pt-3">
              <p className="text-sm font-bold uppercase tracking-tight">Tổng cộng:</p>
              <p className="text-xl font-black text-primary">
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
                <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Lấy hàng
                    </p>
                    <p className="text-sm font-bold truncate">
                      {new Date(order.pickupAt).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
              )}
              {order.deliveryAt && (
                <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-primary/5 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Giao hàng
                    </p>
                    <p className="text-sm font-bold truncate">
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
                      alt="Ảnh minh chứng 1"
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
                      alt="Ảnh minh chứng 2"
                      className="aspect-square w-full object-cover"
                    />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Confirm actions: upload evidence + confirm pickup/delivery */}
          {!(order.shipperPod1Url && order.shipperPod2Url) && (
            <div className="space-y-3 border-t pt-4">
              <p className="font-semibold">Xác nhận</p>
              <div className="space-y-3">
                <div className="flex flex-col gap-3 p-4 rounded-xl border-2 border-dashed border-muted bg-muted/20">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                      Hình ảnh chứng minh <span className="text-destructive">*</span>
                    </label>
                    {file && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 text-[10px] font-bold">
                        Đã chọn ảnh
                      </Badge>
                    )}
                  </div>
                  
                  <div className="relative group">
                    <input
                      key={file ? "has-file" : "no-file"}
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required
                    />
                    <div className={cn(
                      "flex flex-col items-center justify-center py-6 px-4 rounded-lg border-2 border-dashed transition-all duration-300",
                      file ? "border-green-500/50 bg-green-500/5" : "border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5"
                    )}>
                      <CheckCircle className={cn("h-8 w-8 mb-2 transition-colors", file ? "text-green-500" : "text-muted-foreground/40")} />
                      <p className="text-sm font-bold text-center">
                        {file ? file.name : "Nhấn để chọn hoặc kéo thả ảnh vào đây"}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">PNG, JPG tối đa 10MB</p>
                    </div>
                  </div>

                  {!file && (
                    <div className="flex items-center gap-2 text-destructive animate-pulse">
                      <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
                      <p className="text-[10px] font-black uppercase tracking-tight">
                        Bắt buộc phải có ảnh để xác nhận
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  {/* Show pickup button only if status is pending (2) */}
                  {order.status === 2 && (
                    <Button
                      disabled={!file || confirmPickupMutation.isPending}
                      onClick={() => {
                        if (!file) return;
                        confirmPickupMutation.mutate(
                          { orderId: order.orderId, file },
                          { onSuccess: () => setFile(null) }
                        );
                      }}
                      className="flex-1 h-12 rounded-xl font-black uppercase tracking-wider text-xs shadow-lg shadow-primary/20"
                    >
                      {confirmPickupMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Xác nhận đã lấy hàng"
                      )}
                    </Button>
                  )}
                  {/* Show delivery button only if already picked up (status !== 2) */}
                  {order.status !== 2 && (
                    <Button
                      disabled={!file || confirmDeliveryMutation.isPending}
                      onClick={() => {
                        if (!file) return;
                        confirmDeliveryMutation.mutate(
                          { orderId: order.orderId, file },
                          { onSuccess: () => setFile(null) }
                        );
                      }}
                      className="flex-1 h-12 rounded-xl font-black uppercase tracking-wider text-xs shadow-lg shadow-primary/20"
                    >
                      {confirmDeliveryMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Xác nhận đã giao hàng"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
