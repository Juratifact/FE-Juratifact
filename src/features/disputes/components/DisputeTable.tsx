import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { DisputeRowItem } from "./DisputeRowItem";
import type { DisputeItem } from "../types";
import type { GroupedOrder } from "@/features/orders/types";

interface DisputeTableProps {
  disputes: DisputeItem[];
  buyOrders: GroupedOrder[];
  onCancelDispute?: (disputeId: string) => void;
  isProcessing?: boolean;
}

export function DisputeTable({
  disputes,
  buyOrders,
  onCancelDispute,
  isProcessing,
}: DisputeTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] font-black uppercase tracking-wider text-[11px]">ID</TableHead>
            <TableHead className="w-[300px] font-black uppercase tracking-wider text-[11px]">Sản phẩm khiếu nại</TableHead>
            <TableHead className="w-[250px] font-black uppercase tracking-wider text-[11px]">Lý do khiếu nại</TableHead>
            <TableHead className="w-[150px] font-black uppercase tracking-wider text-[11px]">Ngày gửi</TableHead>
            <TableHead className="w-[120px] font-black uppercase tracking-wider text-[11px]">Trạng thái</TableHead>
            <TableHead className="w-[120px] font-black uppercase tracking-wider text-[11px]">Giải quyết</TableHead>
            <TableHead className="w-[200px] font-black uppercase tracking-wider text-[11px]">Ghi chú Admin</TableHead>
            <TableHead className="w-[120px] font-black uppercase tracking-wider text-[11px] text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {disputes.map((dispute) => {
            // Match dispute against buyOrders to find the relevant productId
            const matchingOrder = buyOrders.find(
              (o) => o.sellerOrderId === dispute.sellerOrderId || o.id === dispute.orderId
            );
            const productId = matchingOrder?.items?.[0]?.productId;

            return (
              <DisputeRowItem
                key={dispute.disputeId}
                dispute={dispute}
                productId={productId}
                onCancel={onCancelDispute}
                isProcessing={isProcessing}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
