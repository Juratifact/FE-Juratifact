import { WalletCard } from "../components/WalletCard";
import { useWallet } from "../hooks/useWallet";
import { History, CreditCard, ArrowDownToLine, ArrowUpFromLine, Wallet } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";

const WalletPage = () => {
  const { data: wallet } = useWallet();

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
                <Wallet className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Ví của tôi</h1>
          </div>
          <p className="text-muted-foreground text-sm">Quản lý số dư và theo dõi các hoạt động tài chính của bạn</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="gap-2 h-9">
            <ArrowDownToLine className="h-4 w-4" />
            Nạp tiền
          </Button>
          <Button size="sm" className="gap-2 h-9">
            <ArrowUpFromLine className="h-4 w-4" />
            Rút tiền
          </Button>
        </div>
      </div>

      <Separator className="bg-border/60" />

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-6">
          <WalletCard
            balance={wallet?.balance ?? 0}
            pendingBalance={wallet?.pendingBalance ?? 0}
          />
          
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
                Phím tắt nhanh
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="flex flex-col h-24 gap-3 rounded-xl border-border/60 hover:bg-muted/50 hover:border-primary/20 transition-all group">
                <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                    <CreditCard className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-xs font-medium">Liên kết thẻ</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-24 gap-3 rounded-xl border-border/60 hover:bg-muted/50 hover:border-primary/20 transition-all group">
                <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                    <History className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-xs font-medium">Thống kê chi tiêu</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-border/80 bg-muted/20 p-8 text-center">
             <div className="relative">
                <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-background border shadow-sm">
                    <History className="h-10 w-10 text-muted-foreground/40" />
                </div>
             </div>
             <div className="space-y-2 max-w-[280px]">
                <h3 className="text-lg font-semibold tracking-tight">Tính năng đang phát triển</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Hệ thống đang được nâng cấp để hỗ trợ xem lịch sử giao dịch chi tiết. Vui lòng quay lại sau!
                </p>
             </div>
             <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" disabled>
                Cần hỗ trợ? Liên hệ Admin
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
