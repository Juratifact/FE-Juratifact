import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/common/EmptyState";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { useMyCart, useRemoveCartItem } from "../hooks/useCart";
import { useCreateOrder } from "@/features/orders/hooks/useOrders";
import { CheckoutDialog } from "@/features/orders/components/CheckoutDialog";
import type { CartItem } from "../types";

export default function CartPage() {
  const navigate = useNavigate();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { data: cart, isLoading, error } = useMyCart();
  const removeCartItemMutation = useRemoveCartItem();
  const createOrderMutation = useCreateOrder();

  // Selection state
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  const items = cart?.items ?? [];
  
  // Calculate total and count based on selection
  const selectedItems = items.filter((item) => selectedItemIds.includes(item.productId));
  const selectedTotal = selectedItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const isAllSelected = items.length > 0 && selectedItemIds.length === items.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(items.map((item) => item.productId));
    }
  };

  const toggleSelectItem = (productId: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCheckoutSubmit = (address: string, refId: string) => {
    if (selectedItems.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }

    const cartDetailIds = selectedItems.map((item: CartItem) => item.cartDetailId);

    createOrderMutation.mutate(
      {
        shippingAddress: address,
        vietMapRefId: refId,
        cartDetailIds,
      },
      {
        onSuccess: (paymentInfo) => {
          setIsCheckoutOpen(false);
          // Navigate to payment confirmation with QR code
          navigate("/payment-confirmation", { state: { paymentInfo } });
        },
      },
    );
  };

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
            {/* Select All Section */}
            <div className="flex items-center gap-3 px-4 py-3 bg-muted/30 rounded-xl border border-transparent hover:border-primary/10 transition-colors">
              <div 
                className={cn(
                  "h-5 w-5 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all duration-200",
                  isAllSelected 
                    ? "border-primary bg-primary" 
                    : "border-muted-foreground/30 bg-transparent"
                )}
                onClick={toggleSelectAll}
              >
                {isAllSelected && (
                  <div className="h-1.5 w-1.5 rounded-full bg-background animate-in zoom-in duration-200" />
                )}
              </div>
              <span className="text-sm font-bold tracking-tight">Chọn tất cả ({items.length} sản phẩm)</span>
              
              {selectedItemIds.length > 0 && (
                <span className="ml-auto text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Đã chọn {selectedItemIds.length}
                </span>
              )}
            </div>

            {items.map((item: CartItem) => (
              <Card
                key={item.productId}
                className={cn(
                    "overflow-hidden rounded-2xl transition-all duration-300 border-2",
                    selectedItemIds.includes(item.productId) 
                        ? "border-primary/30 bg-primary/[0.02] shadow-sm" 
                        : "border-transparent bg-background"
                )}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div 
                    className={cn(
                      "h-5 w-5 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all duration-200 shrink-0",
                      selectedItemIds.includes(item.productId) 
                        ? "border-primary bg-primary" 
                        : "border-muted-foreground/30 bg-transparent"
                    )}
                    onClick={() => toggleSelectItem(item.productId)}
                  >
                    {selectedItemIds.includes(item.productId) && (
                      <div className="h-1.5 w-1.5 rounded-full bg-background animate-in zoom-in duration-200" />
                    )}
                  </div>

                  <div className="shrink-0">
                    <img
                      src={item.productImageUrls?.[0] || "/placeholder-image.png"}
                      alt={item.productTitle || "Sản phẩm"}
                      className="h-24 w-24 rounded-xl object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="line-clamp-1 font-semibold">
                          {item.productTitle}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">Người bán:</span>
                            {item.sellerName}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">Tình trạng:</span>
                            {item.condition}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">Số lượng:</span>
                            {item.quantity}
                          </div>
                        </div>
                      </div>
                      <p className="font-bold text-primary">
                        {(item.price ?? 0).toLocaleString("vi-VN")} đ
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto h-8 rounded-full border border-destructive/20 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() =>
                          removeCartItemMutation.mutate(item.productId)
                        }
                        disabled={removeCartItemMutation.isPending}
                      >
                        <Trash2 className="mr-1.5 h-4 w-4" />
                        Xóa
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="h-fit rounded-2xl shadow-lg border-primary/10 sticky top-24">
            <CardHeader>
              <CardTitle>Tổng đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Sản phẩm đã chọn</span>
                <span className="font-medium">{selectedItemIds.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Tổng tiền tạm tính</span>
                <span className="font-semibold text-primary text-lg">
                  {selectedTotal.toLocaleString("vi-VN")} đ
                </span>
              </div>

              <div className="pt-2">
                <Button
                    className="w-full rounded-full py-6 text-base font-bold shadow-xl shadow-primary/20"
                    size="lg"
                    onClick={() => setIsCheckoutOpen(true)}
                    disabled={createOrderMutation.isPending || selectedItemIds.length === 0}
                >
                    {createOrderMutation.isPending ? "Đang xử lý..." : "Thanh toán ngay"}
                </Button>
                {selectedItemIds.length === 0 && (
                    <p className="text-[10px] text-center mt-2 text-muted-foreground">
                        Vui lòng chọn sản phẩm để thanh toán
                    </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <CheckoutDialog
        isOpen={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        onSubmit={handleCheckoutSubmit}
        isLoading={createOrderMutation.isPending}
      />
    </div>
  );
}
