import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageTitleProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  className?: string;
};

export function PageTitle({
  eyebrow,
  title,
  description,
  className,
}: PageTitleProps) {
  return (
    <div className={cn("max-w-3xl space-y-5", className)}>
      {eyebrow ? (
        <p className="inline-flex rounded-full border border-foreground/20 bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/80">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      {description ? (
        <p className="text-pretty text-base leading-7 text-foreground/75 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
