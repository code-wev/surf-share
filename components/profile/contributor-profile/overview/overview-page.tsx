"use client";

import { Clock3, DollarSign, Download, Images, TrendingUp, Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useAuth } from "@/lib/auth";
import { useMySales } from "@/hooks/api/useSales";

export default function ContributorOverviewPage() {
  const { session } = useAuth();
  const { data, isLoading, isError } = useMySales();

  const overviewStats = data?.stats
    ? [
        {
          label: "Total Earnings",
          value: `A$${data.stats.totalEarnings >= 1000 ? (data.stats.totalEarnings / 1000).toFixed(1) + "k" : data.stats.totalEarnings.toFixed(2)}`,
          Icon: DollarSign,
          trendLabel: data.stats.trends?.earnings || "+ 0%",
          trendTone: (data.stats.trends?.earnings?.includes("+") ? "positive" : "negative") as "positive" | "negative",
        },
        {
          label: "Total Photos",
          value: data.stats.totalPhotos.toString(),
          Icon: Images,
          trendLabel: data.stats.trends?.photos || "+ 0%",
          trendTone: (data.stats.trends?.photos?.includes("+") ? "positive" : "negative") as "positive" | "negative",
        },
        {
          label: "Total Selling Photos",
          value: data.stats.totalSoldPhotos.toString(),
          Icon: Download,
          trendLabel: data.stats.trends?.soldPhotos || "+ 0%",
          trendTone: (data.stats.trends?.soldPhotos?.includes("+") ? "positive" : "negative") as "positive" | "negative",
        },
        {
          label: "Pending Photos",
          value: data.stats.pendingPhotos.toString(),
          Icon: Clock3,
          trendLabel: "+ 0%",
          trendTone: "negative" as const,
        },
      ]
    : [];

  const chartData = data?.chartData || [];
  const maxVal = Math.max(...chartData.map((d) => d.value), 100);
  const roundedMax = Math.ceil(maxVal / 100) * 100;
  const yTicks = [0, roundedMax * 0.25, roundedMax * 0.5, roundedMax * 0.75, roundedMax].map((v) =>
    Math.round(v),
  );

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-brand-default h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-danger-strong flex h-64 items-center justify-center">
        Failed to load overview data.
      </div>
    );
  }

  return (
    <section className="h-full">
      <div className="mx-auto w-full max-w-430">
        <div className="border-brand-default text-brand-default inline-flex items-center border-b pb-1 text-sm font-medium sm:text-base lg:text-lg">
          Overview
        </div>

        <h1 className="text-text-strong my-5 text-[27px] leading-tight font-bold tracking-tight sm:my-6 sm:text-[34px] md:my-7 md:text-[40px] lg:text-[44px] xl:my-8 2xl:text-[48px]">
          Welcome Back, {session?.name ?? "Photographer"}
        </h1>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:gap-5 xl:grid-cols-4 xl:gap-6">
          {overviewStats.map((item) => (
            <article
              key={item.label}
              className="border-line-weaker bg-surface-muted-100 rounded-sm border p-3 sm:p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="bg-brand-disabled text-brand-default inline-flex h-8 w-8 items-center justify-center rounded-md sm:h-9 sm:w-9">
                  <item.Icon size={13} className="sm:h-3.5 sm:w-3.5" />
                </div>

                <div className="flex flex-col items-end gap-1">
                  <button
                    type="button"
                    className="text-text-weaker inline-flex items-center gap-1 text-[11px] sm:text-xs"
                  >
                    All Time
                  </button>

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
                </div>
              </div>

              <p className="text-text-strong mt-5 text-[22px] leading-none sm:mt-6 sm:text-[24px]">
                {item.value}
              </p>
              <p className="text-text-weak mt-1 text-[11px] sm:text-xs">{item.label}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 sm:mt-12 lg:mt-14 lg:gap-6 xl:mt-16 xl:gap-4">
          <section className="flex flex-col">
            <h2 className="text-text-strong text-[20px] leading-tight font-semibold sm:text-[24px] lg:text-[28px]">
              Earnings Overview
            </h2>

            <div className="border-line-weaker bg-surface-muted-100 mt-3 rounded-sm border p-2 sm:p-3">
              <div style={{ width: "100%", height: 360 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 24, right: 12, bottom: 14, left: -20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#495262" />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: "#495262", fontSize: 11 }}
                      axisLine={{ stroke: "#495262" }}
                    />
                    <YAxis
                      domain={[0, roundedMax]}
                      ticks={yTicks}
                      tick={{ fill: "#495262", fontSize: 11 }}
                      axisLine={{ stroke: "#495262" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a2e",
                        border: "1px solid #495262",
                        borderRadius: 4,
                      }}
                      labelStyle={{ color: "#fff" }}
                      formatter={(value) => [value, "Earnings"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#0EA5E9"
                      strokeWidth={3}
                      dot={{ fill: "#FFFFFF", stroke: "#0EA5E9", strokeWidth: 3, r: 5 }}
                      activeDot={{ r: 7 }}
                      isAnimationActive={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
