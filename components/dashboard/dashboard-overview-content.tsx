import Image from "next/image";
import {
  ChevronDown,
  Clock3,
  Download,
  Images,
  TrendingUp,
  Users,
} from "lucide-react";

const overviewStats = [
  {
    label: "Total Users",
    value: "12",
    Icon: Users,
    trendLabel: "+ 12%",
    trendTone: "positive" as const,
  },
  {
    label: "Total Photos",
    value: "123",
    Icon: Images,
    trendLabel: "+ 12%",
    trendTone: "positive" as const,
  },
  {
    label: "Downloaded Photos",
    value: "85",
    Icon: Download,
    trendLabel: "+ 12%",
    trendTone: "positive" as const,
  },
  {
    label: "Pending photos",
    value: "10",
    Icon: Clock3,
    trendLabel: "+ 12%",
    trendTone: "negative" as const,
  },
];

const chartLabels = ["Mar 28", "Mar 29", "Mar 30", "Mar 31", "Apr 1", "Apr 2", "Apr 3"];
const chartValues = [120, 145, 133, 168, 154, 178, 156];
const yTicks = [0, 45, 90, 135, 180];

const chartWidth = 760;
const chartHeight = 360;
const chartMargin = {
  top: 14,
  right: 12,
  bottom: 44,
  left: 44,
};

const plotWidth = chartWidth - chartMargin.left - chartMargin.right;
const plotHeight = chartHeight - chartMargin.top - chartMargin.bottom;

const xStep = plotWidth / Math.max(1, chartValues.length - 1);
const xCoordinates = chartValues.map((_, index) => chartMargin.left + index * xStep);

const yToCoordinate = (value: number) => {
  const ratio = (value - yTicks[0]) / (yTicks[yTicks.length - 1] - yTicks[0]);
  return chartMargin.top + plotHeight * (1 - ratio);
};

const chartPoints = chartValues.map((value, index) => ({
  x: xCoordinates[index],
  y: yToCoordinate(value),
  value,
}));

const buildSmoothLinePath = (points: Array<{ x: number; y: number }>) => {
  if (points.length === 0) {
    return "";
  }

  if (points.length === 1) {
    return `M${points[0].x} ${points[0].y}`;
  }

  let path = `M${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index++) {
    const previousPoint = points[index - 1] ?? points[index];
    const currentPoint = points[index];
    const nextPoint = points[index + 1];
    const nextNextPoint = points[index + 2] ?? nextPoint;

    const controlPoint1X = currentPoint.x + (nextPoint.x - previousPoint.x) / 6;
    const controlPoint1Y = currentPoint.y + (nextPoint.y - previousPoint.y) / 6;
    const controlPoint2X = nextPoint.x - (nextNextPoint.x - currentPoint.x) / 6;
    const controlPoint2Y = nextPoint.y - (nextNextPoint.y - currentPoint.y) / 6;

    path += ` C${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${nextPoint.x} ${nextPoint.y}`;
  }

  return path;
};

const chartLinePath = buildSmoothLinePath(chartPoints);

const topContributors = Array.from({ length: 7 }).map((_, index) => ({
  id: index,
  name: "Sarah Chen",
  photosLabel: "247 photos",
  earnings: "$12,450",
  avatarSrc: "/home/latest/latest1.jpg",
}));

export default function DashboardOverviewContent() {
  return (
    <section className="h-full py-5 sm:py-6 lg:py-3 pr-12.5">
      <div className="mx-auto w-full max-w-420">
        <div className="inline-flex items-center border-b border-brand-default pb-1 text-lg font-medium text-brand-default">
          Overview
        </div>

        <h1 className="my-9 text-[30px] leading-tight font-bold tracking-tight text-text-strong sm:text-[48px]">
          Welcome Back, Jake Morrison
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {overviewStats.map((item) => (
            <article
              key={item.label}
              className="rounded-sm border border-line-weaker bg-surface-muted-100 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="inline-flex h-9 w-9 p-2.5 items-center justify-center rounded-md bg-brand-disabled text-brand-default">
                  <item.Icon size={14} />
                </div>

                <div className="flex flex-col items-end gap-1">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs text-text-weaker"
                  >
                    January
                    <ChevronDown size={12} />
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

              <p className="mt-6 text-[24px] leading-none text-text-strong">{item.value}</p>
              <p className="mt-1 text-xs text-text-weak">{item.label}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 items-stretch gap-4 xl:auto-rows-fr xl:grid-cols-[1fr_1fr]">
          <section className="flex h-full flex-col">
            <h2 className="text-[28px] leading-tight font-semibold text-text-strong">Earnings Overview</h2>

            <div className="mt-3 flex-1 rounded-sm border border-line-weaker bg-surface-muted-100 p-3">
              <div className="h-90 w-full overflow-hidden xl:h-full">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="h-full w-full"
                  role="img"
                  aria-label="Earnings trend chart"
                >
                  {yTicks.map((tick) => {
                    const y = yToCoordinate(tick);

                    return (
                      <g key={tick}>
                        <line
                          x1={chartMargin.left - 5}
                          y1={y}
                          x2={chartMargin.left}
                          y2={y}
                          stroke="#495262"
                        />
                        <text
                          x={chartMargin.left - 8}
                          y={y + 4}
                          textAnchor="end"
                          className="fill-text-weaker text-[11px]"
                        >
                          {tick}
                        </text>
                      </g>
                    );
                  })}

                  <line
                    x1={chartMargin.left}
                    y1={chartMargin.top}
                    x2={chartMargin.left}
                    y2={chartHeight - chartMargin.bottom}
                    stroke="#495262"
                  />
                  <line
                    x1={chartMargin.left}
                    y1={chartHeight - chartMargin.bottom}
                    x2={chartWidth - chartMargin.right}
                    y2={chartHeight - chartMargin.bottom}
                    stroke="#495262"
                  />

                  <path d={chartLinePath} fill="none" stroke="#0EA5E9" strokeWidth="3" />

                  {chartPoints.map((point) => (
                    <circle
                      key={`${point.x}-${point.y}`}
                      cx={point.x}
                      cy={point.y}
                      r="5"
                      fill="#FFFFFF"
                      stroke="#0EA5E9"
                      strokeWidth="3"
                    />
                  ))}

                  {chartLabels.map((label, index) => (
                    <text
                      key={label}
                      x={xCoordinates[index]}
                      y={chartHeight - chartMargin.bottom + 18}
                      textAnchor="middle"
                      className="fill-text-weaker text-[11px]"
                    >
                      {label}
                    </text>
                  ))}
                </svg>
              </div>
            </div>
          </section>

          <section className="flex h-full flex-col">
            <h2 className="text-[22px] leading-tight font-semibold text-text-strong">Top Contributors</h2>

            <div className="mt-9 space-y-3">
              {topContributors.map((contributor) => (
                <article
                  key={contributor.id}
                  className="flex items-center justify-between border-b border-line-weaker last:border-b-0 pb-2"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Image
                      src={contributor.avatarSrc}
                      alt={contributor.name}
                      width={34}
                      height={34}
                      className="h-10 w-10 rounded-full object-cover"
                    />

                    <div className="min-w-0">
                      <p className="truncate text-lg leading-tight text-text-strong sm:text-[22px]">
                        {contributor.name}
                      </p>
                      <p className="text-[12px] text-text-weaker">{contributor.photosLabel}</p>
                    </div>
                  </div>

                  <p className="shrink-0 text-lg leading-tight font-medium text-brand-default sm:text-[22px]">
                    {contributor.earnings}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}