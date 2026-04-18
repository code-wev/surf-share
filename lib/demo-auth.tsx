"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type DemoRole = "user" | "contributor" | "moderator" | "admin";

export type DemoSession = {
  email: string;
  role: DemoRole;
  name: string;
};

type DemoCredential = DemoSession & {
  password: string;
};

export const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    email: "user@surfshare.demo",
    password: "Demo@1234",
    role: "user",
    name: "Demo User",
  },
  {
    email: "contributor@surfshare.demo",
    password: "Demo@1234",
    role: "contributor",
    name: "Demo Contributor",
  },
  {
    email: "moderator@surfshare.demo",
    password: "Demo@1234",
    role: "moderator",
    name: "Demo Moderator",
  },
  {
    email: "admin@surfshare.demo",
    password: "Demo@1234",
    role: "admin",
    name: "Demo Admin",
  },
];

const DEMO_AUTH_STORAGE_KEY = "surf-share-demo-session";

type DemoAuthContextValue = {
  session: DemoSession | null;
  isHydrated: boolean;
  login: (email: string, password: string) => DemoSession | null;
  logout: () => void;
};

const DemoAuthContext = createContext<DemoAuthContextValue | null>(null);

type DemoAuthProviderProps = {
  children: ReactNode;
};

export function DemoAuthProvider({ children }: DemoAuthProviderProps) {
  const [session, setSession] = useState<DemoSession | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const rawSession = localStorage.getItem(DEMO_AUTH_STORAGE_KEY);
      if (!rawSession) {
        setIsHydrated(true);
        return;
      }

      const parsedSession = JSON.parse(rawSession) as DemoSession;
      if (parsedSession?.email && parsedSession?.role) {
        setSession(parsedSession);
      }
    } catch {
      localStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const login = useCallback((email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    const matchedCredential = DEMO_CREDENTIALS.find(
      (credential) =>
        credential.email.toLowerCase() === normalizedEmail && credential.password === password,
    );

    if (!matchedCredential) {
      return null;
    }

    const nextSession: DemoSession = {
      email: matchedCredential.email,
      role: matchedCredential.role,
      name: matchedCredential.name,
    };

    localStorage.setItem(DEMO_AUTH_STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);

    return nextSession;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      isHydrated,
      login,
      logout,
    }),
    [isHydrated, login, logout, session],
  );

  return <DemoAuthContext.Provider value={value}>{children}</DemoAuthContext.Provider>;
}

export function useDemoAuth() {
  const context = useContext(DemoAuthContext);

  if (!context) {
    throw new Error("useDemoAuth must be used within DemoAuthProvider");
  }

  return context;
}