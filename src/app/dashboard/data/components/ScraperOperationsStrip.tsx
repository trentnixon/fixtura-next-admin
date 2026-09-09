"use client";

import { useMemo } from "react";
import {
  Activity,
  CheckCircle2,
  Clock3,
  Database,
  ListTodo,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ErrorState from "@/components/ui-library/states/ErrorState";
import {
  OverviewDataWorkspace,
  type WorkspaceMetricTile,
} from "@/app/dashboard/components/live-snapshot/OverviewDataWorkspace";
import { useScraperLogs } from "@/hooks/data-collection/useScraperLogs";

function formatDurationMs(ms: number | null | undefined): string {
  if (ms == null || ms < 0) return "—";
  if (ms < 1000) return `${ms}ms`;

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const parts: string[] = [];

  if (hours > 0) parts.push(`${hours}h`);
  if (minutes % 60 > 0) parts.push(`${minutes % 60}m`);
  if (seconds % 60 > 0 || parts.length === 0) parts.push(`${seconds % 60}s`);

  return parts.join(" ");
}

export function ScraperOperationsStrip() {
  const {
    meta: scraperMeta,
    isLoading: logsLoading,
    error: logsError,
    refetch,
  } = useScraperLogs({
    page: 1,
    pageSize: 1,
  });

  const byStatus = scraperMeta?.summary.byStatus;
  const inProgress = byStatus?.in_progress ?? 0;
  const retryLater = byStatus?.retry_later ?? 0;
  const completed = byStatus?.completed ?? 0;

  const metrics = useMemo((): WorkspaceMetricTile[] => {
    return [
      {
        id: "pipeline",
        label: "Pipeline",
        value: logsLoading ? "—" : inProgress > 0 ? "Running" : "Idle",
        meta:
          logsError != null
            ? "Log feed unavailable"
            : `${inProgress} active · ${retryLater} retry`,
        isLoading: logsLoading,
      },
      {
        id: "jobs-indexed",
        label: "Jobs indexed",
        value: logsLoading
          ? "—"
          : String(scraperMeta?.summary.totalJobs ?? 0),
        meta: `${completed} completed in current window`,
        isLoading: logsLoading,
      },
      {
        id: "avg-duration",
        label: "Avg duration",
        value: logsLoading
          ? "—"
          : formatDurationMs(scraperMeta?.summary.avgDurationMs),
        meta: "Loaded job sample",
        isLoading: logsLoading,
      },
    ];
  }, [
    completed,
    inProgress,
    logsError,
    logsLoading,
    retryLater,
    scraperMeta?.summary.avgDurationMs,
    scraperMeta?.summary.totalJobs,
  ]);

  if (logsError != null && !logsLoading && !scraperMeta) {
    return (
      <ErrorState
        variant="default"
        title="Scraper log feed unavailable"
        error={
          logsError instanceof Error ? logsError : new Error(String(logsError))
        }
        onRetry={() => refetch()}
      />
    );
  }

  const statusBadge =
    logsError != null ? (
      <Badge variant="outline" className="gap-1 border-red-200 text-red-800">
        Unavailable
      </Badge>
    ) : inProgress > 0 ? (
      <Badge variant="secondary" className="gap-1">
        <Activity className="h-3 w-3 animate-pulse" aria-hidden />
        Live
      </Badge>
    ) : (
      <Badge variant="outline" className="gap-1 border-emerald-200 text-emerald-800">
        <CheckCircle2 className="h-3 w-3" aria-hidden />
        Idle
      </Badge>
    );

  return (
    <OverviewDataWorkspace
      title="Scraper operations"
      description="Pipeline health and indexed job volume across all scopes"
      icon={Database}
      badge={statusBadge}
      metrics={metrics}
      columns={3}
      footer={
        <span className="inline-flex flex-wrap items-center gap-x-3 text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Activity className="h-3.5 w-3.5" aria-hidden />
            Active jobs
          </span>
          <span className="inline-flex items-center gap-1">
            <ListTodo className="h-3.5 w-3.5" aria-hidden />
            Indexed volume
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" aria-hidden />
            Run duration
          </span>
        </span>
      }
    />
  );
}
