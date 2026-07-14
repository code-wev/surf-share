"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

type AvatarProps = {
  src?: string | null;
  alt?: string;
  size?: number;
  className?: string;
  fallback?: string;
};

export default function Avatar({
  src,
  alt,
  size = 40,
  className,
  fallback = "/home/latest/latest1.jpg",
}: AvatarProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(src || fallback);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentSrc(src || fallback);
  }, [src, fallback]);

  return (
    // next/image supports onError to handle broken images
    <Image
      src={currentSrc}
      alt={alt || "avatar"}
      width={size}
      height={size}
      className={className}
      onError={() => setCurrentSrc(fallback)}
    />
  );
}
