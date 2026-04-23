import apiClient from "@/lib/axios";
import type { RegisterDto, LoginRequest, AuthResponse } from "./types";
import { API_ENDPOINTS } from "@/shared/constants";
//1> dinh nghia

export const authService = {
  //Login
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient.get<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      params: credentials,
    }) as unknown as Promise<AuthResponse>;
  },
  async register(data: RegisterDto): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append("Email", data.email);
    formData.append("FullName", data.fullName ?? "");
    formData.append("Password", data.password);
    formData.append("PhoneNumber", data.phoneNumber);

    if (data.userName?.trim()) {
      formData.append("UserName", data.userName.trim());
    }

    return apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }) as unknown as Promise<AuthResponse>;
  },
  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },
};
