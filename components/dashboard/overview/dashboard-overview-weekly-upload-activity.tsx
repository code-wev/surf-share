"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { WeeklyUploadBar } from "@/components/dashboard/overview/dashboard-overview-types";

type DashboardOverviewWeeklyUploadActivityProps = {
  bars: WeeklyUploadBar[];
  yTicks: number[];
};

export default function DashboardOverviewWeeklyUploadActivity({
  bars,
  yTicks,
}: DashboardOverviewWeeklyUploadActivityProps) {
  const chartData = bars.map((bar) => ({
    name: bar.dayLabel,
    uploads: bar.uploads,
  }));

  return (
    <section className="flex h-full flex-col">
      <h2 className="text-text-strong text-[20px] leading-tight font-semibold sm:text-[24px] lg:text-[28px]">
        Weekly Upload Activity
      </h2>

      <div className="border-line-weaker bg-surface-muted-100 mt-3 flex-1 rounded-sm border p-2 sm:p-3">
        <div className="h-64 w-full sm:h-72 md:h-80 lg:h-90 xl:h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 24, right: 12, bottom: 0, left: -20 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#495262", fontSize: 11 }}
                axisLine={{ stroke: "#495262" }}
              />
              <YAxis
                ticks={yTicks}
                tick={{ fill: "#495262", fontSize: 11 }}
                axisLine={{ stroke: "#495262" }}
              />
              <Tooltip
                cursor={false}
                contentStyle={{
                  backgroundColor: "#1a1a2e",
                  border: "1px solid #495262",
                  borderRadius: 4,
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
                labelStyle={{ color: "#fff" }}
                formatter={(value) => [value ?? 0, "Uploads"]}
              />
              <Bar dataKey="uploads" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#1D9CD2" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
