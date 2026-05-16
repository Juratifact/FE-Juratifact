import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { createShipperSchema, type CreateShipperFormData } from "../schema";

interface ShipperFormProps {
  onSubmit: (data: CreateShipperFormData) => void;
  isPending?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ShipperForm({
  onSubmit,
  isPending,
  onCancel,
  submitLabel = "Tạo tài khoản",
}: ShipperFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateShipperFormData>({
    resolver: zodResolver(createShipperSchema),
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
      phoneNumber: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="shipper@example.com"
          {...register("email")}
          disabled={isPending}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Họ tên *</Label>
        <Input
          id="fullName"
          placeholder="Nhập họ tên đầy đủ"
          {...register("fullName")}
          disabled={isPending}
        />
        {errors.fullName && (
          <p className="text-xs text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu *</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
          disabled={isPending}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Số điện thoại *</Label>
        <Input
          id="phoneNumber"
          placeholder="098xxxxxxx"
          {...register("phoneNumber")}
          disabled={isPending}
        />
        {errors.phoneNumber && (
          <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 rounded-xl"
            disabled={isPending}
          >
            Hủy
          </Button>
        )}
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-xl"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
