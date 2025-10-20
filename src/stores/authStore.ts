import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/axios";
import { User, LoginRequest, LoginResponse } from "@/types";
import { queryClient } from "@/lib/queryClient";

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean; // 👈 para saber si ya cargó del localStorage
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  clearError: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      hasHydrated: false,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<LoginResponse>(
            "/auth/login",
            credentials
          );
          const { access_token, refresh_token, usuario } = response.data;

          localStorage.setItem("token", access_token);
          localStorage.setItem("refreshToken", refresh_token);

          set({
            user: usuario,
            token: access_token,
            refreshToken: refresh_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Error al iniciar sesión";
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        queryClient.clear();

        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuth: () => {
        const token = localStorage.getItem("token");
        const user = get().user;
        if (token && user) {
          set({ isAuthenticated: true });
        } else {
          set({ isAuthenticated: false });
        }
      },

      clearError: () => set({ error: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
