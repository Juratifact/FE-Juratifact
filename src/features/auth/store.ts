import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { AuthActions, AuthState } from "./types";

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set) => ({
        access_token: null,
        role: null,

        setAuth: ({ access_token, role }) =>
          set({
            access_token,
            role,
          }),

        clearAuth: () =>
          set({
            access_token: null,
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
