import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ContributeHeroSection() {
  return (
    <section className="bg-brand-disabled">
      <div className="mx-auto max-w-470 px-4 py-14 text-center sm:px-6 sm:py-16 md:px-10 md:py-20 lg:px-12.5 lg:py-22 2xl:py-25">
        <h1 className="text-3xl font-bold leading-tight text-brand-default sm:text-4xl lg:text-[64px] lg:leading-[1.08]">
          Start Earning From Your Surf Photography
        </h1>

        <p className="mx-auto mt-3 max-w-360 text-sm leading-6 text-text-weak sm:mt-4 sm:text-base sm:leading-7 lg:mt-6 lg:text-[28px] lg:leading-tight">
          Upload your shots, earn money and help share the stoke.
        </p>

        <Link
          href="/signup"
          className="mt-8 inline-flex items-center gap-2 rounded-sm bg-brand-default px-5 py-2.5 text-sm font-medium text-text-inverse-strong transition-colors hover:bg-brand-hover sm:mt-10 lg:mt-12"
        >
          Become a Contributor
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
