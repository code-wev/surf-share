import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ImageCardProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  info?: ReactNode;
  actions?: ReactNode;
  revealOnHover?: boolean;
  className?: string;
  imageClassName?: string;
  shadeClassName?: string;
  infoClassName?: string;
  actionsClassName?: string;
};

export default function ImageCard({
  src,
  alt,
  width,
  height,
  info,
  actions,
  revealOnHover = true,
  className,
  imageClassName,
  shadeClassName,
  infoClassName,
  actionsClassName,
}: ImageCardProps) {
  const revealClassName = revealOnHover
    ? "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
    : "opacity-100";

  return (
    <article
      className={cn("group relative w-full overflow-hidden", className)}
      tabIndex={revealOnHover ? 0 : undefined}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "block h-auto w-full object-cover transition-transform duration-500 group-focus-within:scale-[1.02] group-hover:scale-[1.02]",
          imageClassName,
        )}
      />

      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300",
          revealOnHover ? "group-focus-within:bg-black/45 group-hover:bg-black/45" : "bg-black/45",
          shadeClassName,
        )}
      />

      {actions ? (
        <div
          className={cn(
            "absolute top-4 right-4 z-10 transition-opacity duration-300",
            revealClassName,
            actionsClassName,
          )}
        >
          {actions}
        </div>
      ) : null}

      {info ? (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black/75 via-black/35 to-transparent p-4 text-white transition-opacity duration-300",
            revealClassName,
            infoClassName,
          )}
        >
          {info}
        </div>
      ) : null}
    </article>
  );
}
