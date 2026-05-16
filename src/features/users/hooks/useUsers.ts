import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { userService } from "../services";
import type {
  UpdateUserProfileDto,
  UserFilterParams,
  CreateShipperDto,
} from "../types";
import { QUERY_KEYS } from "@/shared/constants";
import { useAuthStore } from "@/features/auth/store";

export function useUsers() {
  const [searchParams] = useSearchParams();

  const filter = useMemo<UserFilterParams>(() => {
    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      search: searchParams.get("search") || undefined,
    };
  }, [searchParams]);

  const query = useQuery({
    queryKey: [QUERY_KEYS.USERS, filter],
    queryFn: () => userService.getAll(filter),
    placeholderData: (prev) => prev,
  });

  return {
    users: query.data?.data ?? [],
    pagination: query.data?.meta,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useSearchUserByName(userName: string) {
  const normalized = userName.trim();

  return useQuery({
    queryKey: QUERY_KEYS.USER_BY_NAME(normalized),
    queryFn: () => userService.getUserByName(normalized),
    enabled: normalized.length > 0,
  });
}

export function useMyProfile(userId?: string, options?: { refetchInterval?: number }) {
  const storedUserId = useAuthStore((state) => state.userId);
  const access_token = useAuthStore((state) => state.access_token);

  const resolvedId = useMemo(() => {
    return userId ?? storedUserId;
  }, [storedUserId, userId]);

  return useQuery({
    queryKey: QUERY_KEYS.MY_PROFILE(resolvedId ?? ""),
    queryFn: () => userService.getMyProfile(resolvedId!),
    enabled: !!resolvedId && !!access_token,
    refetchInterval: options?.refetchInterval,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserProfileDto }) =>
      userService.updateProfile(id, data),
    onSuccess: () => {
      toast.success("Cập nhật hồ sơ thành công");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      queryClient.invalidateQueries({ queryKey: ["users", "my-profile"] });
    },
  });
}

export function useCreateShipper() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShipperDto) => userService.createShipper(data),
    onSuccess: () => {
      toast.success("Tạo tài khoản shipper thành công");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      toast.success("Xóa người dùng thành công");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
  });
}
