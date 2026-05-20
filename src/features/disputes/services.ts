import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type { CreateDisputeDto, PaginatedDisputes } from "./types";

export const disputeService = {
  createDispute: async (orderId: string, data: CreateDisputeDto): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.ORDER.DISPUTE(orderId), data);
  },
  getMyDisputes: async (params?: { pageIndex?: number; pageSize?: number }): Promise<PaginatedDisputes> => {
    const response = await apiClient.get<PaginatedDisputes>(API_ENDPOINTS.DISPUTE.MY_DISPUTES, {
      params: {
        pageIndex: params?.pageIndex ?? 1,
        pageSize: params?.pageSize ?? 10,
      },
    });
    return response as unknown as PaginatedDisputes;
  },
  getAllDisputes: async (params?: {
    status?: number;
    pageIndex?: number;
    pageSize?: number;
  }): Promise<PaginatedDisputes> => {
    const response = await apiClient.get<PaginatedDisputes>(API_ENDPOINTS.DISPUTE.BASE, {
      params: {
        status: params?.status,
        pageIndex: params?.pageIndex ?? 1,
        pageSize: params?.pageSize ?? 10,
      },
    });
    return response as unknown as PaginatedDisputes;
  },
  resolveDispute: async (
    disputeId: string,
    data: { result: number; adminNote: string }
  ): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.DISPUTE.RESOLVE(disputeId), data);
  },
  cancelDispute: async (disputeId: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.DISPUTE.CANCEL(disputeId));
  },
  assignDispute: async (disputeId: string, assignedAdminId: string): Promise<void> => {
    await apiClient.patch(API_ENDPOINTS.DISPUTE.ASSIGN(disputeId), { assignedAdminId });
  },
};
