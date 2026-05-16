import { useSearchParams } from "react-router-dom";
import {
  useMyOrders,
  useConfirmReceipt,
  useCancelOrder,
} from "../hooks/useOrders";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { EmptyState } from "@/shared/components/common/EmptyState";
import type { GroupedOrder } from "../types";
import { OrderTable } from "../components/OrderTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useSellerOrders } from "@/features/sellerOrders/hooks/useSellerOrders";
import { SellerOrderTable } from "@/features/sellerOrders/components/SellerOrderTable";
import { ShoppingBag, Store } from "lucide-react";

export default function MyOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") === "selling" ? "selling" : "buying";
  
  const { data: buyOrders = [], isLoading: isBuyLoading } = useMyOrders();
  const { orders: sellOrders = [], isLoading: isSellLoading } = useSellerOrders();
  const confirmReceipt = useConfirmReceipt();
  const cancelOrder = useCancelOrder();

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <header className="mb-10 space-y-4">
        <h1 className="text-4xl font-black tracking-tight">Quản lý đơn hàng</h1>
        <p className="text-muted-foreground font-medium">
          Theo dõi trạng thái và lịch sử giao dịch của bạn.
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="buying" className="gap-2">
            <ShoppingBag className="w-4 h-4" />
            Đơn mua
          </TabsTrigger>
          <TabsTrigger value="selling" className="gap-2">
            <Store className="w-4 h-4" />
            Đơn bán
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buying">
          {isBuyLoading ? (
            <LoadingSpinner className="py-16" size="lg" />
          ) : !buyOrders.length ? (
            <EmptyState
              title="Bạn chưa có đơn mua hàng"
              description="Hãy bắt đầu mua sắm để theo dõi đơn hàng tại đây."
            />
          ) : (
            <div className="space-y-4">
              <OrderTable
                orders={buyOrders as GroupedOrder[]}
                onConfirmReceipt={confirmReceipt.mutate}
                onCancel={(orderId, reason) =>
                  cancelOrder.mutate({ id: orderId, data: { reason } })
                }
                isProcessing={confirmReceipt.isPending || cancelOrder.isPending}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="selling">
          {isSellLoading ? (
            <LoadingSpinner className="py-16" size="lg" />
          ) : (
            <SellerOrderTable 
              orders={sellOrders} 
              isLoading={isSellLoading} 
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
