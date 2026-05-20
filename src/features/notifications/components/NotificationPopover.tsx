import { Link, useNavigate } from "react-router-dom";
import { Bell, Check, Loader2 } from "lucide-react";
import { useNotifications, useMarkAsRead } from "../hooks/useNotifications";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";

function formatRelativeTime(dateString: string) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function NotificationPopover() {
  const navigate = useNavigate();
  const { data: notificationsData, isLoading } = useNotifications(1, 10);
  const markAsReadMutation = useMarkAsRead();

  const notifications = notificationsData?.data ?? [];
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleNotificationClick = (item: any) => {
    markAsReadMutation.mutate(item.notificationId);
    if (item.redirectUrl) {
      navigate(item.redirectUrl);
    } else if (item.content.includes("ORD-")) {
      navigate("/orders");
    }
  };

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative rounded-full h-8 w-8 p-0 hover:bg-muted/50 transition-colors duration-300 group"
            aria-label="Notifications"
          >
            <Bell className={`size-4 transition-transform group-hover:animate-[wiggle_0.5s_ease-in-out_infinite] ${
              unreadCount > 0 ? "text-destructive fill-destructive/20 animate-pulse" : ""
            }`} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold leading-none text-destructive-foreground animate-pulse shadow-sm">
                {unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[320px] sm:w-[380px] p-2 bg-popover/95 border border-border/50 backdrop-blur-md shadow-2xl rounded-2xl"
        >
          <div className="flex items-center justify-between px-3 py-2">
            <span className="font-extrabold text-sm text-foreground">Thông báo</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={markAsReadMutation.isPending}
                className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors font-bold disabled:opacity-50"
              >
                {markAsReadMutation.isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>
          <DropdownMenuSeparator className="bg-border/40" />

          <div className="max-h-[320px] overflow-y-auto space-y-1 py-1 pr-0.5 no-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-xs">Đang tải thông báo...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
                <Bell className="w-8 h-8 opacity-20" />
                <span className="text-xs font-medium">Không có thông báo nào</span>
              </div>
            ) : (
              notifications.map((item) => (
                <DropdownMenuItem
                  key={item.notificationId}
                  className={`flex flex-col items-start gap-1 p-3 rounded-xl transition-all cursor-pointer border border-transparent ${
                    !item.isRead
                      ? "bg-primary/5 hover:bg-primary/10 border-primary/10"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() =>
                    handleNotificationClick(item)
                  }
                >
                  <div className="flex items-start justify-between w-full gap-2">
                    <span
                      className={`text-xs font-bold ${
                        !item.isRead ? "text-foreground" : "text-foreground/80"
                      }`}
                    >
                      {item.title}
                    </span>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1 shadow-xs" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed break-words w-full">
                    {item.content}
                  </p>
                  <span className="text-[9px] text-muted-foreground/60 font-semibold mt-0.5">
                    {formatRelativeTime(item.createdAt)}
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </div>

          <DropdownMenuSeparator className="bg-border/40" />
          <div className="pt-2 px-1 pb-1">
            <Button
              asChild
              variant="outline"
              className="w-full text-xs font-bold h-9 rounded-xl hover:bg-muted transition-colors border-border/50 shadow-xs"
            >
              <Link to="/notifications">Xem tất cả</Link>
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
