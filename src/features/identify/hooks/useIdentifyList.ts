import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { identifyService } from "../services";
import { QUERY_KEYS } from "@/shared/constants";

export function useIdentifyList() {
  const [searchParams] = useSearchParams();

  const filter = useMemo(() => {
    return {
      pageIndex: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("limit")) || 10,
      status: searchParams.get("status")
        ? Number(searchParams.get("status"))
        : undefined,
    };
  }, [searchParams]);

  const query = useQuery({
    queryKey: [QUERY_KEYS.IDENTIFY_DOCUMENTS, filter],
    queryFn: () =>
      identifyService.getAll({
        status: filter.status,
        pageIndex: filter.pageIndex,
        pageSize: filter.pageSize,
      }),
    placeholderData: (prev) => prev,
  });

  return {
    documents: query.data?.data ?? [],
    pagination: query.data?.meta,
    isLoading: query.isLoading,
    error: query.error,
  };
}
