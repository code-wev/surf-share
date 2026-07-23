"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import { AuthProvider } from "@/lib/auth";
import { makeQueryClient } from "@/lib/query/query-client";
import AuthRouteGuard from "@/components/shared/auth-route-guard";
import ContentProtectionGuard from "@/components/shared/content-protection-guard";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(makeQueryClient);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test";

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <ContentProtectionGuard />
            <AuthRouteGuard />
            <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "USD" }}>
              {children}
            </PayPalScriptProvider>
            <Toaster richColors position="top-right" closeButton offset={{ top: 60 }} />
          </QueryClientProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
}
