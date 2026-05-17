import {
  LayoutDashboard,
  FlagTriangleRight,
  Users,
  FileCheck,
  Truck,
  Zap,
  ArrowRightLeft,
} from "lucide-react";

export const adminNavItems = [
  { label: "Bảng điều khiển", to: "/admin", icon: LayoutDashboard },
  { label: "Báo cáo vi phạm", to: "/admin/reports", icon: FlagTriangleRight },
  { label: "Xác minh tài liệu", to: "/admin/identify", icon: FileCheck },
  { label: "Người dùng", to: "/admin/users", icon: Users },
  { label: "Gói ưu đãi", to: "/admin/promotions", icon: Zap },
  { label: "Lịch sử giao dịch", to: "/admin/transactions", icon: ArrowRightLeft },
];

export const shipperNavItems = [
  { label: "Đơn hàng khả dụng", to: "/admin/shipper/orders", icon: Truck },
  {
    label: "Đơn hàng đã nhận",
    to: "/admin/shipper/my-orders",
    icon: FileCheck,
  },
];
