import { Link } from "react-router-dom";
import { ShoppingBag, Trash2, ArrowLeft } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { useClearCart, useMyCart, useRemoveCartItem } from "../hooks/useCart";

export default function CartPage() {
  const { data: cart, isLoading, error } = useMyCart();
  const removeCartItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();

  const items = cart?.items ?? [];
  const total = cart?.total ?? 0;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 md:py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">
            Giỏ hàng
          </h1>
          <p className="mt-2 text-muted-foreground">
            Xem, chỉnh sửa và thanh toán các sản phẩm bạn đã chọn.
          </p>
        </div>

        <Button asChild variant="outline" className="rounded-full">
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tiếp tục mua sắm
          </Link>
        </Button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Không tải được giỏ hàng. Vui lòng thử lại.
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner className="py-20" size="lg" />
      ) : items.length === 0 ? (
        <EmptyState
          title="Giỏ hàng trống"
          description="Bạn chưa thêm sản phẩm nào vào giỏ."
        >
          <Button asChild className="rounded-full">
            <Link to="/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Đi đến sản phẩm
            </Link>
          </Button>
        </EmptyState>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            {items.map((item) => (
              <Card
                key={item.productId}
                className="overflow-hidden rounded-2xl"
              >
                <CardContent className="flex gap-4 p-4">
                  <Link to={`/products/${item.productId}`} className="shrink-0">
                    <img
                      src={item.imageUrls?.[0] || "/placeholder-image.png"}
                      alt={item.title || "Product"}
                      className="h-24 w-24 rounded-xl object-cover"
                    />
                  </Link>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          to={`/products/${item.productId}`}
                          className="line-clamp-1 font-semibold hover:text-primary"
                        >
                          {item.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          Số lượng: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-primary">
                        {(item.price ?? 0).toLocaleString("vi-VN")} đ
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-muted-foreground">
                        Thành tiền:{" "}
                        {(
                          Number(item.price ?? 0) * item.quantity
                        ).toLocaleString("vi-VN")}{" "}
                        đ
                      </p>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 rounded-full px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() =>
                          removeCartItemMutation.mutate(item.productId)
                        }
                        disabled={removeCartItemMutation.isPending}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="h-fit rounded-2xl">
            <CardHeader>
              <CardTitle>Tổng đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Số sản phẩm</span>
                <span className="font-medium">{items.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Tổng tiền</span>
                <span className="font-semibold text-primary">
                  {total.toLocaleString("vi-VN")} đ
                </span>
              </div>

              <Button className="w-full rounded-full" size="lg">
                Thanh toán
              </Button>

              <Button
                variant="outline"
                className="w-full rounded-full"
                onClick={() => clearCartMutation.mutate()}
                disabled={clearCartMutation.isPending}
              >
                Xóa toàn bộ giỏ hàng
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
