"use client";

import { useMemo, useState } from "react";

type DashboardOverviewEarningsChartProps = {
  labels: string[];
  values: number[];
  yTicks: number[];
};

type Point = {
  x: number;
  y: number;
  value: number;
};

const chartWidth = 760;
const chartHeight = 360;
const chartMargin = {
  top: 14,
  right: 12,
  bottom: 44,
  left: 44,
};

function buildSmoothLinePath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) {
    return "";
  }

  if (points.length === 1) {
    return `M${points[0].x} ${points[0].y}`;
  }

  let path = `M${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index++) {
    const nextPoint = points[index + 1];

    path += ` L${nextPoint.x} ${nextPoint.y}`;
  }

  return path;
}

function toChartModel(values: number[], yTicks: number[]) {
  const plotWidth = chartWidth - chartMargin.left - chartMargin.right;
  const plotHeight = chartHeight - chartMargin.top - chartMargin.bottom;

  const xStep = plotWidth / Math.max(1, values.length - 1);
  const xCoordinates = values.map((_, index) => chartMargin.left + index * xStep);

  const yToCoordinate = (value: number) => {
    const ratio = (value - yTicks[0]) / (yTicks[yTicks.length - 1] - yTicks[0]);
    return chartMargin.top + plotHeight * (1 - ratio);
  };

  const points: Point[] = values.map((value, index) => ({
    x: xCoordinates[index],
    y: yToCoordinate(value),
    value,
  }));

  return {
    points,
    linePath: buildSmoothLinePath(points),
    xCoordinates,
    yToCoordinate,
  };
}

export default function DashboardOverviewEarningsChart({
  labels,
  values,
  yTicks,
}: DashboardOverviewEarningsChartProps) {
  const { points, linePath, xCoordinates, yToCoordinate } = useMemo(
    () => toChartModel(values, yTicks),
    [values, yTicks],
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const cursorX = ((event.clientX - rect.left) / rect.width) * chartWidth;

    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    points.forEach((point, index) => {
      const distance = Math.abs(point.x - cursorX);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    setHoveredIndex(nearestIndex);
  };

  return (
    <section className="flex h-full flex-col">
      <h2 className="text-text-strong text-[20px] leading-tight font-semibold sm:text-[24px] lg:text-[28px]">
        Earnings Overview
      </h2>

      <div className="border-line-weaker bg-surface-muted-100 mt-3 flex-1 rounded-sm border p-2 sm:p-3">
        <div className="relative h-64 w-full overflow-visible sm:h-72 md:h-80 lg:h-90 xl:h-full">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="h-full w-full"
            role="img"
            aria-label="Earnings trend chart"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredIndex(null)}
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

            <path d={linePath} fill="none" stroke="#0EA5E9" strokeWidth="3" />

            {points.map((point) => (
              <circle
                key={`${point.x}-${point.y}`}
                cx={point.x}
                cy={point.y}
                r={hoveredIndex !== null && points[hoveredIndex] === point ? 7 : 5}
                fill="#FFFFFF"
                stroke="#0EA5E9"
                strokeWidth={hoveredIndex !== null && points[hoveredIndex] === point ? 4 : 3}
              />
            ))}

            {hoveredPoint ? (
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="12"
                fill="rgba(14, 165, 233, 0.12)"
              />
            ) : null}

            {labels.map((label, index) => (
              <text
                key={`${label}-${index}`}
                x={xCoordinates[index]}
                y={chartHeight - chartMargin.bottom + 18}
                textAnchor="middle"
                className="fill-text-weaker text-[11px]"
              >
                {label}
              </text>
            ))}
          </svg>

          {hoveredPoint ? (
            <div
              className="border-line-weaker bg-surface-strong pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border px-3 py-2 text-left shadow-lg"
              style={{
                left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                top: `${(hoveredPoint.y / chartHeight) * 100}%`,
              }}
            >
              <p className="text-text-weaker text-[11px]">{labels[hoveredIndex ?? 0]}</p>
              <p className="text-text-strong text-sm font-semibold">
                ${hoveredPoint.value.toLocaleString()}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
