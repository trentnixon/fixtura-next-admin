"use client";

import { Timer, TrendingUp, Gauge, Activity } from "lucide-react";
import type { AssetRunAtAGlanceMetrics } from "@/lib/account-asset-run/globalRunAnalytics";

interface AssetRunTimingRollupProps {
  metrics: AssetRunAtAGlanceMetrics;
  windowLabel: string;
}

export function AssetRunTimingRollup({
  metrics,
  windowLabel,
}: AssetRunTimingRollupProps) {
  const cards = [
    {
      label: "Avg duration",
      value: metrics.avgDurationLabel,
      detail: `${metrics.runsWithDurationCount} runs with timing`,
      icon: <Timer className="h-4 w-4 text-blue-500" />,
    },
    {
      label: "Median",
      value: metrics.medianDurationLabel,
      detail: "Typical completed run",
      icon: <Gauge className="h-4 w-4 text-violet-500" />,
    },
    {
      label: "P90",
      value: metrics.p90DurationLabel,
      detail: "Slow tail — improvement target",
      icon: <TrendingUp className="h-4 w-4 text-amber-500" />,
    },
    {
      label: "Failure rate",
      value:
        metrics.failedRatePercent != null
          ? `${metrics.failedRatePercent}%`
          : "—",
      detail: `${metrics.failedCount} failed · ${metrics.completedCount} completed`,
      icon: <Activity className="h-4 w-4 text-emerald-500" />,
    },
  ];

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        Run timing from {windowLabel}.{" "}
        {metrics.dateRangeLabel !== "No runs in window"
          ? metrics.dateRangeLabel
          : ""}
        {metrics.runsWithDurationCount < metrics.totalRunsInWindow && (
          <>
            {" "}
            · Timing uses started/completed timestamps or runKey when CMS omits{" "}
            <code className="font-mono text-[10px]">startedAt</code>
          </>
        )}
      </p>
      <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 lg:[&:nth-child(2)]:border-r"
          >
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                {card.label}
              </p>
              <p className="mt-1 truncate text-lg font-semibold text-slate-900">
                {card.value}
              </p>
              <p className="text-xs text-muted-foreground">{card.detail}</p>
            </div>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50">
              {card.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
