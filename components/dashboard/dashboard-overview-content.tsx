"use client";

import { getOverviewStatsByRole } from "@/components/dashboard/overview/dashboard-overview-data";
import DashboardOverviewEarningsChart from "@/components/dashboard/overview/dashboard-overview-earnings-chart";
import DashboardOverviewHeader from "@/components/dashboard/overview/dashboard-overview-header";
import DashboardOverviewStatsGrid from "@/components/dashboard/overview/dashboard-overview-stats-grid";
import DashboardOverviewTopContributors from "@/components/dashboard/overview/dashboard-overview-top-contributors";
import DashboardOverviewTopLocations from "@/components/dashboard/overview/dashboard-overview-top-locations";
import DashboardOverviewWeeklyUploadActivity from "@/components/dashboard/overview/dashboard-overview-weekly-upload-activity";
import { useAuth } from "@/lib/auth";
import { useDashboardStatsQuery } from "@/hooks/api/useDashboard";
import type {
  WeeklyUploadBar,
  TrendTone,
} from "@/components/dashboard/overview/dashboard-overview-types";
import { Loader2 } from "lucide-react";

type BackendStat = {
  label: string;
  value: string;
  trendLabel?: string;
  trendTone?: TrendTone;
};

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

  // Dynamic yTicks for Earnings Chart
  const maxEarnings = Math.max(...chartValues, 100);
  const roundedMaxEarnings = Math.ceil(maxEarnings / 100) * 100;
  const earningsYTicks = [0, 0.25, 0.5, 0.75, 1].map((r) => Math.round(roundedMaxEarnings * r));

  // Dynamic yTicks for Weekly Upload Chart
  const weeklyUploadActivity: WeeklyUploadBar[] = data.weeklyUploadActivity ?? [];
  const maxUploads = Math.max(...weeklyUploadActivity.map((d: WeeklyUploadBar) => d.uploads), 10);
  const roundedMaxUploads = Math.ceil(maxUploads / 10) * 10;
  const uploadsYTicks = [0, 0.25, 0.5, 0.75, 1].map((r) => Math.round(roundedMaxUploads * r));

  const statsTemplates = getOverviewStatsByRole(dashboardRole);

  // Create a map of backend stats including trend info
  const backendStatsMap = new Map<string, BackendStat>(
    data.stats.map((item: BackendStat) => [item.label, item]),
  );

  const overviewStats = statsTemplates.map((template) => {
    const backendStat = backendStatsMap.get(template.label);
    return {
      ...template,
      value: backendStat?.value ?? template.value,
      trendLabel: backendStat?.trendLabel ?? template.trendLabel,
      trendTone: backendStat?.trendTone ?? template.trendTone,
    };
  });

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
            yTicks={earningsYTicks}
          />

          {isAdmin ? (
            <>
              <DashboardOverviewWeeklyUploadActivity
                bars={weeklyUploadActivity}
                yTicks={uploadsYTicks}
              />
              <DashboardOverviewTopContributors contributors={data.topContributors} />
              <DashboardOverviewTopLocations locations={data.topLocations || []} />
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
