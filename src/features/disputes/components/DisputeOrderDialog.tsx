import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { AlertCircle } from "lucide-react";

interface DisputeOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  isProcessing?: boolean;
}

export function DisputeOrderDialog({
  open,
  onOpenChange,
  onConfirm,
  isProcessing,
}: DisputeOrderDialogProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason.trim());
      // Reset form on close
      setTimeout(() => {
        setReason("");
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-500">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Khiếu nại đơn hàng
          </DialogTitle>
          <DialogDescription>
            Vui lòng nhập chi tiết lý do khiếu nại (ví dụ: sản phẩm bị lỗi, không đúng mô tả, thiếu số lượng...).
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Nhập lý do khiếu nại của bạn ở đây..."
            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            disabled={isProcessing}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Quay lại
          </Button>
          <Button
            className="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white border-none shadow-sm transition-all focus-visible:ring-amber-500"
            onClick={handleConfirm}
            disabled={!reason.trim() || isProcessing}
          >
            {isProcessing ? "Đang gửi..." : "Gửi khiếu nại"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
