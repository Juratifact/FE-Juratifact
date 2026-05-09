import { authService } from "../services";
import { useAuthStore } from "../store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { AuthResponse, JwtPayload, LoginRequest } from "../types";
import { jwtDecode } from "jwt-decode";
import type { AxiosError } from "axios";
import type { UserRole } from "@/shared/types";

const ROLE_CLAIM_KEY =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

const VALID_ROLES: UserRole[] = ["User", "Admin", "Shipper", "Buyer", "Seller"];

const isUserRole = (value: unknown): value is UserRole => {
  return typeof value === "string" && VALID_ROLES.includes(value as UserRole);
};

const normalizeClaimRoles = (value: unknown): UserRole[] => {
  if (Array.isArray(value)) {
    return value.filter(isUserRole);
  }

  return isUserRole(value) ? [value] : [];
};

const getPreferredRole = (claims: JwtClaims): UserRole | null => {
  const roles = [
    ...normalizeClaimRoles(claims.role),
    ...normalizeClaimRoles(claims.Role),
    ...normalizeClaimRoles(claims[ROLE_CLAIM_KEY]),
  ];

  if (!roles.length) return null;
  if (roles.includes("Admin")) return "Admin";
  return roles[0];
};

type JwtClaims = JwtPayload & {
  role?: UserRole | UserRole[];
  Role?: UserRole | UserRole[];
  [ROLE_CLAIM_KEY]?: UserRole | UserRole[];
};

export const useRegisterMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (userData: {
      fullName: string;
      email: string;
      password: string;
      phoneNumber: string;
      userName: string;
    }) => authService.register(userData),
    onSuccess: () => {
      toast.success("Dang ki thanh cong!", {
        description: "Vui long dang nhap de tiep tuc",
      });
      navigate("/login");
    },
    onError: (
      error: AxiosError<{
        errors?: Record<string, string[]>;
        title?: string;
        message?: string;
      }>,
    ) => {
      const validationErrors = error.response?.data?.errors as
        | Record<string, string[]>
        | undefined;
      const firstValidationMessage = validationErrors
        ? Object.values(validationErrors).flat()[0]
        : undefined;

      toast.error(
        firstValidationMessage ||
          error.response?.data?.title ||
          error.response?.data?.message ||
          "Dang ki that bai, vui long thu lai",
      );
    },
    onSettled: () => {
      //co the dung de reset form hoac cac thao tac cleanup khac
    },
  });
};
export const useLoginMutation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/profile";
  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: (data) => authService.login(data),
    onSuccess: (response) => {
      const decoded = jwtDecode<JwtClaims>(response.access_token);
      const role = getPreferredRole(decoded);
      setAuth({
        access_token: response.access_token,
        userId: response.userId,
        role,
      });
      toast.success("Đăng nhập thành công");
      // Redirect dựa trên role, Admin/Shipper vào trang admin area
      if (role === "Admin" || role === "Shipper") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    },
  });
};
export const useLogoutMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => authService.logout(),

    onSuccess: () => {
      // 1. xoá token
      clearAuth();

      // 2. xoá toàn bộ cache react-query
      queryClient.clear();

      // 3. scroll to top then redirect về login
      if (typeof window !== "undefined") {
        try {
          window.scrollTo({ top: 0, left: 0 });
        } catch {
          // ignore
        }
      }
      navigate("/login");
      toast.info("Đăng xuất thành công");
    },

    onError: () => {
      // Dù API lỗi vẫn logout để đảm bảo UX
      clearAuth();
      queryClient.clear();
      if (typeof window !== "undefined") {
        try {
          window.scrollTo({ top: 0, left: 0 });
        } catch {
          // ignore
        }
      }
      navigate("/login");
    },
  });
};
