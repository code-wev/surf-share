"use client";

import {
  chartLabels,
  chartValues,
  getOverviewStatsByRole,
  topContributors,
  yTicks,
} from "@/components/dashboard/overview/dashboard-overview-data";
import DashboardOverviewEarningsChart from "@/components/dashboard/overview/dashboard-overview-earnings-chart";
import DashboardOverviewHeader from "@/components/dashboard/overview/dashboard-overview-header";
import DashboardOverviewStatsGrid from "@/components/dashboard/overview/dashboard-overview-stats-grid";
import DashboardOverviewTopContributors from "@/components/dashboard/overview/dashboard-overview-top-contributors";
import { useDemoAuth } from "@/lib/demo-auth";

export default function DashboardOverviewContent() {
  const { session } = useDemoAuth();
  const dashboardRole = session?.role === "admin" ? "admin" : "moderator";
  const overviewStats = getOverviewStatsByRole(dashboardRole);

  return (
    <section className="px-3 pb-5 sm:px-4 sm:pb-6 md:px-6 md:pb-8 lg:px-0 lg:pr-10 lg:pb-10 xl:pr-12.5 xl:pb-12.5">
      <div className="mx-auto w-full max-w-420">
        <DashboardOverviewHeader />

        <DashboardOverviewStatsGrid stats={overviewStats} />

        <div className="mt-10 grid grid-cols-1 items-stretch gap-5 sm:mt-12 lg:mt-14 lg:gap-6 xl:mt-16 xl:auto-rows-fr xl:grid-cols-[1fr_1fr] xl:gap-4">
          <DashboardOverviewEarningsChart labels={chartLabels} values={chartValues} yTicks={yTicks} />

          <DashboardOverviewTopContributors contributors={topContributors} />
        </div>
      </div>
    </section>
  );
}