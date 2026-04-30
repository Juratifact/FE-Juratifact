import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Trash2 } from "lucide-react";
import type { Report } from "../types";
import { getStatusLabel, getStatusDisplay } from "../types";

interface ReportTableProps {
  reports: Report[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  isLoading?: boolean;
}

const statusVariant: Record<
  "pending" | "approved" | "rejected" | "dismissed",
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "outline",
  approved: "default",
  rejected: "destructive",
  dismissed: "destructive",
};

export function ReportTable({
  reports,
  onApprove,
  onReject,
  onDelete,
  isDeleting,
  isLoading,
}: ReportTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lý do báo cáo</TableHead>
            <TableHead>Sản phẩm</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => {
            const displayStatus = getStatusDisplay(report.status);
            const statusText = getStatusLabel(report.status);
            const createdDate = report.createdAt
              ? new Date(report.createdAt).toLocaleDateString("vi-VN")
              : "-";

            return (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.reason}</TableCell>
                <TableCell className="text-muted-foreground">
                  {report.reportedProduct?.title || "N/A"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground truncate max-w-xs">
                  {report.description || "-"}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[displayStatus]}>
                    {statusText}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {createdDate}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {report.status === 0 && onApprove && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onApprove(report.id)}
                        disabled={isLoading}
                        className="rounded-lg bg-green-600 hover:bg-green-700 text-white"
                      >
                        Approve
                      </Button>
                    )}
                    {report.status === 0 && onReject && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onReject(report.id)}
                        disabled={isLoading}
                        className="rounded-lg"
                      >
                        Reject
                      </Button>
                    )}
                    {report.status === 0 && (
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={true}
                        className="rounded-lg"
                      >
                        Dismiss
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(report.id)}
                        disabled={isDeleting}
                        className="text-destructive"
                        title="Xóa báo cáo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
