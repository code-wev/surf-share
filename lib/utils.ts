import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAbsoluteImageUrl(value: string | undefined | null): string {
  if (!value) return "";
  
  if (/^https?:\/\//i.test(value) || value.startsWith("data:")) {
    return value;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
  
  // Extract origin (e.g., http://localhost:5000) from the api base URL
  let origin = "";
  try {
    origin = new URL(baseUrl).origin;
  } catch {
    origin = "http://localhost:5000";
  }

  if (value.startsWith("/")) {
    return `${origin}${value}`;
  }

  return `${origin}/${value}`;
}
