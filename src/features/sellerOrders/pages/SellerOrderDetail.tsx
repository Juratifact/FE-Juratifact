import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, User, MapPin, CreditCard, Calendar, Truck} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { useSellerOrderDetail } from "../hooks/useSellerOrders";
import { getOrderStatusLabel, getPaymentStatusLabel } from "@/features/orders/types";

export default function SellerOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading } = useSellerOrderDetail(id!);

  if (isLoading) return <LoadingSpinner className="py-20" size="lg" />;
  if (!order) return <div className="p-10 text-center">Không tìm thấy đơn hàng.</div>;

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-2 -ml-2 text-muted-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            Chi tiết đơn hàng
            <Badge variant="outline" className="font-mono text-sm uppercase">
              {order.code}
            </Badge>
          </h1>
          <p className="text-muted-foreground font-medium">
            Ngày tạo: {new Date(order.createdAt).toLocaleString("vi-VN")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="px-4 py-1 text-sm font-bold bg-secondary text-secondary-foreground">
            {getOrderStatusLabel(order.status)}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Products List */}
          <Card className="border-none shadow-xl bg-background/50 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center gap-3">
              <Package className="w-5 h-5 text-primary" />
              <CardTitle>Sản phẩm trong đơn</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4 p-6">
                    <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center">
                      <Package className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg truncate">{item.productTitle}</h4>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                        <span>{item.condition}</span>
                        <span>•</span>
                        <span>Số lượng: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-lg">
                        {item.unitPrice.toLocaleString("vi-VN")} ₫
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card className="border-none shadow-xl bg-background/50 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center gap-3">
              <Truck className="w-5 h-5 text-primary" />
              <CardTitle>Thông tin vận chuyển</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground">
                    <User className="w-4 h-4" />
                    Người nhận
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-lg">{order.buyerName}</p>
                    <p className="font-medium">{order.buyerPhone}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    Địa chỉ nhận hàng
                  </div>
                  <p className="font-medium leading-relaxed">
                    {order.shippingAddress}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary & Customer */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <Card className="border-none shadow-2xl bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-xl">Tổng kết thanh toán</CardTitle>
              <CardDescription className="text-primary-foreground/70">
                Chi tiết các khoản thu chi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm font-medium">
                <span className="opacity-80">Tổng tiền sản phẩm</span>
                <span>{order.subtotalPrice.toLocaleString("vi-VN")} ₫</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="opacity-80">Phí vận chuyển</span>
                <span>{order.shippingFee.toLocaleString("vi-VN")} ₫</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span className="opacity-80">Giảm giá</span>
                <span>-{order.discountAmount.toLocaleString("vi-VN")} ₫</span>
              </div>
              <Separator className="bg-primary-foreground/20" />
              <div className="flex justify-between items-center py-2">
                <span className="font-bold">Tổng cộng khách trả</span>
                <span className="text-2xl font-black">
                  {order.totalPrice.toLocaleString("vi-VN")} ₫
                </span>
              </div>
              
              <div className="pt-4 border-t border-primary-foreground/20 space-y-4">
                <div className="flex justify-between text-sm font-bold">
                  <span className="opacity-90">Phí nền tảng (5%)</span>
                  <span>-{order.platformFee.toLocaleString("vi-VN")} ₫</span>
                </div>
                
                <div className="relative overflow-hidden rounded-2xl bg-white/10 p-4 shadow-inner ring-1 ring-white/20">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-black uppercase tracking-tighter opacity-70">
                      Lợi nhuận thực nhận
                    </span>
                    <div className="flex items-baseline gap-1 text-3xl font-black">
                      {order.sellerReceivableAmount.toLocaleString("vi-VN")}
                      <span className="text-sm font-bold opacity-80 underline decoration-2 underline-offset-4">₫</span>
                    </div>
                  </div>
                  {/* Subtle background glow */}
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-400/20 rounded-full blur-3xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="border-none shadow-xl bg-background/50 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center gap-3">
              <CreditCard className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center font-medium">
                <span className="text-muted-foreground">Phương thức</span>
                <span className="font-bold">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center font-medium">
                <span className="text-muted-foreground">Trạng thái</span>
                <Badge variant="outline" className="font-bold border-primary/20 bg-primary/5 text-primary">
                  {getPaymentStatusLabel(order.paymentStatus)}
                </Badge>
              </div>
            </CardContent>
          </Card>

           {/* Timeline/History (Simplified) */}
           <Card className="border-none shadow-xl bg-background/50 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Lịch sử đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="relative flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div className="w-px h-full bg-border"></div>
                </div>
                <div className="pb-4">
                  <p className="text-sm font-bold">Đơn hàng được tạo</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="relative flex flex-col items-center">
                  <div className={`w-2 h-2 rounded-full ${order.updatedAt ? 'bg-primary' : 'bg-muted'} mt-2`}></div>
                </div>
                <div>
                  <p className="text-sm font-bold">Cập nhật cuối cùng</p>
                  <p className="text-xs text-muted-foreground">
                    {order.updatedAt ? new Date(order.updatedAt).toLocaleString("vi-VN") : "—"}
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
