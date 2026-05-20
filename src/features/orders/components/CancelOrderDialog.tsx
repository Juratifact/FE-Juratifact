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
import { AlertTriangle } from "lucide-react";

interface CancelOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  isProcessing?: boolean;
}

export function CancelOrderDialog({
  open,
  onOpenChange,
  onConfirm,
  isProcessing,
}: CancelOrderDialogProps) {
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
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Huỷ đơn hàng
          </DialogTitle>
          <DialogDescription>
            Vui lòng nhập lý do huỷ đơn hàng này. Thao tác này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Nhập lý do huỷ đơn hàng..."
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
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim() || isProcessing}
          >
            {isProcessing ? "Đang xử lý..." : "Xác nhận huỷ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
