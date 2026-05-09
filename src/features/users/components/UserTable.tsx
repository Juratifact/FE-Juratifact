
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { UserProfile } from "../types";

interface UserTableProps {
  users: UserProfile[];
}

export function UserTable({ users }: UserTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ảnh</TableHead>
            <TableHead>Họ tên</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.userName ?? user.fullName ?? "avatar"}
                    className="h-9 w-9 rounded-full border object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted text-xs text-muted-foreground">
                    N/A
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">
                {user.fullName ?? "—"}
              </TableCell>
              <TableCell>{user.userName ?? "—"}</TableCell>
              <TableCell className="text-muted-foreground">
                {user.email ?? "—"}
              </TableCell>
              <TableCell>{user.phoneNumber ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
