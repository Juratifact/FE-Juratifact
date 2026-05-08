import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { X } from "lucide-react";

interface CheckoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (address: string, note?: string) => void;
  isLoading?: boolean;
}

export function CheckoutDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
}: CheckoutDialogProps) {
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    if (!address.trim()) {
      alert("Vui lòng nhập địa chỉ giao hàng");
      return;
    }
    onSubmit(address, note);
    setAddress("");
    setNote("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Thông tin giao hàng</CardTitle>
          <button
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address" className="text-sm font-medium">
              Địa chỉ giao hàng *
            </Label>
            <Input
              id="address"
              placeholder="Ví dụ: 123 Đường ABC, Phường XYZ, Quận 1, TP.HCM"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isLoading}
              className="mt-2"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1 rounded-full"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 rounded-full"
            >
              {isLoading ? "Đang xử lý..." : "Tiếp tục thanh toán"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
