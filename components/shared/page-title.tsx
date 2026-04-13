import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageTitleProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function PageTitle({
  eyebrow,
  title,
  description,
  className,
  eyebrowClassName,
  titleClassName,
  descriptionClassName,
}: PageTitleProps) {
  return (
    <div className={cn("space-y-5", className)}>
      {eyebrow ? (
        <p
          className={cn(
            "border-foreground/20 bg-background/80 text-foreground/80 inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.16em] uppercase",
            eyebrowClassName,
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h1
        className={cn(
          "text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl",
          titleClassName,
        )}
      >
        {title}
      </h1>
      {description ? (
        <p
          className={cn(
            "text-foreground/75 text-base leading-7 text-pretty sm:text-lg",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
