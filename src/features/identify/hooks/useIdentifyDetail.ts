import { useQuery } from "@tanstack/react-query";
import { identifyService } from "../services";
import { QUERY_KEYS } from "@/shared/constants";

export function useIdentifyDetail(documentId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.IDENTIFY_DOCUMENTS, documentId],
    queryFn: () => identifyService.getById(documentId!),
    enabled: !!documentId,
    staleTime: 5 * 60 * 1000,
  });
}
