"use client";

import { useMemo } from "react";
import {
  CalendarRange,
  Clock3,
  Gauge,
  ListChecks,
  Timer,
  TriangleAlert,
} from "lucide-react";
import { useAccountHealthAccountStatus } from "@/hooks/account-health/useAccountHealthAccountStatus";
import {
  LiveSnapshotMetricStrip,
  type LiveSnapshotMetricItem,
} from "@/app/dashboard/components/live-snapshot/LiveSnapshotMetricStrip";
import {
  computeAtAGlanceMetrics,
  type RunWithTimestamps,
} from "@/lib/account-health/globalRunAnalytics";

interface DataRefreshAtAGlanceProps {
  accountId: number;
}

const METRIC_ICON_CLASS = "bg-slate-100 text-slate-600";

export default function DataRefreshAtAGlance({
  accountId,
}: DataRefreshAtAGlanceProps) {
  const { data } = useAccountHealthAccountStatus(accountId);

  const metrics = useMemo(() => {
    const recent = data?.data?.recentRuns ?? [];
    const runs: RunWithTimestamps[] = recent.map((r) => ({
      id: r.id,
      status: r.status,
      startedAt: r.startedAt,
      finalizedAt: r.finalizedAt,
      failedAt: r.failedAt,
      summary: r.summary,
    }));
    return computeAtAGlanceMetrics(runs, data?.data?.runCounts);
  }, [data?.data?.recentRuns, data?.data?.runCounts]);

  if (!data?.data) return null;

  const items: LiveSnapshotMetricItem[] = [
    {
      id: "runs",
      label: "Runs in window",
      value: String(metrics.totalRunsInWindow),
      meta: "Recent refresh runs",
      icon: ListChecks,
      iconClassName: METRIC_ICON_CLASS,
    },
    {
      id: "failed",
      label: "Failed in window",
      value:
        metrics.failedRatePercent != null
          ? `${metrics.failedCount} (${metrics.failedRatePercent}%)`
          : String(metrics.failedCount),
      meta: "Failed refresh attempts",
      icon: TriangleAlert,
      iconClassName: METRIC_ICON_CLASS,
    },
    {
      id: "empty",
      label: "Empty season",
      value: String(metrics.emptyResultCount),
      meta: "No current season data",
      icon: Gauge,
      iconClassName: METRIC_ICON_CLASS,
    },
    {
      id: "duration",
      label: "Avg run duration",
      value: metrics.avgDurationLabel,
      meta: "Across recent runs",
      icon: Timer,
      iconClassName: METRIC_ICON_CLASS,
    },
    {
      id: "range",
      label: "Activity range",
      value: metrics.dateRangeLabel,
      meta: "Window coverage",
      icon: CalendarRange,
      iconClassName: METRIC_ICON_CLASS,
    },
    {
      id: "window",
      label: "Analysis window",
      value: "Recent runs",
      meta: "Not legacy collection analytics",
      icon: Clock3,
      iconClassName: METRIC_ICON_CLASS,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-slate-900">At a glance</h2>
        <p className="text-sm text-muted-foreground">
          Summary from recent refresh runs on this account
        </p>
      </div>
      <LiveSnapshotMetricStrip items={items} columns={3} />
    </div>
  );
}
