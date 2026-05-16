import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { X, Loader2 } from "lucide-react";
import { LocationAutocomplete } from "@/features/map/components/LocationAutocomplete";

interface CheckoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (address: string, refId: string) => void;
  isLoading?: boolean;
}

export function CheckoutDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
}: CheckoutDialogProps) {
  const [address, setAddress] = useState("");
  const [refId, setRefId] = useState("");

  const handleLocationChange = (newAddress: string, newRefId?: string) => {
    setAddress(newAddress);
    if (newRefId) setRefId(newRefId);
  };

  const handleSubmit = () => {
    if (!address.trim()) {
      return;
    }
    if (!refId) {
      alert("Vui lòng chọn địa chỉ từ danh sách gợi ý");
      return;
    }
    onSubmit(address, refId);
    setAddress("");
    setRefId("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-md rounded-3xl border-none shadow-2xl overflow-visible">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">Thông tin giao hàng</CardTitle>
          <button
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="rounded-full p-1 hover:bg-muted transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-semibold ml-1">
              Địa chỉ giao hàng *
            </Label>
            <LocationAutocomplete
              value={address}
              onChange={handleLocationChange}
              placeholder="Ví dụ: 123 Đường ABC, Phường XYZ, Quận 1, TP.HCM"
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1 rounded-full h-12 font-semibold hover:bg-muted"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !address.trim()}
              className="flex-1 rounded-full h-12 font-semibold shadow-lg shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Tiếp tục thanh toán"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
