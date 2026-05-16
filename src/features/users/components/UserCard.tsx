import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import type { UserProfile } from "../types";

interface UserCardProps {
  user: UserProfile;
}

export function UserCard({ user }: UserCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.userName ?? user.fullName ?? "ảnh đại diện"}
              className="h-16 w-16 rounded-full border object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border bg-muted text-sm text-muted-foreground">
              Trống
            </div>
          )}
          <div>
            <CardTitle className="text-xl">
              {user.fullName ?? "Người dùng"}
            </CardTitle>
            {user.userName && (
              <p className="text-base text-muted-foreground">
                @{user.userName}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-base">
        {user.email && <p className="break-all">Email: {user.email}</p>}
        {user.phoneNumber && <p>SĐT: {user.phoneNumber}</p>}
        {user.address && (
          <p>Địa chỉ: {user.vietMapDisplay || user.address}</p>
        )}
        {user.createdAt && (
          <Badge variant="outline" className="text-sm">
            Tạo: {new Date(user.createdAt).toLocaleDateString("vi-VN")}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
