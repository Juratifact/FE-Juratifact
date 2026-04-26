import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { userService } from "../services";
import type { UpdateUserProfileDto, UserFilterParams } from "../types";
import { QUERY_KEYS } from "@/shared/constants";
import { useAuthStore } from "@/features/auth/store";

type JwtClaims = {
  sub?: string;
  nameid?: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"?: string;
};

const getUserIdFromToken = (token: string | null): string | undefined => {
  if (!token) return undefined;

  try {
    const claims = jwtDecode<JwtClaims>(token);
    return (
      claims.sub ||
      claims.nameid ||
      claims[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ]
    );
  } catch {
    return undefined;
  }
};

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

export function useMyProfile(userId?: string) {
  const token = useAuthStore((state) => state.access_token);

  const resolvedId = useMemo(() => {
    return userId ?? getUserIdFromToken(token);
  }, [token, userId]);

  return useQuery({
    queryKey: QUERY_KEYS.MY_PROFILE(resolvedId ?? ""),
    queryFn: () => userService.getMyProfile(resolvedId!),
    enabled: !!resolvedId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserProfileDto }) =>
      userService.updateProfile(id, data),
    onSuccess: (updatedUser) => {
      toast.success("Cập nhật hồ sơ thành công");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MY_PROFILE(updatedUser.id),
      });
    },
  });
}
