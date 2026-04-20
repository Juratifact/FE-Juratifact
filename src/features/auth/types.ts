import type { UserRole } from "@/shared/types";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}
export interface User {
  id: string;
  email: string;
  fullName?: string;
  phone?: string;
  birthday?: string;
  profilePicture?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  // ... other fields
}
export interface RegisterDto {
  email: string;
  password: string;
  fullName?: string;
  date_of_birth?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  subcription?: {
    hasActiveSubscription: boolean;
    subscriptionType?: string;
  };
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
}
export interface AuthState {
  accessToken: string | null;
  role: UserRole | null;
}
export interface AuthActions {
  setAuth: (payload: { accessToken: string; role: UserRole | null }) => void;
  clearAuth: () => void;
}
export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
