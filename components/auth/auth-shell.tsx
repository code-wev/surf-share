import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AuthShellProps = {
  children: ReactNode;
  rightScrollable?: boolean;
  contentAlign?: "center" | "start";
};

export function AuthShell({
  children,
  rightScrollable = false,
  contentAlign = "center",
}: AuthShellProps) {
  return (
    <div
      className={cn(
        "mx-auto grid min-h-screen w-full items-center px-4 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12 lg:h-screen lg:grid-cols-[0.9fr_1fr] lg:gap-12 lg:px-16 lg:py-10 xl:gap-24 xl:px-24 2xl:gap-39 2xl:px-36 2xl:py-12.5",
        rightScrollable && "lg:overflow-hidden",
      )}
    >
      <div className="mx-auto hidden h-full w-full lg:sticky lg:top-0 lg:block">
        <div className="relative h-full overflow-hidden rounded-sm border border-brand-weak">
          <Image
            src="/auth/login1.png"
            alt="Surfing visual"
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
      <div
        className={cn(
          "mx-auto flex w-full max-w-170 lg:max-w-none",
          contentAlign === "center" ? "items-center" : "items-start",
          rightScrollable && "no-scrollbar lg:h-full lg:overflow-y-auto lg:pr-1 xl:pr-2",
        )}
      >
        {children}
      </div>
    </div>
  );
}
