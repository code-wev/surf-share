import Image from "next/image";
import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="mx-auto grid h-screen w-full items-center gap-39 px-36 py-12.5 lg:grid-cols-[0.9fr_1fr]">
      <div className="mx-auto hidden h-full w-full lg:block">
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
      <div className="mx-auto flex w-full items-center">{children}</div>
    </div>
  );
}
