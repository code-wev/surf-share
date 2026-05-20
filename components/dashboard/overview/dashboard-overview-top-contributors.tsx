import Image from "next/image";

import type { TopContributor } from "@/components/dashboard/overview/dashboard-overview-types";
import { getAbsoluteImageUrl } from "@/lib/utils";

type DashboardOverviewTopContributorsProps = {
  contributors: TopContributor[];
};

export default function DashboardOverviewTopContributors({
  contributors,
}: DashboardOverviewTopContributorsProps) {
  return (
    <section className="flex h-full flex-col">
      <h2 className="text-text-strong text-[20px] leading-tight font-semibold sm:text-[22px]">
        Top Contributors
      </h2>

      <div className="mt-4 flex-1 space-y-2 sm:mt-6 sm:space-y-2.5 md:mt-8 md:space-y-3 xl:mt-9">
        {contributors.map((contributor, index) => (
          <article
            key={`${contributor.id ?? contributor.name ?? "contributor"}-${index}`}
            className="border-line-weaker flex items-center justify-between border-b pb-2 last:border-b-0"
          >
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <Image
                src={
                  contributor.avatarSrc?.trim() ? getAbsoluteImageUrl(contributor.avatarSrc) : ""
                }
                alt={contributor.name}
                width={34}
                height={34}
                className="h-8 w-8 rounded-full object-cover sm:h-9 sm:w-9 lg:h-10 lg:w-10"
              />

              <div className="min-w-0">
                <p className="text-text-strong truncate text-base leading-tight sm:text-lg lg:text-[22px]">
                  {contributor.name}
                </p>
                <p className="text-text-weaker text-[11px] sm:text-[12px]">
                  {contributor.photosLabel}
                </p>
              </div>
            </div>

            <p className="text-brand-default shrink-0 text-base leading-tight font-medium sm:text-lg lg:text-[22px]">
              {contributor.earnings}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
