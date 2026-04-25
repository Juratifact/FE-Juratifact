import { Link } from "react-router-dom";
import { Pencil, Trash2, Flame } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { Ritual } from "../types";

interface RitualTableProps {
  rituals: Ritual[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const difficultyVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  dễ: "secondary",
  "trung bình": "outline",
  khó: "default",
  "rất khó": "destructive",
};

/**
 * Table hiển thị danh sách rituals cho admin.
 * Sử dụng shadcn Table + Button + Badge.
 */
export function RitualTable({
  rituals,
  onDelete,
  isDeleting,
}: RitualTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên nghi lễ</TableHead>
            <TableHead>Ngày âm lịch</TableHead>
            <TableHead>Độ khó</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead className="text-center">Hot</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rituals.map((ritual) => (
            <TableRow key={ritual.id}>
              <TableCell className="font-medium">{ritual.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {ritual.dateLunar}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    difficultyVariant[ritual.difficultyLevel] ?? "outline"
                  }
                >
                  {ritual.difficultyLevel}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {ritual.ritualCategory?.name ?? "—"}
              </TableCell>
              <TableCell className="text-center">
                {ritual.isHot && (
                  <Flame className="mx-auto h-4 w-4 text-destructive" />
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/ritual/${ritual.id}/edit`}>
                      <Pencil className="mr-1 h-3 w-3" />
                      Sửa
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive border-destructive/30 hover:bg-destructive/10"
                    onClick={() => {
                      if (
                        window.confirm(`Bạn có chắc muốn xoá "${ritual.name}"?`)
                      ) {
                        onDelete(ritual.id);
                      }
                    }}
                    disabled={isDeleting}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Xoá
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
