import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ContributorReadyCtaSection() {
  return (
    <section className="bg-white">
      <div className="px-4 py-14 text-center sm:px-6 md:px-12.5 md:py-25">
        <h2 className="text-4xl font-bold text-text-strong sm:text-5xl lg:text-[64px]">
          Ready To Start Earning?
        </h2>
        <p className="mt-9 text-base text-text-weak lg:text-[28px]">
          Join SURFSHARE today and start monetizing your surf photography
        </p>

        <Link
          href="/signup"
          className="mt-12 inline-flex items-center gap-2 rounded-sm bg-brand-default px-5 py-2.5 text-sm font-medium text-text-inverse-strong transition-colors hover:bg-brand-hover"
        >
          Create Contributor Account
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
