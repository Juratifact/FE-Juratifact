import { Link } from "react-router-dom";
import { Edit, CheckCircle, XCircle, Clock } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import type { IdentifyDocument } from "../types";

interface IdentifyCardProps {
  document: IdentifyDocument;
}

const statusConfig: Record<
  number,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ReactNode;
  }
> = {
  0: {
    label: "Đang xử lý",
    variant: "outline",
    icon: <Clock className="h-3 w-3" />,
  },
  1: {
    label: "Đã duyệt",
    variant: "default",
    icon: <CheckCircle className="h-3 w-3" />,
  },
  2: {
    label: "Bị từ chối",
    variant: "destructive",
    icon: <XCircle className="h-3 w-3" />,
  },
  3: {
    label: "Chờ xử lý",
    variant: "outline",
    icon: <Clock className="h-3 w-3" />,
  },
};

/**
 * Card hiển thị thông tin xác minh tài liệu.
 */
export function IdentifyCard({ document }: IdentifyCardProps) {
  const statusInfo = statusConfig[document.status] || statusConfig[0];
  const createdDate = document.createdAt
    ? new Date(document.createdAt).toLocaleDateString("vi-VN")
    : "-";

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">Tài liệu xác minh</CardTitle>
          <Badge
            variant={statusInfo.variant}
            className="flex items-center gap-1 shrink-0"
          >
            {statusInfo.icon}
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Dates */}
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Gửi lần: {createdDate}</p>
          {document.updatedAt && (
            <p>
              Cập nhật:{" "}
              {new Date(document.updatedAt).toLocaleDateString("vi-VN")}
            </p>
          )}
        </div>

        {/* Message if rejected */}
        {document.message && document.status === 2 && (
          <div className="rounded-md bg-destructive/10 p-2.5">
            <p className="text-sm text-destructive">{document.message}</p>
          </div>
        )}

        {/* Document URLs preview */}
        <div className="space-y-2 text-xs text-muted-foreground">
          {document.idCardFrontUrl && <p>✓ Ảnh CMND mặt trước</p>}
          {document.idCardBackUrl && <p>✓ Ảnh CMND mặt sau</p>}
          {document.selfieUrl && <p>✓ Ảnh selfie</p>}
        </div>

        {/* Action buttons */}
        {document.status === 2 && (
          <Button asChild size="sm" className="w-full" variant="default">
            <Link to={`/identify/edit/${document.id}`}>
              <Edit className="mr-1 h-4 w-4" />
              Gửi lại
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
