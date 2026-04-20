import apiClient from "@/lib/axios";
import type {
  RegisterDto,
  LoginRequest,
  AuthResponse,
} from "./types";
import { API_ENDPOINTS } from "@/shared/constants";
//1> dinh nghia

export const authService = {
  //Login normalize data -> accessToken/refreshToken
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials,
    ) as unknown as Promise<AuthResponse>;
  },
  async register(data: RegisterDto): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data,
    ) as unknown as Promise<AuthResponse>;
  },
  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },
};
