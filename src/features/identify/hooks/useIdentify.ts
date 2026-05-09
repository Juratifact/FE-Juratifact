import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UpdateIdentifyDto } from "../types";
import {
  submitIdentifyDocument,
  getMyIdentifyDocument,
  reSubmitIdentifyDocument,
} from "../services";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/shared/constants";
import type { AxiosProgressEvent } from "axios";
import { useAuthStore } from "@/features/auth/store";

export function useSubmitIdentifyDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      formData: FormData;
      onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
    }) => submitIdentifyDocument(data.formData, data.onUploadProgress),
    onSuccess: () => {
      toast.success("Gửi tài liệu xác minh thành công!");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.IDENTIFY_MY_DOCUMENT,
      });
    },
    onError: () => {
      toast.error("Gửi tài liệu xác minh thất bại");
    },
  });
}

export function useGetMyIdentifyDocument(options?: {
  refetchInterval?: number | false;
  enabled?: boolean;
}) {
  const access_token = useAuthStore((s) => s.access_token);
  return useQuery({
    queryKey: QUERY_KEYS.IDENTIFY_MY_DOCUMENT,
    queryFn: () => getMyIdentifyDocument(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: options?.refetchInterval,
    enabled: (options?.enabled ?? true) && !!access_token,
  });
}

export function useReSubmitIdentifyDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      updateData: UpdateIdentifyDto;
      onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
    }) => reSubmitIdentifyDocument(data.updateData, data.onUploadProgress),
    onSuccess: () => {
      toast.success("Gửi lại tài liệu xác minh thành công!");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.IDENTIFY_MY_DOCUMENT,
      });
    },
    onError: () => {
      toast.error("Gửi lại tài liệu xác minh thất bại");
    },
  });
}

export function useIdentifyDocument() {
  const getQuery = useGetMyIdentifyDocument();
  const submitMutation = useSubmitIdentifyDocument();
  const reSubmitMutation = useReSubmitIdentifyDocument();

  return {
    document: getQuery.data,
    isLoading: getQuery.isLoading,
    isError: getQuery.isError,
    submitIdentify: submitMutation.mutate,
    isSubmitting: submitMutation.isPending,
    reSubmitIdentify: reSubmitMutation.mutate,
    isReSubmitting: reSubmitMutation.isPending,
  };
}
