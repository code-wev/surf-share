import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutCommunityCtaSection() {
  return (
    <section className="">
      <div className="mx-auto max-w-470 px-4 py-14 text-center sm:px-6 sm:py-16 md:px-10 md:py-20 lg:px-12.5 lg:py-22 2xl:py-25">
        <h2 className="text-4xl font-bold text-text-strong sm:text-5xl lg:text-[64px]">Join the Crew</h2>

        <p className="mx-auto mt-4 max-w-300 text-sm leading-6 text-text-weak sm:mt-6 sm:text-base sm:leading-7 lg:mt-9 lg:text-[28px] lg:leading-tight">
          Chasing your shots or sharing your best work — SURFSHARE is where surfers and photographers meet.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4 lg:mt-12">
          <Link
            href="/gallery"
            className="inline-flex h-10 items-center gap-2 rounded-sm bg-brand-default px-5 text-sm font-medium text-text-inverse-strong transition-colors hover:bg-brand-hover"
          >
            Browse Photos
            <ArrowRight size={14} />
          </Link>

          <Link
            href="/contribute"
            className="inline-flex h-10 items-center gap-2 rounded-sm border border-brand-default px-5 text-sm font-medium text-brand-default transition-colors hover:bg-brand-disabled"
          >
            Become a Contributor
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
