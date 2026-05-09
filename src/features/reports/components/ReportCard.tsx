import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import type { Report } from "../types";
import { getStatusLabel, getStatusDisplay, REPORT_STATUS_MAP } from "../types";

interface ReportCardProps {
  report: Report;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
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

export function ReportCard({
  report,
  onApprove,
  onReject,
  isLoading,
}: ReportCardProps) {
  const displayStatus = getStatusDisplay(report.status);
  const statusText = getStatusLabel(report.status);
  const createdDate = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString("vi-VN")
    : "-";

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">
            {report.product?.title || "Sản phẩm chưa xác định"}
          </h3>
          <p className="text-sm text-muted-foreground">{report.reason}</p>
        </div>
        <Badge variant={statusVariant[displayStatus]}>{statusText}</Badge>
      </div>

      {report.description && (
        <p className="text-sm text-muted-foreground">{report.description}</p>
      )}

      <div className="text-xs text-muted-foreground">{createdDate}</div>

      {report.status === REPORT_STATUS_MAP.PROCESSING &&
        (onApprove || onReject) && (
          <div className="flex gap-2 pt-2">
            {onApprove && (
              <Button
                size="sm"
                variant="default"
                onClick={() => onApprove(report.id)}
                disabled={isLoading}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Duyệt
              </Button>
            )}
            {onReject && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onReject(report.id)}
                disabled={isLoading}
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Từ chối
              </Button>
            )}
          </div>
        )}
    </div>
  );
}
