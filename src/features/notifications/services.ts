import apiClient from "@/lib/axios";
import { API_ENDPOINTS } from "@/shared/constants";
import type { PaginatedNotifications } from "./types";

export const notificationService = {
  getNotifications: async (params: {
    userId?: string;
    pageIndex?: number;
    pageSize?: number;
  }): Promise<PaginatedNotifications> => {
    return apiClient.get(API_ENDPOINTS.NOTIFICATION.BASE, { params });
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await apiClient.put(API_ENDPOINTS.NOTIFICATION.READ(notificationId));
  },
};
