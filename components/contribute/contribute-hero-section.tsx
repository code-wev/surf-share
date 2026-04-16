import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ContributeHeroSection() {
  return (
    <section className="bg-[#DBEAFE]">
      <div className="flex flex-col items-center px-12.5 py-25 text-center">
        <h1 className="text-3xl font-bold leading-tight text-brand-default sm:text-4xl lg:text-[64px] lg:leading-[1.08]">
          Start Earning From Your Surf Photography
        </h1>

        <p className="mt-6 text-base leading-7 text-text-weak lg:text-[28px]">
          Join our community of professional surf photographers.
          <br className="hidden sm:block" />
          Upload your shots, earn money, and help surfers find their perfect moments.
        </p>

        <Link
          href="/signup"
          className="mt-12 inline-flex items-center gap-2 rounded-sm bg-brand-default px-5 py-2.5 text-sm font-medium text-text-inverse-strong transition-colors hover:bg-brand-hover"
        >
          Become a Contributor
          <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
