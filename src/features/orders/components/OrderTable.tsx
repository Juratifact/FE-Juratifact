import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, X, Eye, MapPin, AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { getOrderStatusLabel, getPaymentStatusLabel } from "../types";
import type { GroupedOrder } from "../types";
import { UpdateAddressDialog } from "./UpdateAddressDialog";
import { CancelOrderDialog } from "./CancelOrderDialog";
import { DisputeOrderDialog } from "../../disputes/components/DisputeOrderDialog";
import { ConfirmReceiptDialog } from "./ConfirmReceiptDialog";

interface OrderTableProps {
  orders: GroupedOrder[];
  onConfirmReceipt?: (id: string) => void;
  onCancel?: (id: string, reason: string) => void;
  onChangeAddress?: (id: string, newAddress: string, vietMapRefId: string) => void;
  onDispute?: (orderId: string, sellerOrderId: string, reason: string) => void;
  isProcessing?: boolean;
}

export function OrderTable({
  orders,
  onConfirmReceipt,
  onCancel,
  onChangeAddress,
  onDispute,
  isProcessing,
}: OrderTableProps) {
  const [editingAddressOrderId, setEditingAddressOrderId] = useState<string | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [disputingOrder, setDisputingOrder] = useState<{
    orderId: string;
    sellerOrderId: string;
  } | null>(null);
  const [confirmingReceiptOrderId, setConfirmingReceiptOrderId] = useState<string | null>(null);

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã đơn</TableHead>
            <TableHead>Khách hàng</TableHead>
            <TableHead>Người bán</TableHead>
            <TableHead>Số lượng</TableHead>
            <TableHead>Tổng tiền</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Thanh toán</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((o) => (
            <TableRow key={o.id}>
              <TableCell className="font-medium font-mono text-xs">
                {o.code ?? o.id.slice(0, 8)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {o.recipientName ?? "—"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {o.sellerName ?? "—"}
              </TableCell>
              <TableCell>
                {o.items?.reduce((s, it) => s + it.quantity, 0)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {Number(o.totalAmount).toLocaleString("vi-VN")} ₫
              </TableCell>
              <TableCell className="text-muted-foreground">
                {getOrderStatusLabel(o.status)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {getPaymentStatusLabel(o.paymentStatus)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      to={`/orders/${o.id}?productId=${o.items?.[0]?.productId}`}
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Chi tiết
                    </Link>
                  </Button>
                  {o.status === 4 && onDispute && (
                    <Button
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white border-none transition-all shadow-sm"
                      onClick={() =>
                        setDisputingOrder({
                          orderId: o.id,
                          sellerOrderId: o.sellerOrderId ?? o.id,
                        })
                      }
                      disabled={isProcessing}
                    >
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Khiếu nại
                    </Button>
                  )}
                  {((o.canConfirmReceipt !== undefined ? o.canConfirmReceipt : o.status === 4)) && onConfirmReceipt && (
                    <Button
                      size="sm"
                      onClick={() => setConfirmingReceiptOrderId(o.sellerOrderId ?? o.id)}
                      disabled={isProcessing}
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Đã nhận
                    </Button>
                  )}
                  {o.status === 1 && o.paymentStatus === 1 && onCancel && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setCancellingOrderId(o.id)}
                      disabled={isProcessing}
                    >
                      <X className="mr-1 h-3 w-3" />
                      Huỷ đơn
                    </Button>
                  )}
                  {o.status === 1 && onChangeAddress && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setEditingAddressOrderId(o.id)}
                      disabled={isProcessing}
                    >
                      <MapPin className="mr-1 h-3 w-3" />
                      Đổi địa chỉ
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <UpdateAddressDialog
        open={!!editingAddressOrderId}
        onOpenChange={(open) => !open && setEditingAddressOrderId(null)}
        onConfirm={(address, refId) => {
          if (editingAddressOrderId) {
            onChangeAddress?.(editingAddressOrderId, address, refId);
            setEditingAddressOrderId(null);
          }
        }}
        isProcessing={isProcessing}
      />
      <CancelOrderDialog
        open={!!cancellingOrderId}
        onOpenChange={(open) => !open && setCancellingOrderId(null)}
        onConfirm={(reason) => {
          if (cancellingOrderId) {
            onCancel?.(cancellingOrderId, reason);
            setCancellingOrderId(null);
          }
        }}
        isProcessing={isProcessing}
      />
      <DisputeOrderDialog
        open={!!disputingOrder}
        onOpenChange={(open) => !open && setDisputingOrder(null)}
        onConfirm={(reason) => {
          if (disputingOrder) {
            onDispute?.(disputingOrder.orderId, disputingOrder.sellerOrderId, reason);
            setDisputingOrder(null);
          }
        }}
        isProcessing={isProcessing}
      />
      <ConfirmReceiptDialog
        open={!!confirmingReceiptOrderId}
        onOpenChange={(open) => !open && setConfirmingReceiptOrderId(null)}
        onConfirm={() => {
          if (confirmingReceiptOrderId) {
            onConfirmReceipt?.(confirmingReceiptOrderId);
            setConfirmingReceiptOrderId(null);
          }
        }}
        isProcessing={isProcessing}
      />
    </div>
  );
}
