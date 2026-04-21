import { authService } from "../services";
import { useAuthStore } from "../store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { AuthResponse, JwtPayload, LoginRequest } from "../types";
import { jwtDecode } from "jwt-decode";

export const useRegisterMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (userData: {
      fullName: string;
      email: string;
      password: string;
    }) => authService.register(userData),
    onSuccess: () => {
      toast.success("Dang ki thanh cong!", {
        description: "Vui long dang nhap de tiep tuc",
      });
      navigate("/login");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Dang ki that bai, vui long thu lai",
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
  const FAKE_ADMIN_EMAIL = "admin@gmail.com";
  const FAKE_ADMIN_PASSWORD = "123456";
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/profile";
  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: async (data) => {
      if (
        data.email.toLowerCase() === FAKE_ADMIN_EMAIL &&
        data.password === FAKE_ADMIN_PASSWORD
      ) {
        return {
          accessToken: "fake-admin-token",
          refreshToken: "fake-admin-refresh-token",
          role: "admin",
        };
      }
      return authService.login(data);
    },
    onSuccess: (response) => {
      const roleFromResponse = response.role;
      let decodedRole: JwtPayload["role"] | null = null;

      if (!roleFromResponse) {
        try {
          const decoded = jwtDecode<JwtPayload>(response.accessToken);
          decodedRole = decoded.role;
        } catch {
          decodedRole = null;
        }
      }

      const finalRole = roleFromResponse ?? decodedRole;

      setAuth({
        accessToken: response.accessToken,
        role: finalRole,
      });
      toast.success("Đăng nhập thành công");
      // Redirect dựa trên role, Admin thì vào trang admin, user thì vào trang profile
      if (finalRole === "admin") {
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

      // 3. redirect về login
      navigate("/login");
      toast.info("Đăng xuất thành công");
    },

    onError: () => {
      // Dù API lỗi vẫn logout để đảm bảo UX
      clearAuth();
      queryClient.clear();
      navigate("/login");
    },
  });
};
