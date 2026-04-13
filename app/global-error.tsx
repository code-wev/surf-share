"use client";

import { Button } from "@/components/ui/button";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-4 text-center text-foreground sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
          Global Error
        </p>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          A critical error occurred
        </h1>
        <p className="max-w-xl text-sm leading-7 text-foreground/70 sm:text-base">
          {error.message || "An unexpected error occurred at the app level."}
        </p>
        <Button size="lg" onClick={reset}>
          Reload App
        </Button>
      </body>
    </html>
  );
}
