import type { PaginationMeta } from "@/shared/types";
import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/shared/components/ui/pagination";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  className?: string;
}
export function Pagination({ meta, onPageChange, className }: PaginationProps) {
  const { currentPage, totalPages, hasPreviousPage, hasNextPage } = meta;
  if (totalPages <= 1) return null;
  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };
  return (
    <PaginationRoot className={className}>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPreviousPage}
            aria-label="Go to previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </PaginationItem>

        {/* Page Numbers */}
        {getPageNumbers().map((p, i) =>
          p === "..." ? (
            /**
             * Template literal trong key: `ellipsis-${i}`
             * React cần unique key, vì có thể có nhiều "..." → dùng index ${i}.
             */
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                onClick={(e) => {
                  /**
                   * e.preventDefault(): Ngăn <a> href navigation mặc định.
                   * Vì đây là SPA, dùng onClick thay vì href.
                   */
                  e.preventDefault();
                  onPageChange(p);
                }}
                isActive={currentPage === p}
                className="cursor-pointer"
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        {/* Next Button */}
        <PaginationItem>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
            aria-label="Go to next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}
