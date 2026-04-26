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

        setAuth: ({ access_token, userId, role }) =>
          set({
            access_token,
            userId,
            role,
          }),

        clearAuth: () =>
          set({
            access_token: null,
            userId: null,
            role: null,
          }),
      }),
      {
        name: "shopping-auth-storage", // key trong localStorage
        storage: createJSONStorage(() => localStorage), // su dung localStorage
      },
    ),
  ),
);
