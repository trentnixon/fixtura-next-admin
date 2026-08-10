"use client";

import { useMemo } from "react";
import { useAccountHealthAccountStatus } from "@/hooks/account-health/useAccountHealthAccountStatus";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  computeAtAGlanceMetrics,
  type RunWithTimestamps,
} from "@/lib/account-health/globalRunAnalytics";
import { accountHealthStatusLabel } from "@/lib/account-health/displayRules";

interface DataRefreshAtAGlanceProps {
  accountId: number;
}

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}

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

  const accountStatus = data?.data?.account?.accountHealthStatus;

  if (!data?.data) return null;

  return (
    <SectionContainer
      title="At a glance"
      description="Summary from recent refresh runs on this account (not legacy collection analytics)"
      variant="compact"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCell
          label="Account health status"
          value={
            accountStatus
              ? accountHealthStatusLabel(accountStatus)
              : "—"
          }
        />
        <MetricCell
          label="Runs in window"
          value={String(metrics.totalRunsInWindow)}
        />
        <MetricCell
          label="Failed in window"
          value={
            metrics.failedRatePercent != null
              ? `${metrics.failedCount} (${metrics.failedRatePercent}%)`
              : String(metrics.failedCount)
          }
        />
        <MetricCell
          label="Empty season (window)"
          value={String(metrics.emptyResultCount)}
        />
        <MetricCell
          label="Avg run duration"
          value={metrics.avgDurationLabel}
        />
        <MetricCell label="Activity range" value={metrics.dateRangeLabel} />
      </div>
    </SectionContainer>
  );
}
