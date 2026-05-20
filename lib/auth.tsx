"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiClient } from "./api/client";

export type Role = "SURFER" | "PHOTOGRAPHER" | "MODERATOR" | "ADMIN";

export type Session = {
  id: string;
  email: string;
  role: Role;
  name: string;
  countryName?: string | null;
  address?: string | null;
  phoneNumber?: string | null;
  paypalEmail?: string | null;
  permissions?: string[];
};

const AUTH_STORAGE_KEY = "surf-share-auth-session";
const TOKEN_STORAGE_KEY = "surf-share-auth-token";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type AuthContextValue = {
  session: Session | null;
  isHydrated: boolean;
  setSessionData: (session: Session, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useIsomorphicLayoutEffect(() => {
    try {
      const rawSession = localStorage.getItem(AUTH_STORAGE_KEY);
      const rawToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      
      if (!rawSession || !rawToken) {
        setIsHydrated(true);
        return;
      }

      const parsedSession: Session = JSON.parse(rawSession);
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${rawToken}`;
      setSession(parsedSession);
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const setSessionData = useCallback((newSession: Session, token: string) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newSession));
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setSession(newSession);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    delete apiClient.defaults.headers.common["Authorization"];
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      isHydrated,
      setSessionData,
      logout,
    }),
    [isHydrated, logout, session, setSessionData],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

export function isDashboardRole(role: Role) {
  return role === "MODERATOR" || role === "ADMIN";
}

export function getRoleHomePath(role: Role) {
  return isDashboardRole(role) ? "/dashboard" : "/profile";
}
