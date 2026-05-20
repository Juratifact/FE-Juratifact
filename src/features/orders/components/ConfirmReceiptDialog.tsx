import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface ConfirmReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isProcessing?: boolean;
}

export function ConfirmReceiptDialog({
  open,
  onOpenChange,
  onConfirm,
  isProcessing,
}: ConfirmReceiptDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-500">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Xác nhận nhận hàng
          </DialogTitle>
          <DialogDescription className="space-y-3 pt-2 text-sm leading-relaxed text-muted-foreground">
            <p>
              Khi bạn xác nhận đã nhận hàng, đơn hàng sẽ được đánh dấu là <strong className="text-foreground">Hoàn thành</strong> và tiền thanh toán sẽ được giải ngân cho người bán.
            </p>
            <p className="font-semibold text-destructive flex items-start gap-1">
              <span className="shrink-0">⚠️</span>
              Bạn sẽ KHÔNG THỂ yêu cầu trả hàng/hoàn tiền hoặc khiếu nại đơn hàng này sau khi đã xác nhận.
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Quay lại
          </Button>
          <Button
            onClick={() => {
              onConfirm();
            }}
            disabled={isProcessing}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isProcessing ? (
              "Đang xử lý..."
            ) : (
              <>
                <CheckCircle2 className="mr-1 h-4 w-4" />
                Xác nhận đã nhận
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
