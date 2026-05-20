export interface NotificationItem {
  notificationId: string;
  title: string;
  content: string;
  redirectUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedNotifications {
  items: NotificationItem[];
  totalItems: number;
  pageSize: number;
  pageIndex: number;
}
