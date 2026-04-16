import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ContributorReadyCtaSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-470 px-4 py-14 text-center sm:px-6 sm:py-16 md:px-10 md:py-20 lg:px-12.5 lg:py-22 2xl:py-25">
        <h2 className="text-4xl font-bold text-text-strong sm:text-5xl lg:text-[64px]">
          Ready To Start Earning?
        </h2>
        <p className="mt-6 text-sm text-text-weak sm:mt-7 sm:text-base lg:mt-9 lg:text-[28px]">
          Join SURFSHARE today and start monetizing your surf photography
        </p>

        <Link
          href="/signup"
          className="mt-8 inline-flex items-center gap-2 rounded-sm bg-brand-default px-5 py-2.5 text-sm font-medium text-text-inverse-strong transition-colors hover:bg-brand-hover sm:mt-10 lg:mt-12"
        >
          Create Contributor Account
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
