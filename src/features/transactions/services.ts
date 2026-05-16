import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type { 
  TransactionFilterParams, 
  TransactionListResponse, 
} from "./types";

export const transactionService = {
  getTransactions: async (params?: TransactionFilterParams): Promise<TransactionListResponse> => {
    const cleanParams = { ...params };
    if (cleanParams.transactionType === undefined || cleanParams.transactionType === null) {
      delete cleanParams.transactionType;
    }
    if (cleanParams.status === undefined || cleanParams.status === null) {
      delete cleanParams.status;
    }

    const response = await apiClient.get(
      API_ENDPOINTS.TRANSACTION.BASE,
      { params: cleanParams }
    );
    
    // Explicitly cast to unknown then to TransactionListResponse to break the AxiosResponse type inference
    return (response as unknown) as TransactionListResponse;
  },
};
