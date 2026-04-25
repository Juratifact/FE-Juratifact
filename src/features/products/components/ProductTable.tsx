import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

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
import type { Product } from "../types";

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const conditionVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  New: "default",
  "Like new": "secondary",
  Good: "outline",
};

const statusVariant: Record<number, "default" | "secondary" | "destructive"> = {
  0: "destructive",
  1: "default",
};

const statusLabel: Record<number, string> = {
  0: "Sold",
  1: "Available",
};

export function ProductTable({
  products,
  onDelete,
  isDeleting,
}: ProductTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Price (VND)</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium max-w-xs truncate">
                {product.title}
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  maximumFractionDigits: 0,
                }).format(product.price)}
              </TableCell>
              <TableCell>
                <Badge
                  variant={conditionVariant[product.condition] ?? "outline"}
                >
                  {product.condition}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant[product.status]}>
                  {statusLabel[product.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(product.createdAt).toLocaleDateString("vi-VN")}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/admin/products/${product.id}/edit`}>
                      <Pencil className="mr-1 h-3 w-3" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive border-destructive/30 hover:bg-destructive/10"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete "${product.title}"?`,
                        )
                      ) {
                        onDelete(product.id);
                      }
                    }}
                    disabled={isDeleting}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
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
