import { useOrderProductDetail } from "@/features/orders/hooks/useOrders";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import type { DisputeItem } from "../types";

interface DisputeRowItemProps {
  dispute: DisputeItem;
  productId?: string;
  onCancel?: (disputeId: string) => void;
  isProcessing?: boolean;
}

export function DisputeRowItem({
  dispute,
  productId,
  onCancel,
  isProcessing,
}: DisputeRowItemProps) {
  // Call API /api/orders/{orderId}/products/{productId} to fetch disputed product info
  const { data: productDetail, isLoading } = useOrderProductDetail(
    dispute.orderId,
    productId || ""
  );

  const formattedDate = dispute.createdAt
    ? new Date(dispute.createdAt).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  const getDisputeStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return (
          <Badge variant="outline" className="border-amber-500 bg-amber-500/10 text-amber-500 font-bold text-xs">
            Đã mở
          </Badge>
        );
      case 1:
        return (
          <Badge variant="outline" className="border-blue-500 bg-blue-500/10 text-blue-500 font-bold text-xs">
            Đang xử lý
          </Badge>
        );
      case 2:
        return (
          <Badge variant="outline" className="border-green-500 bg-green-500/10 text-green-500 font-bold text-xs">
            Đã xử lý
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-red-500 bg-red-500/10 text-red-500 font-bold text-xs">
            Đã hủy
          </Badge>
        );
    }
  };

  const getDisputeResolutionBadge = (res: number) => {
    switch (res) {
      case 1:
        return <Badge className="bg-green-600 font-bold text-white text-[10px]">Hoàn tiền</Badge>;
      case 2:
        return <Badge className="bg-blue-600 font-bold text-white text-[10px]">Tất toán</Badge>;
      case 3:
        return <Badge className="bg-amber-600 font-bold text-white text-[10px]">Hoàn một phần</Badge>;
      default:
        return <span className="text-xs text-muted-foreground">—</span>;
    }
  };

  const priceFormatter = new Intl.NumberFormat("vi-VN");

  return (
    <TableRow className="hover:bg-muted/10">
      <TableCell className="font-semibold text-xs text-muted-foreground">
        {dispute.disputeId.substring(0, 8).toUpperCase()}
      </TableCell>
      <TableCell>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            <span className="text-xs text-muted-foreground">Đang tải sản phẩm...</span>
          </div>
        ) : productDetail ? (
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-muted/20">
              {productDetail.imageUrls?.[0] || productDetail.imageUrl ? (
                <img
                  src={productDetail.imageUrls?.[0] || productDetail.imageUrl}
                  alt={productDetail.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                  No Image
                </div>
              )}
            </div>
            <div className="space-y-0.5 max-w-[200px]">
              <div className="truncate text-sm font-bold text-foreground">
                {productDetail.title}
              </div>
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 uppercase font-medium">
                  {productDetail.condition || "Good"}
                </Badge>
                <span className="text-xs text-primary font-bold">
                  {priceFormatter.format(productDetail.price)} ₫
                </span>
              </div>
            </div>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Không tìm thấy sản phẩm</span>
        )}
      </TableCell>
      <TableCell className="max-w-[250px] truncate text-sm font-medium" title={dispute.reason}>
        {dispute.reason}
      </TableCell>
      <TableCell className="text-xs font-semibold text-muted-foreground">
        {formattedDate}
      </TableCell>
      <TableCell>
        {getDisputeStatusBadge(dispute.status)}
      </TableCell>
      <TableCell>
        {getDisputeResolutionBadge(dispute.resolution)}
      </TableCell>
      <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground italic" title={dispute.adminNote || ""}>
        {dispute.adminNote || <span className="not-italic text-muted-foreground/30">—</span>}
      </TableCell>
      <TableCell className="text-right">
        {dispute.status === 0 || dispute.status === 1 ? (
          <Button
            size="sm"
            variant="outline"
            className="text-xs font-bold text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200 h-8 px-2.5 transition-all"
            onClick={() => {
              if (confirm("Bạn có chắc chắn muốn hủy khiếu nại này không?")) {
                onCancel?.(dispute.disputeId);
              }
            }}
            disabled={isProcessing}
          >
            Hủy khiếu nại
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground font-semibold">—</span>
        )}
      </TableCell>
    </TableRow>
  );
}
