import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/constants";
import { transactionService } from "../services";
import type { TransactionFilterParams } from "../types";

export function useTransactions(params?: TransactionFilterParams) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [...QUERY_KEYS.TRANSACTIONS, params],
    queryFn: () => transactionService.getTransactions(params),
  });

  // Smart pagination logic to handle inconsistent backend totalItems (returning page count instead of global total)
  const items = data?.items || [];
  const pageIndex = data?.pageIndex || params?.pageIndex || 1;
  const pageSize = data?.pageSize || params?.pageSize || 10;
  
  // The backend seems to return the current page's item count in 'totalItems'.
  // We need to calculate totalPages dynamically to ensure the UI doesn't break.
  const totalItems = data?.totalItems || 0;
  
  // We assume there are more pages if the current page is full.
  // We also ensure totalPages is at least equal to the current pageIndex so the pagination component doesn't hide.
  let totalPages = pageIndex;
  if (items.length >= pageSize) {
    totalPages = pageIndex + 1;
  }

  // If we are on page 2 and it's not full, totalPages should still be 2 so we can go back.
  // The Pagination component hides if totalPages <= 1.
  
  return {
    transactions: items,
    pagination: data ? {
      totalItems,
      pageSize,
      pageIndex,
      totalPages: Math.max(1, totalPages),
      hasPreviousPage: pageIndex > 1,
      hasNextPage: items.length >= pageSize
    } : null,
    isLoading,
    error,
    refetch,
  };
}
