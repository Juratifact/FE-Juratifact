import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { AuthActions, AuthState } from "./types";

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set) => ({
        access_token: null,
        userId: null,
        role: null,
        roles: [],
        isVerify: false,

        setAuth: ({ access_token, userId, role, roles, isVerify }) =>
          set({
            access_token,
            userId,
            role,
            roles: roles ?? (role ? [role] : []),
            isVerify: isVerify ?? false,
          }),

        setIsVerify: (isVerify) => set({ isVerify }),

        clearAuth: () =>
          set({
            access_token: null,
            userId: null,
            role: null,
            roles: [],
            isVerify: false,
          }),
      }),
      {
        name: "shopping-auth-storage", // key trong localStorage
        storage: createJSONStorage(() => localStorage), // su dung localStorage
      },
    ),
  ),
);
