import { useSearchParams } from "react-router-dom";
import {
  useMyOrders,
  useConfirmReceipt,
  useCancelOrder,
  useUpdateShippingAddress,
} from "../hooks/useOrders";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { EmptyState } from "@/shared/components/common/EmptyState";
import type { GroupedOrder } from "../types";
import { OrderTable } from "../components/OrderTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useSellerOrders } from "@/features/sellerOrders/hooks/useSellerOrders";
import { SellerOrderTable } from "@/features/sellerOrders/components/SellerOrderTable";
import { ShoppingBag, Store, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import { useCreateDispute, useMyDisputes, useCancelDispute } from "@/features/disputes/hooks/useDisputes";
import { DisputeTable } from "@/features/disputes/components/DisputeTable";
import { Pagination } from "@/shared/components/common/Pagination";

export default function MyOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab = tabParam === "selling" ? "selling" : tabParam === "disputes" ? "disputes" : "buying";
  
  const disputePage = Number(searchParams.get("disputePage")) || 1;
  
  const roles = useAuthStore((s) => s.roles);
  const isSeller = roles.includes("Seller");

  const { data: buyOrders = [], isLoading: isBuyLoading } = useMyOrders();
  const { data: disputesData, isLoading: isDisputesLoading } = useMyDisputes({
    pageIndex: disputePage,
    pageSize: 10,
  });
  const disputes = disputesData?.items || [];

  const totalItems = disputesData?.totalItems || 0;
  const itemsPerPage = disputesData?.pageSize || 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const disputesPaginationMeta = {
    totalItems,
    totalPages,
    itemsPerPage,
    currentPage: disputePage,
    hasPreviousPage: disputePage > 1,
    hasNextPage: disputePage < totalPages,
  };

  const handleDisputePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("disputePage", String(page));
    setSearchParams(newParams);
  };
  const { orders: sellOrders = [], isLoading: isSellLoading } = useSellerOrders({
    enabled: isSeller,
  });
  const confirmReceipt = useConfirmReceipt();
  const cancelOrder = useCancelOrder();
  const updateOrder = useUpdateShippingAddress();
  const disputeOrder = useCreateDispute();
  const cancelDispute = useCancelDispute();

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
          {isSeller && (
            <TabsTrigger value="selling" className="gap-2">
              <Store className="w-4 h-4" />
              Đơn bán
            </TabsTrigger>
          )}
          <TabsTrigger value="disputes" className="gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            Khiếu nại
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
                onChangeAddress={(orderId, newAddress, vietMapRefId) =>
                  updateOrder.mutate({ id: orderId, data: { newAddress, vietMapRefId } })
                }
                onDispute={(orderId, sellerOrderId, reason) =>
                  disputeOrder.mutate({
                    orderId,
                    data: { sellerOrderId, reason },
                  })
                }
                isProcessing={
                  confirmReceipt.isPending ||
                  cancelOrder.isPending ||
                  updateOrder.isPending ||
                  disputeOrder.isPending
                }
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

        <TabsContent value="disputes">
          {isDisputesLoading ? (
            <LoadingSpinner className="py-16" size="lg" />
          ) : !disputes.length ? (
            <EmptyState
              title="Bạn chưa có khiếu nại nào"
              description="Các khiếu nại đơn hàng của bạn sẽ được hiển thị và theo dõi tại đây."
            />
          ) : (
            <div className="space-y-6">
              <DisputeTable
                disputes={disputes}
                buyOrders={buyOrders as GroupedOrder[]}
                onCancelDispute={cancelDispute.mutate}
                isProcessing={cancelDispute.isPending}
              />
              <Pagination
                meta={disputesPaginationMeta}
                onPageChange={handleDisputePageChange}
                className="mt-6"
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
