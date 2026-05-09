import type { UserRole } from "@/shared/types";

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
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
  phoneNumber: string;
  userName?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  userId?: string;
  role?: UserRole;
  subcription?: {
    hasActiveSubscription: boolean;
    subscriptionType?: string;
  };
  isVerify?: boolean;
}

export interface RegisterResponse {
  access_token: string;
  refresh_token: string;
}
export interface AuthState {
  access_token: string | null;
  userId: string | null;
  role: UserRole | null;
  isVerify: boolean;
}
export interface AuthActions {
  setAuth: (payload: {
    access_token: string;
    userId?: string;
    role: UserRole | null;
    isVerify?: boolean;
  }) => void;
  setIsVerify: (isVerify: boolean) => void;
  clearAuth: () => void;
}
export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
