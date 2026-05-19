import { TrendingUp } from "lucide-react";

import type { OverviewStat } from "@/components/dashboard/overview/dashboard-overview-types";

type DashboardOverviewStatsGridProps = {
  stats: OverviewStat[];
};

export default function DashboardOverviewStatsGrid({ stats }: DashboardOverviewStatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:gap-5 xl:grid-cols-4 xl:gap-6">
      {stats.map((item) => (
        <article
          key={item.label}
          className="border-line-weaker bg-surface-muted-100 rounded-sm border p-3 sm:p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="bg-brand-disabled text-brand-default inline-flex h-8 w-8 items-center justify-center rounded-md sm:h-9 sm:w-9">
              {item.Icon ? <item.Icon size={13} className="sm:h-3.5 sm:w-3.5" /> : null}
            </div>

            <div className="flex flex-col items-end gap-1">
              {item.trendLabel ? (
                <button
                  type="button"
                  className="text-text-weaker inline-flex items-center gap-1 text-[11px] sm:text-xs"
                >
                  All Time
                </button>
              ) : null}

              {item.trendLabel && item.trendTone ? (
                <span
                  className={`inline-flex items-center rounded px-1.5 py-0.5 text-[12px] font-medium ${
                    item.trendTone === "positive"
                      ? "bg-success-disable text-success-strong"
                      : "bg-danger-weaker text-danger-strong"
                  }`}
                >
                  <TrendingUp size={10} className="mr-1" />
                  {item.trendLabel}
                </span>
              ) : null}
            </div>
          </div>

          <p className="text-text-strong mt-5 text-[22px] leading-none sm:mt-6 sm:text-[24px]">
            {item.value}
          </p>
          <p className="text-text-weak mt-1 text-[11px] sm:text-xs">{item.label}</p>
        </article>
      ))}
    </div>
  );
}
