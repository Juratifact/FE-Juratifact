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
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Gavel } from "lucide-react";

interface ResolveDisputeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (result: number, adminNote: string) => void;
  isProcessing?: boolean;
}

export function ResolveDisputeDialog({
  open,
  onOpenChange,
  onConfirm,
  isProcessing,
}: ResolveDisputeDialogProps) {
  const [result, setResult] = useState<number>(1);
  const [adminNote, setAdminNote] = useState("");

  const handleConfirm = () => {
    if (adminNote.trim()) {
      onConfirm(result, adminNote.trim());
      // Reset form on close
      setTimeout(() => {
        setResult(1);
        setAdminNote("");
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary font-bold">
            <Gavel className="w-5 h-5 text-primary" />
            Giải quyết tranh chấp
          </DialogTitle>
          <DialogDescription>
            Đưa ra quyết định giải quyết cho khiếu nại này và ghi chú phản hồi gửi tới người dùng.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="font-bold text-sm">Hướng giải quyết</Label>
            <Select
              value={String(result)}
              onValueChange={(val) => setResult(Number(val))}
              disabled={isProcessing}
            >
              <SelectTrigger className="w-full h-10 border border-input px-3 py-2 text-sm rounded-md bg-transparent">
                <SelectValue placeholder="Chọn hướng giải quyết khiếu nại" />
              </SelectTrigger>
              <SelectContent position="popper" className="bg-popover text-popover-foreground border shadow-md">
                <SelectItem value="1">Hoàn tiền cho người dùng</SelectItem>
                <SelectItem value="2">Tất toán cho người bán</SelectItem>
                <SelectItem value="3">Hoàn một phần tiền cho người dùng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-sm">Ghi chú phản hồi (Bắt buộc)</Label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Nhập lý do chi tiết cho hướng giải quyết khiếu nại này..."
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              disabled={isProcessing}
            />
          </div>
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
            className="font-bold bg-primary text-primary-foreground hover:bg-primary/95"
            onClick={handleConfirm}
            disabled={!adminNote.trim() || isProcessing}
          >
            {isProcessing ? "Đang xử lý..." : "Xác nhận quyết định"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
