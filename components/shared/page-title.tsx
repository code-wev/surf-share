import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageTitleProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  subtitlePosition?: "top" | "bottom";
  subtitleUppercase?: boolean;
  beforeTitle?: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  align?: "start" | "center";
  className?: string;
  beforeTitleClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export function PageTitle({
  title,
  subtitle,
  subtitlePosition = "bottom",
  subtitleUppercase = false,
  beforeTitle,
  as = "h2",
  align = "start",
  className,
  beforeTitleClassName,
  titleClassName,
  subtitleClassName,
}: PageTitleProps) {
  const Heading = as;
  const hasSubtitle = subtitle !== null && subtitle !== undefined;
  const showSubtitleOnTop = hasSubtitle && subtitlePosition === "top";
  const showSubtitleOnBottom = hasSubtitle && subtitlePosition === "bottom";

  const subtitleTransformClass = subtitleUppercase ? "tracking-[0.14em] uppercase" : undefined;

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "flex gap-3",
          align === "center" ? "items-center justify-center" : "items-start justify-start",
        )}
      >
        {beforeTitle ? (
          <div className={cn("mt-1 shrink-0", beforeTitleClassName)}>{beforeTitle}</div>
        ) : null}

        <div className={cn("min-w-0 space-y-2", align === "center" ? "text-center" : "text-left")}>
          {showSubtitleOnTop ? (
            <p
              className={cn(
                "text-base leading-7 text-pretty text-(--color-text-weak)",
                subtitleTransformClass,
                subtitleClassName,
              )}
            >
              {subtitle}
            </p>
          ) : null}

          <Heading
            className={cn(
              "text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl",
              titleClassName,
            )}
          >
            {title}
          </Heading>

          {showSubtitleOnBottom ? (
            <p
              className={cn(
                "text-base leading-7 text-pretty text-(--color-text-weak)",
                subtitleTransformClass,
                subtitleClassName,
              )}
            >
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
