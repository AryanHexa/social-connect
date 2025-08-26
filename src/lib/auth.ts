import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  email: string;
  username?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData?: any) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      login: (token: string, userData?: any) => {
        try {
          const decoded = jwtDecode(token) as any;
          const user: User = {
            id: decoded.sub || decoded.id || userData?.id,
            email: decoded.email || userData?.email,
            username: decoded.username || userData?.username,
            role: decoded.role || userData?.role,
          };
          set({ user, token, isAuthenticated: true });
        } catch (error) {
          console.error("Failed to decode token:", error);
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
