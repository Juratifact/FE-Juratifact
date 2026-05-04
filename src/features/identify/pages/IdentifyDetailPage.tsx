import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Mail,
  User,
  Image as ImageIcon,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { useIdentifyDetail } from "../hooks/useIdentifyDetail";
import {
  useApproveIdentifyDocument,
  useRejectIdentifyDocument,
} from "../hooks/useIdentifyModeration";
import { toast } from "sonner";

const statusConfig: Record<
  number,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  0: { label: "Đang xử lý", variant: "outline" },
  1: { label: "Đã duyệt", variant: "default" },
  2: { label: "Bị từ chối", variant: "destructive" },
  3: { label: "Chờ xử lý", variant: "secondary" },
};

function formatDate(value?: string | null) {
  return value ? new Date(value).toLocaleString("vi-VN") : "—";
}

export default function IdentifyDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: document, isLoading, isError } = useIdentifyDetail(id);
  const approveMutation = useApproveIdentifyDocument();
  const rejectMutation = useRejectIdentifyDocument();
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectReason, setShowRejectReason] = useState(false);

  if (isLoading) {
    return <LoadingSpinner className="py-20" size="lg" />;
  }

  if (isError || !document) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-lg text-muted-foreground">
          Không tìm thấy tài liệu xác minh này.
        </p>
        <Button variant="link" asChild className="mt-4">
          <Link to="/admin/identify">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Quay lại danh sách
          </Link>
        </Button>
      </div>
    );
  }

  const statusInfo = statusConfig[document.status] ?? statusConfig[0];
  const canModerate = document.status === 0 || document.status === 3;

  const handleApprove = () => {
    approveMutation.mutate(document.id, {
      onSuccess: () => {
        navigate("/admin/identify");
      },
    });
  };

  const handleReject = () => {
    const reason = rejectReason.trim();
    if (!reason) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }

    rejectMutation.mutate(
      { documentId: document.id, reason },
      {
        onSuccess: () => {
          navigate("/admin/identify");
        },
      },
    );
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/admin/identify">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Quay lại danh sách
        </Link>
      </Button>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Chi tiết tài liệu xác minh</h1>
          <p className="mt-1 text-muted-foreground">
            Thông tin chi tiết tài liệu do người dùng gửi lên
          </p>
        </div>
        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Thông tin xác minh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4" />
                  Người dùng
                </div>
                <p className="font-semibold">
                  {document.user?.fullName ?? "—"}
                </p>
                <p className="text-sm text-muted-foreground">
                  ID: {document.user?.id ?? document.userId ?? "—"}
                </p>
                {document.user?.email && (
                  <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {document.user.email}
                  </p>
                )}
              </div>

              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  Thời gian
                </div>
                <p className="text-sm">Tạo: {formatDate(document.createdAt)}</p>
                <p className="text-sm">
                  Cập nhật: {formatDate(document.updatedAt)}
                </p>
                <p className="text-sm">
                  Duyệt: {formatDate(document.verifiedAt)}
                </p>
              </div>
            </div>

            <Separator />
            {canModerate && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Duyệt / Từ chối</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleApprove}
                      disabled={
                        approveMutation.isPending || rejectMutation.isPending
                      }
                    >
                      {approveMutation.isPending ? "Đang duyệt..." : "Approve"}
                    </Button>
                    {!showRejectReason ? (
                      <Button
                        variant="destructive"
                        onClick={() => setShowRejectReason(true)}
                        disabled={
                          approveMutation.isPending || rejectMutation.isPending
                        }
                      >
                        Reject
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowRejectReason(false);
                          setRejectReason("");
                        }}
                        disabled={
                          approveMutation.isPending || rejectMutation.isPending
                        }
                      >
                        Hủy
                      </Button>
                    )}
                  </div>

                  {showRejectReason && (
                    <>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Nhập lý do từ chối (bắt buộc khi từ chối)..."
                        rows={4}
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                      <Button
                        variant="destructive"
                        onClick={handleReject}
                        disabled={
                          approveMutation.isPending || rejectMutation.isPending
                        }
                      >
                        {rejectMutation.isPending
                          ? "Đang từ chối..."
                          : "Xác nhận Reject"}
                      </Button>
                    </>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hình ảnh tài liệu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Mặt trước", url: document.idCardFrontUrl },
              { label: "Mặt sau", url: document.idCardBackUrl },
              { label: "Selfie", url: document.selfieUrl },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ImageIcon className="h-4 w-4" />
                  {item.label}
                </div>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block overflow-hidden rounded-lg border bg-muted/30"
                  >
                    <img
                      src={item.url}
                      alt={item.label}
                      className="h-40 w-full object-cover"
                    />
                  </a>
                ) : (
                  <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    Không có ảnh
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
