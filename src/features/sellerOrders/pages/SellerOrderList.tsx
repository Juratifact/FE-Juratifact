import { useSellerOrders } from "../hooks/useSellerOrders";
import { SellerOrderTable } from "../components/SellerOrderTable";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/shared/components/ui/card";
import { Package } from "lucide-react";

export default function SellerOrderList() {
  const { orders, isLoading, totalItems } = useSellerOrders();

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight">Quản lý bán hàng</h1>
          <p className="text-muted-foreground font-medium">
            Theo dõi và quản lý các đơn hàng từ khách hàng của bạn.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-emerald-500/5 border-emerald-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-emerald-600">
                Tổng đơn hàng
              </CardTitle>
              <Package className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{totalItems}</div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Đơn hàng đã nhận</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-xl bg-background/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Danh sách đơn hàng</CardTitle>
            <CardDescription>
              Bạn có tổng cộng {totalItems} đơn hàng cần xử lý.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SellerOrderTable orders={orders} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
