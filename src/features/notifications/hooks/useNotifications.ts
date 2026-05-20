import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../services";
import { useAuthStore } from "@/features/auth/store";
import { QUERY_KEYS } from "@/shared/constants";
import type { PaginatedResponse, PaginationMeta } from "@/shared/types";
import type { NotificationItem } from "../types";

export function useNotifications(pageIndex = 1, pageSize = 10) {
  const userId = useAuthStore((s) => s.userId);

  return useQuery<PaginatedResponse<NotificationItem>>({
    queryKey: [...QUERY_KEYS.NOTIFICATIONS, userId, pageIndex, pageSize],
    queryFn: async () => {
      if (!userId) {
        return {
          data: [],
          meta: {
            totalItems: 0,
            totalPages: 0,
            itemsPerPage: pageSize,
            currentPage: pageIndex,
            hasPreviousPage: false,
            hasNextPage: false,
          },
        };
      }

      const response = await notificationService.getNotifications({
        userId,
        pageIndex,
        pageSize,
      });

      const items = response.items ?? [];
      const totalItems = response.totalItems ?? 0;
      const totalPages = Math.ceil(totalItems / pageSize);

      const meta: PaginationMeta = {
        totalItems,
        totalPages,
        itemsPerPage: pageSize,
        currentPage: pageIndex,
        hasPreviousPage: pageIndex > 1,
        hasNextPage: pageIndex < totalPages,
      };

      return {
        data: items,
        meta,
      };
    },
    enabled: !!userId,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
    },
  });
}
