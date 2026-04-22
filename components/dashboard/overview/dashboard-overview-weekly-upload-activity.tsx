import type { WeeklyUploadBar } from "@/components/dashboard/overview/dashboard-overview-types";

type DashboardOverviewWeeklyUploadActivityProps = {
  bars: WeeklyUploadBar[];
  yTicks: number[];
};

type BarModel = WeeklyUploadBar & {
  x: number;
  y: number;
  height: number;
};

const chartWidth = 760;
const chartHeight = 460;
const chartMargin = {
  top: 14,
  right: 12,
  bottom: 44,
  left: 44,
};

function toChartModel(bars: WeeklyUploadBar[], yTicks: number[]) {
  const plotWidth = chartWidth - chartMargin.left - chartMargin.right;
  const plotHeight = chartHeight - chartMargin.top - chartMargin.bottom;
  const gap = 18;
  const barWidth = Math.max(28, (plotWidth - gap * Math.max(0, bars.length - 1)) / bars.length);
  const maxTick = yTicks[yTicks.length - 1] ?? 1;

  const yToCoordinate = (value: number) => {
    const ratio = value / maxTick;
    return chartMargin.top + plotHeight * (1 - ratio);
  };

  const barModels: BarModel[] = bars.map((bar, index) => {
    const x = chartMargin.left + index * (barWidth + gap) + gap / 2;
    const y = yToCoordinate(bar.uploads);

    return {
      ...bar,
      x,
      y,
      height: chartHeight - chartMargin.bottom - y,
    };
  });

  return {
    barModels,
    yToCoordinate,
  };
}

export default function DashboardOverviewWeeklyUploadActivity({
  bars,
  yTicks,
}: DashboardOverviewWeeklyUploadActivityProps) {
  const { barModels, yToCoordinate } = toChartModel(bars, yTicks);

  return (
    <section className="flex h-full flex-col">
      <h2 className="text-[20px] leading-tight font-semibold text-text-strong sm:text-[24px] lg:text-[28px]">
        Weekly Upload Activity
      </h2>

      <div className="mt-3 flex-1 rounded-sm border border-line-weaker bg-surface-muted-100 p-2 sm:p-3">
        <div className="h-64 w-full overflow-hidden sm:h-72 md:h-80 lg:h-90 xl:h-full">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="h-full w-full"
            role="img"
            aria-label="Weekly upload activity chart"
          >
            {yTicks.map((tick) => {
              const y = yToCoordinate(tick);

              return (
                <g key={tick}>
                  <line
                    x1={chartMargin.left}
                    y1={y}
                    x2={chartWidth - chartMargin.right}
                    y2={y}
                    // stroke="#D8E3F0"
                    // strokeDasharray="4 4"
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

            {barModels.map((bar) => {
              // 1. Define 'r' here, ensuring it never exceeds the bar's height
              const r = Math.min(14, bar.height);

              // 2. Explicitly return the JSX
              return (
                <g key={bar.dayLabel}>
                  <path
                    d={`
                      M ${bar.x},${bar.y + bar.height} 
                      L ${bar.x},${bar.y + r} 
                      a ${r},${r} 0 0 1 ${r},-${r} 
                      L ${bar.x + 78 - r},${bar.y} 
                      a ${r},${r} 0 0 1 ${r},${r} 
                      L ${bar.x + 78},${bar.y + bar.height} 
                      Z
                    `}
                    fill="#1D9CD2"
                  />
                  <text
                    x={bar.x + 39}
                    y={chartHeight - chartMargin.bottom + 18}
                    textAnchor="middle"
                    className="fill-text-weaker text-[11px]"
                  >
                    {bar.dayLabel}
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
          </svg>
        </div>
      </div>
    </section>
  );
}
