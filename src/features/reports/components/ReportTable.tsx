import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Eye } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { Report } from "../types";
import { getStatusLabel, getStatusDisplay } from "../types";
import { ReportDetailModal } from "./ReportDetailModal";

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
  pending: "secondary",
  approved: "secondary",
  rejected: "secondary",
  dismissed: "secondary",
};

export function ReportTable({
  reports,
  onApprove,
  onReject,
  isLoading,
}: ReportTableProps) {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  return (
    <>
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lý do</TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Người báo cáo</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => {
              const displayStatus = getStatusDisplay(report.status);
              const statusText = getStatusLabel(report.status);
              return (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.reason}</TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate text-sm font-medium">
                      {report.product?.title || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {report.reporter?.fullName || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                    {report.description || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[displayStatus]}>
                      {statusText}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full h-8"
                      onClick={() => setSelectedReportId(report.id)}
                    >
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <ReportDetailModal
        reportId={selectedReportId}
        onClose={() => setSelectedReportId(null)}
        onApprove={(id) => {
          onApprove?.(id);
          setSelectedReportId(null);
        }}
        onReject={(id) => {
          onReject?.(id);
          setSelectedReportId(null);
        }}
        isLoadingAction={isLoading}
      />
    </>
  );
}
