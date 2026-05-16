import { useParams, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  useMyOrders,
  useConfirmReceipt,
  useCancelOrder,
  useOrderProductDetail,
} from "../hooks/useOrders";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { Play, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getOrderStatusLabel, getPaymentStatusLabel } from "../types";

export default function OrderDetailPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");

  const { data: allOrders = [], isLoading: isListLoading } = useMyOrders();
  const order = allOrders.find((o) => o.id === orderId);

  const { data: productDetail, isLoading: isProductLoading } = useOrderProductDetail(
    orderId ?? "",
    productId ?? "",
  );

  const confirm = useConfirmReceipt();
  const cancel = useCancelOrder();

  const isLoading = isListLoading || isProductLoading;

  if (isLoading) return <LoadingSpinner className="py-16" size="lg" />;

  if (!order && !productDetail && !isListLoading && !isProductLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-xl font-semibold">Không tìm thấy thông tin</h2>
        <p className="text-muted-foreground">Đơn hàng hoặc sản phẩm không tồn tại.</p>
      </div>
    );
  }

  const priceFormatter = new Intl.NumberFormat("vi-VN");

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-12">
      {/* Unified Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full border bg-background shadow-sm hover:bg-muted"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mã tham chiếu</span>
              <span className="font-mono text-xs font-bold text-primary">
                #{order?.code ?? orderId?.slice(0, 8)}
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">Chi tiết đơn hàng</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {order && (
            <Badge 
              variant="secondary" 
              className="h-9 rounded-full px-4 text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              {getOrderStatusLabel(order.status)}
            </Badge>
          )}
          {order?.status === 4 && (
            <Button
              className="h-9 rounded-full px-6 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              onClick={() => confirm.mutate(order.id)}
              disabled={confirm.isPending}
            >
              Đã nhận được hàng
            </Button>
          )}
          {order && order.status !== 4 && order.status !== 5 && order.status !== 6 && order.status !== 3 && (
            <Button
              variant="destructive"
              className="h-9 rounded-full px-6 font-bold shadow-lg shadow-destructive/20 transition-all hover:scale-105 active:scale-95"
              onClick={() => cancel.mutate({ id: order.id })}
              disabled={cancel.isPending}
            >
              Huỷ đơn
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Section: Product Media & Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden rounded-3xl border bg-card shadow-sm">
            <div className="flex flex-col lg:flex-row">
              {/* Media Column */}
              <div className="w-full lg:w-1/2 bg-muted/5 p-6 border-b lg:border-b-0 lg:border-r">
                {(() => {
                  const images = (productDetail?.imageUrls || productDetail?.imageUrl || []).filter((url: any) => url && typeof url === "string");
                  const videos = (productDetail?.videoUrls || productDetail?.video || []).filter((url: any) => url && typeof url === "string");
                  const allMedia = [
                    ...images.map((url: string) => ({ type: "image", url })),
                    ...videos.map((url: string) => ({ type: "video", url })),
                  ];

                  if (allMedia.length === 0) {
                    return (
                      <div className="flex aspect-square items-center justify-center rounded-2xl border-2 border-dashed bg-muted/20">
                        <p className="text-xs font-medium text-muted-foreground">Không có hình ảnh</p>
                      </div>
                    );
                  }

                  return (
                    <div className={cn(
                      "grid gap-3",
                      allMedia.length === 1 ? "grid-cols-1" : "grid-cols-2"
                    )}>
                      {allMedia.map((item, idx) => (
                        <div 
                          key={idx} 
                          className={cn(
                            "group relative aspect-square overflow-hidden rounded-2xl border bg-background shadow-sm",
                            allMedia.length === 3 && idx === 0 ? "row-span-2 h-full" : ""
                          )}
                        >
                          {item.type === "image" ? (
                            <img
                              src={item.url}
                              alt="Product"
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="relative h-full w-full bg-black">
                              <video src={item.url} className="h-full w-full object-contain" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                                  <Play className="h-6 w-6 text-white fill-white" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Product Details Column */}
              <div className="flex-1 p-8 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/5 px-4 py-1 text-[10px] font-black uppercase tracking-tighter text-primary">
                      {productDetail?.condition || order?.items?.[0]?.condition || "Good"}
                    </Badge>
                  </div>
                  <h2 className="text-3xl font-black leading-tight tracking-tight text-foreground">
                    {productDetail?.title || order?.items?.[0]?.productName || "Sản phẩm"}
                  </h2>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-primary">
                      {priceFormatter.format(Number(productDetail?.price || order?.items?.[0]?.unitPrice || 0))}
                    </span>
                    <span className="text-lg font-bold text-primary">₫</span>
                  </div>
                </div>

                <Separator className="opacity-50" />

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/80">Mô tả chi tiết</h3>
                  <p className="text-[15px] leading-relaxed text-muted-foreground/90 whitespace-pre-line">
                    {productDetail?.description || "Thông tin mô tả đang được cập nhật..."}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Section*/}
        <div className="space-y-6">
          <Card className="overflow-hidden rounded-3xl border bg-card shadow-sm">
            <CardHeader className="border-b bg-muted/20 px-6 py-4">
              <CardTitle className="text-sm font-black uppercase tracking-widest">Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Khách hàng</span>
                  <span className="text-sm font-black">{order?.recipientName || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Người bán</span>
                  <span className="text-sm font-black text-primary">{order?.sellerName || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-tight">Thanh toán</span>
                  <Badge variant="outline" className="rounded-md font-bold text-[10px] uppercase">
                    {getPaymentStatusLabel(order?.paymentStatus)}
                  </Badge>
                </div>
              </div>

              <Separator className="opacity-50" />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">Tạm tính</span>
                  <span className="text-sm font-bold">{priceFormatter.format(Number(order?.totalAmount || 0))} ₫</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-black uppercase tracking-wider text-foreground">Tổng cộng</span>
                  <span className="text-xl font-black text-primary">{priceFormatter.format(Number(order?.totalAmount || 0))} ₫</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info / Shipping */}
          <Card className="overflow-hidden rounded-3xl border bg-card shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Play className="h-4 w-4 text-primary rotate-90" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-widest">Giao hàng</h4>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    Sản phẩm sẽ được giao đến bạn trong thời gian sớm nhất bởi đội ngũ vận chuyển chuyên nghiệp.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
