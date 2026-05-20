import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { disputeService } from "../services";
import { QUERY_KEYS } from "@/shared/constants";
import type { CreateDisputeDto } from "../types";

export function useCreateDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: CreateDisputeDto;
    }) => disputeService.createDispute(orderId, data),
    onSuccess: () => {
      toast.success("Gửi khiếu nại thành công");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_DISPUTES });
    },
  });
}

export function useMyDisputes(params?: { pageIndex?: number; pageSize?: number }) {
  return useQuery({
    queryKey: [QUERY_KEYS.MY_DISPUTES, params],
    queryFn: () => disputeService.getMyDisputes(params),
  });
}

export function useAllDisputes(params?: { status?: number; pageIndex?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ["disputes", "all", params],
    queryFn: () => disputeService.getAllDisputes(params),
  });
}

export function useResolveDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      disputeId,
      data,
    }: {
      disputeId: string;
      data: { result: number; adminNote: string };
    }) => disputeService.resolveDispute(disputeId, data),
    onSuccess: () => {
      toast.success("Giải quyết tranh chấp thành công!");
      queryClient.invalidateQueries({ queryKey: ["disputes", "all"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_DISPUTES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_ORDERS });
    },
    onError: () => {
      toast.error("Không thể giải quyết tranh chấp này");
    },
  });
}

export function useCancelDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (disputeId: string) => disputeService.cancelDispute(disputeId),
    onSuccess: () => {
      toast.success("Hủy khiếu nại thành công!");
      queryClient.invalidateQueries({ queryKey: ["disputes", "all"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_DISPUTES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_ORDERS });
    },
    onError: () => {
      toast.error("Không thể hủy khiếu nại này");
    },
  });
}

export function useAssignDispute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      disputeId,
      assignedAdminId,
    }: {
      disputeId: string;
      assignedAdminId: string;
    }) => disputeService.assignDispute(disputeId, assignedAdminId),
    onSuccess: () => {
      toast.success("Nhận đơn khiếu nại thành công!");
      queryClient.invalidateQueries({ queryKey: ["disputes", "all"] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_DISPUTES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_ORDERS });
    },
    onError: () => {
      toast.error("Không thể nhận đơn khiếu nại này");
    },
  });
}

