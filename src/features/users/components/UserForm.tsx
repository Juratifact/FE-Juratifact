import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { userProfileSchema, type UserProfileFormData } from "../schema";
import type { UserFormProps } from "../types";

export function UserForm({
  defaultValues,
  currentPicture,
  onSubmit,
  isPending = false,
  submitLabel = "Lưu thay đổi",
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      fullName: "",
      userName: "",
      phoneNumber: "",
      address: "",
      password: "",
      ...defaultValues,
    },
  });

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Thông tin tài khoản</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentPicture && (
            <div className="space-y-2">
              <Label>Ảnh đại diện hiện tại</Label>
              <img
                src={currentPicture}
                alt="Avatar"
                className="h-20 w-20 rounded-full border object-cover"
              />
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                placeholder="Nhập họ và tên"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userName">Tên người dùng</Label>
              <Input
                id="userName"
                placeholder="Nhập username"
                {...register("userName")}
              />
              {errors.userName && (
                <p className="text-sm text-destructive">
                  {errors.userName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Số điện thoại</Label>
            <Input
              id="phoneNumber"
              placeholder="Nhập số điện thoại"
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-destructive">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <textarea
              id="address"
              rows={3}
              placeholder="Nhập địa chỉ"
              className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...register("address")}
            />
            {errors.address && (
              <p className="text-sm text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu mới</Label>
            <Input
              id="password"
              type="password"
              placeholder="Để trống nếu không đổi"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profilePicture">Ảnh đại diện mới</Label>
            <Input
              id="profilePicture"
              type="file"
              accept="image/*"
              {...register("profilePicture")}
            />
            {errors.profilePicture && (
              <p className="text-sm text-destructive">
                {errors.profilePicture.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
