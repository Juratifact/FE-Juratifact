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
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.userName ?? user.fullName ?? "avatar"}
              className="h-10 w-10 rounded-full border object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-muted text-xs text-muted-foreground">
              N/A
            </div>
          )}
          <div>
            <CardTitle className="text-base">
              {user.fullName ?? "Người dùng"}
            </CardTitle>
            {user.userName && (
              <p className="text-sm text-muted-foreground">@{user.userName}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {user.email && <p>Email: {user.email}</p>}
        {user.phoneNumber && <p>SĐT: {user.phoneNumber}</p>}
        {user.address && <p>Địa chỉ: {user.address}</p>}
        {user.createdAt && (
          <Badge variant="outline">
            Tạo: {new Date(user.createdAt).toLocaleDateString("vi-VN")}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
