import {
  chartLabels,
  chartValues,
  overviewStats,
  topContributors,
  yTicks,
} from "@/components/dashboard/overview/dashboard-overview-data";
import DashboardOverviewEarningsChart from "@/components/dashboard/overview/dashboard-overview-earnings-chart";
import DashboardOverviewHeader from "@/components/dashboard/overview/dashboard-overview-header";
import DashboardOverviewStatsGrid from "@/components/dashboard/overview/dashboard-overview-stats-grid";
import DashboardOverviewTopContributors from "@/components/dashboard/overview/dashboard-overview-top-contributors";

export default function DashboardOverviewContent() {
  return (
    <section className="h-full px-3 py-4 sm:px-4 sm:py-5 md:px-5 lg:px-6 lg:py-6 xl:px-7 2xl:py-3 2xl:pr-12.5">
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