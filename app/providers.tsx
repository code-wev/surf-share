"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import { AuthProvider } from "@/lib/auth";
import { makeQueryClient } from "@/lib/query/query-client";
import AuthRouteGuard from "@/components/shared/auth-route-guard";
import ContentProtectionGuard from "@/components/shared/content-protection-guard";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(makeQueryClient);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <ContentProtectionGuard />
          <AuthRouteGuard />
          {children}
          <Toaster richColors position="top-right" closeButton />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
