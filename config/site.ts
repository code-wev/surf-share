export const siteConfig = {
  name: "Surf Share",
  description:
    "Frontend starter foundation for building production-grade interfaces with Next.js 16.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "/og-image.png",
  links: {
    docs: "#project-structure",
    github: "https://github.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
