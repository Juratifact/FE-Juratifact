import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/shared/constants";
import { approveIdentifyDocument, rejectIdentifyDocument } from "../services";

export function useApproveIdentifyDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => approveIdentifyDocument(documentId),
    onSuccess: () => {
      toast.success("Duyệt tài liệu xác minh thành công!");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.IDENTIFY_DOCUMENTS,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.IDENTIFY_MY_DOCUMENT,
      });
    },
    onError: () => {
      toast.error("Không thể duyệt tài liệu xác minh");
    },
  });
}

export function useRejectIdentifyDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      reason,
    }: {
      documentId: string;
      reason: string;
    }) => rejectIdentifyDocument(documentId, reason),
    onSuccess: () => {
      toast.success("Từ chối tài liệu xác minh thành công!");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.IDENTIFY_DOCUMENTS,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.IDENTIFY_MY_DOCUMENT,
      });
    },
    onError: () => {
      toast.error("Không thể từ chối tài liệu xác minh");
    },
  });
}
