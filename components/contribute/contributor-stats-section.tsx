import { Camera, DollarSign, TrendingUp } from "lucide-react";

import ContributorStatCard from "@/components/contribute/contributor-stat-card";

const contributorStats = [
  {
    value: "500+",
    label: "Active Photographers",
    Icon: TrendingUp,
  },
  {
    value: "$250K+",
    label: "Paid to Contributors",
    Icon: DollarSign,
  },
  {
    value: "50K+",
    label: "Photos Uploaded",
    Icon: Camera,
  },
] as const;

export default function ContributorStatsSection() {
  return (
    <section className="bg-brand-default">
      <div className="mx-auto max-w-470 px-4 py-12 sm:px-6 sm:py-14 md:px-10 md:py-18 lg:px-12.5 lg:py-22 2xl:py-25">
        <div className="mx-auto grid max-w-360 grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3 md:gap-4 lg:gap-6">
          {contributorStats.map((stat) => (
            <ContributorStatCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              Icon={stat.Icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
