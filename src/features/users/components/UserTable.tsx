
import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { ConfirmationModal } from "@/shared/components/common/ConfirmationModal";
import { useDeleteUser } from "../hooks/useUsers";
import type { UserProfile } from "../types";

interface UserTableProps {
  users: UserProfile[];
}

export function UserTable({ users }: UserTableProps) {
  const deleteMutation = useDeleteUser();
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const handleDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete, {
        onSuccess: () => setUserToDelete(null),
      });
    }
  };

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
                    alt={user.userName ?? user.fullName ?? "ảnh đại diện"}
                    className="h-9 w-9 rounded-full border object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted text-xs text-muted-foreground">
                    Trống
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
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setUserToDelete(user.id)}
                  disabled={deleteMutation.isPending && userToDelete === user.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ConfirmationModal
        isOpen={!!userToDelete}
        onCancel={() => setUserToDelete(null)}
        onConfirm={handleDelete}
        title="Xóa người dùng"
        description="Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."
        confirmLabel="Xóa"
        variant="destructive"
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
