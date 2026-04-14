import Link from "next/link";
import { PageTitle } from "../shared/page-title";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export default function IsPhotographer() {
  return (
    <section className="bg-(--color-text-brand-strong)">
      <div className="x-4 py-10 sm:px-6 md:mx-12.5 md:px-0 md:py-25">
        <PageTitle
          align="center"
          title="Are you a photographer?"
          subtitle="Turn your passion for surf photography into a revenue stream. Upload your session shots and get paid when surfers find themselves "
          titleClassName="mt-2 text-4xl text-(--color-text-inverse-strong) sm:text-[42px] md:text-5xl lg:text-[64px]"
          subtitleClassName="text-(--color-text-inverse-weak) text-base! max-w-[800px]! mx-auto"
        />
        <Link href="/login" className="mt-12 flex justify-center">
          <Button className="cursor-pointer border border-(--color-line-weaker) bg-(--color-text-inverse-weak) font-medium text-(--color-text-brand-strong) transition-colors hover:bg-(--color-fill-hover)">
            Start Earning From Your Shots <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
