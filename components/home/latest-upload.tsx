import Link from "next/link";
import { PageTitle } from "../shared/page-title";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export default function LatestUpload() {
  return (
    <section className="mb-24 px-4 sm:px-6 md:mx-12.5 md:px-0">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <PageTitle
          subtitle="Destinations"
          subtitlePosition="top"
          title="Featured Locations"
          titleClassName="mt-2 text-5xl! text-(--color-text-strong) sm:text-6xl!"
          subtitleClassName="text-xl! text-(--color-text-weak) sm:text-[34px]!"
        />

        <Link href="/properties">
          <Button className="border-(--color-line-weaker)font-medium cursor-pointer border bg-transparent text-(--color-text-brand-strong) transition-colors hover:bg-(--color-fill-hover)">
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
