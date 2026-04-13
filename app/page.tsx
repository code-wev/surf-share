import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { PageTitle } from "@/components/shared/page-title";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const stack = [
  {
    title: "UI Foundation",
    description:
      "Tailwind v4, reusable components, and class variance utilities for scalable design systems.",
  },
  {
    title: "Data Layer",
    description:
      "Axios API client and React Query setup ready for backend integration when your APIs are live.",
  },
  {
    title: "Validation + Forms",
    description:
      "Zod and React Hook Form are pre-installed for type-safe forms and client-side workflows.",
  },
  {
    title: "Theme + UX",
    description:
      "Global providers include theme management and toast notifications for product-grade feedback loops.",
  },
  {
    title: "Production Guardrails",
    description:
      "Error boundaries, loading states, robots, sitemap, linting, and formatting are already wired.",
  },
  {
    title: "Team Workflow",
    description:
      "Consistent scripts for lint, typecheck, and format make daily frontend development predictable.",
  },
];

const projectStructure = [
  "app/",
  "components/layout",
  "components/shared",
  "components/ui",
  "config/",
  "lib/api",
  "lib/query",
  "types/",
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden pb-24 pt-16 sm:pb-28 sm:pt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
      </div>

      <Container className="relative space-y-20 sm:space-y-24">
        <section id="overview" className="space-y-8">
          <PageTitle
            eyebrow="Production Frontend Starter"
            title="Your Next.js project is now structured for serious frontend work"
            description="The base architecture is ready so you can focus on features, pages, and UI quality instead of setup overhead."
          />

          <div className="flex flex-wrap gap-3">
            <Link href="#project-structure" className={buttonVariants({ size: "lg" })}>
              Review Structure
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="#stack"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Installed Stack
            </Link>
          </div>
        </section>

        <section
          id="stack"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {stack.map((item, index) => (
            <article
              key={item.title}
              className="rounded-2xl border border-border/70 bg-background/85 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] opacity-0 animate-[fade-up_600ms_ease-out_forwards]"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600" />
                <h2 className="text-sm font-semibold tracking-wide">{item.title}</h2>
              </div>
              <p className="text-sm leading-6 text-foreground/70">{item.description}</p>
            </article>
          ))}
        </section>

        <section
          id="project-structure"
          className="grid gap-8 rounded-3xl border border-border/80 bg-background/90 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.07)] md:grid-cols-2 md:p-8"
        >
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold tracking-tight">
              Project structure is ready for production scale
            </h3>
            <p className="text-sm leading-7 text-foreground/70 sm:text-base">
              The project is organized with clear separation of concerns so features can
              grow without turning into a monolith.
            </p>
            <p className="text-sm leading-7 text-foreground/70 sm:text-base">
              Start building pages in app routes and keep shared frontend logic inside
              reusable modules.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-muted/70 p-4 sm:p-5">
            <ul className="space-y-2">
              {projectStructure.map((item) => (
                <li
                  key={item}
                  className={cn(
                    "rounded-md border border-border/70 bg-background px-3 py-2 text-sm font-medium text-foreground/85",
                  )}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Container>
    </main>
  );
}
