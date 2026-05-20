import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, Loader2, Calendar, ArrowLeft } from "lucide-react";
import { useNotifications, useMarkAsRead } from "../hooks/useNotifications";
import { Pagination } from "@/shared/components/common/Pagination";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return dateString;
  }
}

export default function NotificationListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data: notificationsData, isLoading } = useNotifications(page, 10);
  const markAsReadMutation = useMarkAsRead();

  const notifications = notificationsData?.data ?? [];
  const meta = notificationsData?.meta;
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const handleMarkAllRead = async () => {
    const unreadIds = notifications
      .filter((item) => !item.isRead)
      .map((item) => item.notificationId);

    if (unreadIds.length === 0) return;

    try {
      await Promise.all(
        unreadIds.map((id) => markAsReadMutation.mutateAsync(id))
      );
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const handleMarkRead = (item: any) => {
    markAsReadMutation.mutate(item.notificationId);
    if (item.redirectUrl) {
      navigate(item.redirectUrl);
    } else if (item.content.includes("ORD-")) {
      navigate("/orders");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      {/* Back Button */}
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-1.5 rounded-xl h-9 px-3 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors font-bold text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Quay lại
        </Button>
      </div>

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 bg-card/40 border border-border/40 backdrop-blur-md rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <Bell className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
              Thông báo của tôi
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Cập nhật trạng thái đơn hàng và các hoạt động trên hệ thống
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <Button
            onClick={handleMarkAllRead}
            disabled={markAsReadMutation.isPending}
            variant="outline"
            className="self-start sm:self-center font-bold text-xs gap-2 rounded-2xl h-10 px-4 shadow-xs"
          >
            {markAsReadMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            ) : (
              <Check className="w-4 h-4 text-emerald-500" />
            )}
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      {/* Main List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-sm font-medium">Đang tải danh sách thông báo...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-4 bg-card/30 border border-border/30 rounded-3xl">
            <div className="p-4 bg-muted/40 rounded-full">
              <Bell className="w-12 h-12 opacity-30 text-muted-foreground" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-foreground">Không có thông báo</p>
              <p className="text-xs text-muted-foreground">
                Bạn chưa có bất kỳ thông báo nào tại thời điểm này.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {notifications.map((item) => (
                <div
                  key={item.notificationId}
                  onClick={() => handleMarkRead(item)}
                  className={`flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer shadow-xs group ${
                    !item.isRead
                      ? "bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/30"
                      : "bg-card/40 border-border/40 hover:bg-muted/40 hover:border-border/60"
                  }`}
                >
                  {/* Status Indicator */}
                  <div className="mt-1 shrink-0">
                    {!item.isRead ? (
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                      </span>
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2
                        className={`text-sm md:text-base font-extrabold ${
                          !item.isRead ? "text-foreground" : "text-foreground/80"
                        }`}
                      >
                        {item.title}
                      </h2>
                      {!item.isRead && (
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/15 font-bold text-[9px] px-2 h-4 rounded-full border-none">
                          Mới
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed break-words w-full">
                      {item.content}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 font-semibold pt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>

                  {/* Individual mark as read */}
                  {!item.isRead && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkRead(item);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity rounded-xl h-8 px-2.5 shrink-0 hidden sm:flex text-xs font-bold text-primary"
                    >
                      Đánh dấu đã đọc
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {meta && (
              <div className="flex justify-center pt-8">
                <Pagination meta={meta} onPageChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
