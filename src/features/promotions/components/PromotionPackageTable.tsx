import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Package, Calendar, Trash2, Clock } from "lucide-react";
import { ConfirmationModal } from "@/shared/components/common/ConfirmationModal";
import type { PromotionPackage } from "../types";

const priceFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

interface PromotionPackageTableProps {
  packages: PromotionPackage[];
  onDelete: (packageId: string) => void;
  isDeleting?: boolean;
}

export function PromotionPackageTable({ 
  packages, 
  onDelete,
  isDeleting 
}: PromotionPackageTableProps) {
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    if (packageToDelete) {
      onDelete(packageToDelete);
      setPackageToDelete(null);
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Thông tin gói</TableHead>
            <TableHead className="text-center">Giá trị</TableHead>
            <TableHead className="text-center">Cấu hình</TableHead>
            <TableHead className="text-center">Thời gian</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {packages.map((pkg) => (
            <TableRow key={pkg.packageId}>
              <TableCell className="py-4 font-medium">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <Package className="size-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{pkg.packageName}</span>
                    <span className="text-[10px] text-muted-foreground line-clamp-1 max-w-[200px]">{pkg.description}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center py-4">
                <Badge 
                    variant="secondary" 
                    className={pkg.price === 0 ? "bg-emerald-500/10 text-emerald-600 border-none" : "bg-primary/5 text-primary border-none"}
                >
                  {pkg.price === 0 ? "MIỄN PHÍ" : priceFormatter.format(pkg.price)}
                </Badge>
              </TableCell>
              <TableCell className="text-center py-4">
                <div className="inline-flex flex-col gap-1 text-[11px] font-medium">
                  <div className="flex items-center justify-center gap-1.5">
                    <Package className="size-3 text-blue-500" />
                    <span>{pkg.maxProductCount} sản phẩm</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                    <Clock className="size-3 text-amber-500" />
                    <span>{pkg.promotionDaysPerSlot} ngày/lượt</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center py-4">
                <div className="inline-flex flex-col text-[11px] font-medium">
                    <div className="flex items-center justify-center gap-1.5 text-emerald-600">
                        <Calendar className="size-3" />
                        <span>Hạn dùng {pkg.usageLimitDays} ngày</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">Đến: {new Date(pkg.availableTo).toLocaleDateString("vi-VN")}</span>
                </div>
              </TableCell>
              <TableCell className="text-right py-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  onClick={() => setPackageToDelete(pkg.packageId)}
                  disabled={isDeleting && packageToDelete === pkg.packageId}
                >
                  <Trash2 className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmationModal
        isOpen={!!packageToDelete}
        onCancel={() => setPackageToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa gói ưu đãi"
        description="Bạn có chắc chắn muốn xóa gói ưu đãi này không? Hành động này không thể hoàn tác."
        confirmLabel="Xóa vĩnh viễn"
        cancelLabel="Hủy bỏ"
        variant="destructive"
        isPending={isDeleting}
      />
    </div>
  );
}
