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
import { LocationAutocomplete } from "@/features/map/components/LocationAutocomplete";
import { MapPin } from "lucide-react";

interface UpdateAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (address: string, refId: string) => void;
  isProcessing?: boolean;
}

export function UpdateAddressDialog({
  open,
  onOpenChange,
  onConfirm,
  isProcessing,
}: UpdateAddressDialogProps) {
  const [address, setAddress] = useState("");
  const [refId, setRefId] = useState("");

  const handleConfirm = () => {
    if (address.trim()) {
      onConfirm(address.trim(), refId);
      // Reset form on close
      setTimeout(() => {
        setAddress("");
        setRefId("");
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Đổi địa chỉ giao hàng
          </DialogTitle>
          <DialogDescription>
            Tìm kiếm và chọn địa chỉ mới để giao hàng.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 min-h-[150px]">
          <LocationAutocomplete
            value={address}
            onChange={(val, newRefId) => {
              setAddress(val);
              if (newRefId) setRefId(newRefId);
            }}
            placeholder="Nhập địa chỉ mới..."
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Huỷ
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!address.trim() || isProcessing}
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
