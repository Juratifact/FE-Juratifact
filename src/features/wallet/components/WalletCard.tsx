import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Wallet, Clock } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface WalletCardProps {
  balance: number;
  pendingBalance: number;
  className?: string;
}

export const WalletCard = ({ balance, pendingBalance, className }: WalletCardProps) => {
  return (
    <Card className={cn("overflow-hidden border-border/50 shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/30">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">Số dư khả dụng</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Cập nhật lần cuối: {new Date().toLocaleTimeString("vi-VN")}
          </CardDescription>
        </div>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-3xl font-bold tracking-tight">
          {formatCurrency(balance)}
        </div>
        
        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border/40">
          <Clock className="h-4 w-4" />
          <span>Đang chờ xử lý: </span>
          <span className="font-semibold text-foreground">{formatCurrency(pendingBalance)}</span>
        </div>
      </CardContent>
    </Card>
  );
};
