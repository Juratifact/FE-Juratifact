import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

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
import type { IdentifyDocument } from "../types";
import { REPORT_STATUS_OPTIONS } from "@/shared/constants";

interface IdentifyTableProps {
  documents: IdentifyDocument[];
}

function getStatusLabel(status: number) {
  return (
    REPORT_STATUS_OPTIONS.find((s) => s.value === status)?.label ??
    String(status)
  );
}

export function IdentifyTable({ documents }: IdentifyTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Người dùng</TableHead>
            <TableHead>Ngày gửi</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">
                {doc.user?.fullName}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(doc.createdAt).toLocaleString()}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{getStatusLabel(doc.status)}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/identify/${doc.id}`}>
                      <Eye className="mr-1 h-3 w-3" />
                      Chi tiết
                    </Link>
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
