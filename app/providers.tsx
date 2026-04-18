"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import { DemoAuthProvider } from "@/lib/demo-auth";
import { makeQueryClient } from "@/lib/query/query-client";
import ContentProtectionGuard from "@/components/shared/content-protection-guard";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(makeQueryClient);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <DemoAuthProvider>
        <QueryClientProvider client={queryClient}>
          <ContentProtectionGuard />
          {children}
          <Toaster richColors position="top-right" closeButton />
        </QueryClientProvider>
      </DemoAuthProvider>
    </ThemeProvider>
  );
}
