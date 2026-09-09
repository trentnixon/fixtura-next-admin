"use client";

import { useMemo } from "react";
import { Activity, Calendar, CheckCircle2, Clock3, PlayCircle, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ErrorState from "@/components/ui-library/states/ErrorState";
import {
  OverviewDataWorkspace,
  type WorkspaceMetricTile,
} from "@/app/dashboard/components/live-snapshot/OverviewDataWorkspace";
import { useSchedulerRollup } from "@/hooks/scheduler/useSchedulerRollup";

export function SchedulerRollupData() {
  const { data, isError, isLoading, error, refetch } = useSchedulerRollup();

  const successRate = data
    ? (
        (data.yesterdaySuccessCount /
          (data.yesterdaySuccessCount + data.yesterdayFailureCount || 1)) *
        100
      ).toFixed(0)
    : "0";

  const metrics = useMemo((): WorkspaceMetricTile[] => {
    const avgDuration = data?.avgRenderTimeMinutes
      ? `${data.avgRenderTimeMinutes.toFixed(1)}m`
      : "0m";

    return [
      {
        id: "total-configs",
        label: "Total Configs",
        value: String(data?.numberOfSchedulers ?? 0),
        meta: "Active scheduler records",
        isLoading,
      },
      {
        id: "active-renders",
        label: "Active Renders",
        value: String(data?.numberOfSchedulersRendering ?? 0),
        meta: "Currently processing",
        isLoading,
      },
      {
        id: "queued",
        label: "Queued",
        value: String(data?.numberOfSchedulersQueued ?? 0),
        meta: "Waiting for capacity",
        isLoading,
      },
      {
        id: "avg-duration",
        label: "Avg Duration",
        value: avgDuration,
        meta: "Recent render time",
        isLoading,
      },
      {
        id: "success-rate",
        label: "Success Rate",
        value: `${successRate}%`,
        meta: "Previous 24 hours",
        isLoading,
      },
    ];
  }, [data, isLoading, successRate]);

  if (isError) {
    return (
      <ErrorState
        variant="default"
        title="Scheduler rollup unavailable"
        error={
          error instanceof Error
            ? error
            : new Error("Unable to load scheduler rollup")
        }
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <OverviewDataWorkspace
      title="Performance Snapshot"
      description="Real-time rendering status and operational health"
      icon={Activity}
      badge={
        <Badge variant="secondary" className="gap-1">
          <Activity className="h-3 w-3 animate-pulse" aria-hidden />
          Live
        </Badge>
      }
      metrics={metrics}
      columns={3}
      footer={
        <span className="inline-flex flex-wrap items-center gap-x-3 text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" aria-hidden />
            Fleet configs
          </span>
          <span className="inline-flex items-center gap-1">
            <PlayCircle className="h-3.5 w-3.5" aria-hidden />
            Active pipeline
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" aria-hidden />
            Queue depth
          </span>
          <span className="inline-flex items-center gap-1">
            <Timer className="h-3.5 w-3.5" aria-hidden />
            Render duration
          </span>
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            24h outcomes
          </span>
        </span>
      }
    />
  );
}
