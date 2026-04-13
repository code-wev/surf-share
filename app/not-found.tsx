import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-7xl flex-col items-center justify-center gap-5 px-4 text-center sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
        404 Error
      </p>
      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        The page you are looking for does not exist
      </h1>
      <p className="max-w-xl text-sm leading-7 text-foreground/70 sm:text-base">
        The route may have been moved or removed. Return to the homepage and
        continue building your frontend.
      </p>
      <Link href="/" className={cn(buttonVariants({ size: "lg" }), "mt-2")}>
        Back to Home
      </Link>
    </main>
  );
}
