"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-7xl flex-col items-center justify-center gap-5 px-4 text-center sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
        Something went wrong
      </p>
      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        An unexpected error interrupted this page
      </h1>
      <p className="max-w-xl text-sm leading-7 text-foreground/70 sm:text-base">
        Try again. If the issue persists, inspect logs and handle the case in a
        route-level error boundary.
      </p>
      <Button size="lg" onClick={reset}>
        Try Again
      </Button>
    </main>
  );
}
