"use client";

import {
  getOverviewStatsByRole,
  yTicks,
} from "@/components/dashboard/overview/dashboard-overview-data";
import DashboardOverviewEarningsChart from "@/components/dashboard/overview/dashboard-overview-earnings-chart";
import DashboardOverviewHeader from "@/components/dashboard/overview/dashboard-overview-header";
import DashboardOverviewStatsGrid from "@/components/dashboard/overview/dashboard-overview-stats-grid";
import DashboardOverviewTopContributors from "@/components/dashboard/overview/dashboard-overview-top-contributors";
import DashboardOverviewTopLocations from "@/components/dashboard/overview/dashboard-overview-top-locations";
import DashboardOverviewWeeklyUploadActivity from "@/components/dashboard/overview/dashboard-overview-weekly-upload-activity";
import { useAuth } from "@/lib/auth";
import { useDashboardStatsQuery } from "@/hooks/api/useDashboard";
import { Loader2 } from "lucide-react";

export default function DashboardOverviewContent() {
  const { session } = useAuth();
  const { data, isLoading, isError } = useDashboardStatsQuery();

  const dashboardRole = session?.role === "ADMIN" ? "admin" : "moderator";
  const isAdmin = dashboardRole === "admin";

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-brand-default h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-danger-strong p-10 text-center">Failed to load dashboard data.</div>
    );
  }

  const chartLabels = data.chartData.map((point: { label: string }) => point.label);
  const chartValues = data.chartData.map((point: { value: number }) => point.value);
  const statsTemplates = getOverviewStatsByRole(dashboardRole);
  const statsByLabel = new Map<string, string>(
    data.stats.map((item: { label: string; value: string }) => [item.label, item.value]),
  );
  const overviewStats = statsTemplates.map((item) => ({
    ...item,
    value: statsByLabel.get(item.label) ?? item.value,
  }));

  return (
    <section className="px-3 pb-5 sm:px-4 sm:pb-6 md:px-6 md:pb-8 lg:px-0 lg:pr-10 lg:pb-10 xl:pr-12.5 xl:pb-12.5">
      <div className="mx-auto w-full max-w-420">
        <DashboardOverviewHeader />

        <DashboardOverviewStatsGrid stats={overviewStats} />

        <div
          className={`mt-10 grid grid-cols-1 items-stretch gap-5 sm:mt-12 lg:mt-14 lg:gap-6 xl:mt-16 ${
            isAdmin
              ? "xl:grid-cols-[1fr_1fr] xl:gap-8"
              : "xl:auto-rows-fr xl:grid-cols-[1fr_1fr] xl:gap-4"
          }`}
        >
          <DashboardOverviewEarningsChart
            labels={chartLabels}
            values={chartValues}
            yTicks={yTicks}
          />

          {isAdmin ? (
            <>
              <DashboardOverviewWeeklyUploadActivity bars={chartValues} yTicks={yTicks} />
              <DashboardOverviewTopContributors contributors={data.topContributors} />
              <DashboardOverviewTopLocations locations={[]} />
            </>
          ) : (
            <div>
              <DashboardOverviewTopContributors contributors={data.topContributors} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
