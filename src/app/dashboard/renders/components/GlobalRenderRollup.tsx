"use client";

import { useMemo } from "react";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRenderTelemetry } from "@/hooks/renders/useRenderTelemetry";
import ErrorState from "@/components/ui-library/states/ErrorState";
import {
  OverviewDataWorkspace,
  type WorkspaceMetricTile,
} from "@/app/dashboard/components/live-snapshot/OverviewDataWorkspace";

function formatSystemStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function GlobalRenderRollup() {
  const { data: telemetry, isLoading, isError, error, refetch } =
    useRenderTelemetry();

  const metrics = useMemo((): WorkspaceMetricTile[] => {
    if (!telemetry) {
      return [];
    }

    return [
      {
        id: "active",
        label: "Active Renders",
        value: String(telemetry.activeCount),
        meta: "Currently processing",
        isLoading,
      },
      {
        id: "success-rate",
        label: "Success Rate",
        value: `${telemetry.successRate24h}%`,
        meta: "Complete / published last 24h",
        isLoading,
      },
      {
        id: "failed-today",
        label: "Failed Today",
        value: String(telemetry.failedToday),
        meta: "Published today, not complete",
        isLoading,
      },
      {
        id: "system-status",
        label: "System Status",
        value: formatSystemStatus(telemetry.systemStatus),
        meta: "Fleet health signal",
        isLoading,
      },
    ];
  }, [isLoading, telemetry]);

  if (isError) {
    return (
      <ErrorState
        variant="default"
        title="Unable to load render telemetry"
        error={
          error instanceof Error
            ? error
            : error
              ? String(error)
              : new Error("Render telemetry unavailable")
        }
        onRetry={() => refetch()}
      />
    );
  }

  const statusBadge =
    telemetry?.systemStatus === "nominal" ? (
      <Badge variant="secondary" className="gap-1">
        <CheckCircle2 className="h-3 w-3" aria-hidden />
        Nominal
      </Badge>
    ) : telemetry?.systemStatus === "warning" ? (
      <Badge variant="outline" className="gap-1 border-amber-200 text-amber-800">
        <AlertCircle className="h-3 w-3" aria-hidden />
        Warning
      </Badge>
    ) : telemetry?.systemStatus === "degraded" ? (
      <Badge variant="outline" className="gap-1 border-red-200 text-red-800">
        <AlertCircle className="h-3 w-3" aria-hidden />
        Degraded
      </Badge>
    ) : (
      <Badge variant="outline" className="gap-1">
        <Activity className="h-3 w-3" aria-hidden />
        Live
      </Badge>
    );

  return (
    <OverviewDataWorkspace
      title="Render snapshot"
      description="Current production health and activity at a glance"
      icon={PlayCircle}
      badge={statusBadge}
      metrics={metrics}
      columns={4}
      footer={
        <span className="inline-flex flex-wrap items-center gap-x-3 text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <PlayCircle className="h-3.5 w-3.5" aria-hidden />
            Active pipeline
          </span>
          <span className="inline-flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" aria-hidden />
            24h success rate
          </span>
          <span className="inline-flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" aria-hidden />
            Today&apos;s failures
          </span>
        </span>
      }
    />
  );
}
