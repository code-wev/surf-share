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

export type DemoRole = "user" | "contributor" | "moderator" | "admin";

export type DemoSession = {
  email: string;
  role: DemoRole;
  name: string;
};

export type DemoUserProfile = {
  fullName: string;
  country: string;
  phone: string;
  email: string;
  address: string;
  avatarSrc: string;
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

const DEMO_USER_PROFILES: Record<string, DemoUserProfile> = {
  "user@surfshare.demo": {
    fullName: "Demo User",
    country: "United States",
    phone: "+1 714-242-888",
    email: "user@surfshare.demo",
    address: "1915 Pacific Coast Hwy, Huntington Beach, CA 92648",
    avatarSrc: "/home/latest/latest15.jpg",
  },
  "contributor@surfshare.demo": {
    fullName: "Demo Contributor",
    country: "Australia",
    phone: "+61 2 9123 4567",
    email: "contributor@surfshare.demo",
    address: "8 Campbell Parade, Bondi Beach NSW 2026",
    avatarSrc: "/home/latest/latest15.jpg",
  },
  "moderator@surfshare.demo": {
    fullName: "Demo Moderator",
    country: "Portugal",
    phone: "+351 21 456 7890",
    email: "moderator@surfshare.demo",
    address: "Av. Marginal 1200, Carcavelos 2775-604",
    avatarSrc: "/home/latest/latest15.jpg",
  },
  "admin@surfshare.demo": {
    fullName: "Demo Admin",
    country: "Indonesia",
    phone: "+62 361 555 888",
    email: "admin@surfshare.demo",
    address: "Jalan Pantai Batu Bolong 24, Canggu, Bali 80361",
    avatarSrc: "/home/latest/latest15.jpg",
  },
};

const DEMO_AUTH_STORAGE_KEY = "surf-share-demo-session";

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const DEMO_ROLES: DemoRole[] = ["user", "contributor", "moderator", "admin"];

function normalizeEmail(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
}

function isDemoRole(value: unknown): value is DemoRole {
  return typeof value === "string" && DEMO_ROLES.includes(value as DemoRole);
}

function isDemoSession(value: unknown): value is DemoSession {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<DemoSession>;
  return (
    typeof candidate.email === "string" &&
    Boolean(candidate.email.trim()) &&
    isDemoRole(candidate.role) &&
    typeof candidate.name === "string" &&
    Boolean(candidate.name.trim())
  );
}

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

  useIsomorphicLayoutEffect(() => {
    try {
      const rawSession = localStorage.getItem(DEMO_AUTH_STORAGE_KEY);
      if (!rawSession) {
        setIsHydrated(true);
        return;
      }

      const parsedSession: unknown = JSON.parse(rawSession);
      if (isDemoSession(parsedSession)) {
        setSession(parsedSession);
      } else {
        localStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
      }
    } catch {
      localStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const login = useCallback((email: string, password: string) => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || typeof password !== "string") {
      return null;
    }

    const matchedCredential = DEMO_CREDENTIALS.find(
      (credential) =>
        normalizeEmail(credential.email) === normalizedEmail && credential.password === password,
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

export function isDashboardRole(role: DemoRole) {
  return role === "moderator" || role === "admin";
}

export function getRoleHomePath(role: DemoRole) {
  return isDashboardRole(role) ? "/dashboard" : "/profile";
}

export function getDemoUserProfile(session: DemoSession | null): DemoUserProfile | null {
  if (!session) {
    return null;
  }

  const normalizedEmail = normalizeEmail(session.email);

  if (!normalizedEmail) {
    return null;
  }

  const mappedProfile = DEMO_USER_PROFILES[normalizedEmail];

  if (mappedProfile) {
    return mappedProfile;
  }

  return {
    fullName: session.name,
    country: "",
    phone: "",
    email: session.email,
    address: "",
    avatarSrc: "/home/latest/latest15.jpg",
  };
}
