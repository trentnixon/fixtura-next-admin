"use client";

import { useMemo, useState, type ReactNode } from "react";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  OverviewDataWorkspace,
  type WorkspaceMetricTile,
} from "@/app/dashboard/components/live-snapshot/OverviewDataWorkspace";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import { useNotificationByJobRun } from "@/hooks/data-collection/useNotificationByJobRun";
import type { ScraperNotificationByRun } from "@/types/notificationByRun";
import {
  Bell,
  CheckCircle2,
  Copy,
  Info,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPercentage } from "@/utils/chart-formatters";
import {
  asLogMetrics,
  ReportedMetricsSummary,
  THROUGHPUT_METRIC_KEYS,
} from "./ReportedThroughputMetrics";

interface NotificationSectionProps {
  jobId: string;
  runId: string | undefined;
}

type NotificationMeta = {
  duplicateCount: number;
  returnedLatestByCreatedAt: boolean;
};

function useNotificationRun(jobId: string, runId: string | undefined) {
  const trimmedRun = runId?.trim() ?? "";
  const hasRunId = trimmedRun.length > 0;

  const query = useNotificationByJobRun(
    hasRunId ? jobId : undefined,
    hasRunId ? trimmedRun : undefined,
  );

  return { hasRunId, trimmedRun, ...query };
}

/** Server may send 0–1 ratio or 0–100 percent scale. */
function formatDecimalErrorRate(raw: number): string {
  if (raw >= 0 && raw <= 1) return formatPercentage(raw * 100);
  return formatPercentage(raw);
}

function formatMetricValue(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "number") return Number.isFinite(v) ? String(v) : "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "string") return v || "—";
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "Time unavailable";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function NotificationRefreshButton({
  onClick,
  isFetching,
}: {
  onClick: () => void;
  isFetching: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={isFetching}
      className="gap-2 border-slate-200 bg-slate-50 shadow-none"
    >
      <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
      Refresh
    </Button>
  );
}

function NotificationRunGate({
  jobId,
  runId,
  requireRecord = false,
  children,
}: NotificationSectionProps & {
  requireRecord?: boolean;
  children: (
    notification: ScraperNotificationByRun,
    meta: NotificationMeta,
  ) => ReactNode;
}) {
  const { hasRunId, isLoading, isError, error, data, refetch } =
    useNotificationRun(jobId, runId);

  if (!hasRunId) return null;

  if (isLoading) {
    return <LoadingState variant="skeleton" message="Loading notification…" />;
  }

  if (isError && error != null) {
    return (
      <ErrorState
        variant="card"
        error={error}
        title="Could not load notification"
        description="The notification API may be unavailable or the request was invalid."
        onRetry={() => refetch()}
      />
    );
  }

  if (data == null) {
    return requireRecord ? null : null;
  }

  return <>{children(data.data, data.meta)}</>;
}

/** Overview — CMS notification status only (no metrics, issues, or raw JSON). */
export function NotificationOverviewSection({
  jobId,
  runId,
}: NotificationSectionProps) {
  const { hasRunId, trimmedRun, isLoading, isError, error, data, refetch, isFetching } =
    useNotificationRun(jobId, runId);

  return (
    <OverviewRecordPanel
      title="CMS notification"
      description={
        hasRunId
          ? `Failure notification record for run ${trimmedRun}`
          : "Resolve a run id to check for a CMS notification"
      }
      action={
        hasRunId ? (
          <NotificationRefreshButton
            onClick={() => refetch()}
            isFetching={isFetching}
          />
        ) : null
      }
    >
      {!hasRunId ? (
        <EmptyState
          variant="minimal"
          title="No run id available"
          description="Add ?runId=… to the URL, or wait until the job summary or completion log includes a run id."
          icon={<Info className="h-8 w-8 text-muted-foreground" />}
        />
      ) : null}

      {hasRunId && isLoading ? (
        <LoadingState variant="skeleton" message="Loading notification…" />
      ) : null}

      {hasRunId && isError && error != null && !isLoading ? (
        <ErrorState
          variant="card"
          error={error}
          title="Could not load notification"
          description="The notification API may be unavailable or the request was invalid."
          onRetry={() => refetch()}
        />
      ) : null}

      {hasRunId && !isLoading && !isError && data === null ? (
        <EmptyState
          variant="minimal"
          title="No CMS notification for this run"
          description="Jobs that complete cleanly without issues or a fatal flag do not create a notification row."
          icon={<CheckCircle2 className="h-8 w-8 text-muted-foreground" />}
        />
      ) : null}

      {hasRunId && !isLoading && !isError && data != null ? (
        <NotificationOverviewBody
          notification={data.data}
          meta={data.meta}
        />
      ) : null}
    </OverviewRecordPanel>
  );
}

function NotificationOverviewBody({
  notification,
  meta,
}: {
  notification: ScraperNotificationByRun;
  meta: NotificationMeta;
}) {
  const reportedAt = notification.timestamp ?? notification.createdAt ?? null;

  const headlineMetrics = useMemo((): WorkspaceMetricTile[] => {
    return [
      {
        id: "error-rate",
        label: "CMS error rate",
        value:
          notification.errorRate != null &&
          !Number.isNaN(notification.errorRate)
            ? formatDecimalErrorRate(Number(notification.errorRate))
            : "—",
        meta: "Reported on the notification record",
      },
      {
        id: "reported",
        label: "CMS reported",
        value: formatDateTime(reportedAt),
        meta: "When CMS stored the notification",
      },
      {
        id: "record",
        label: "Notification ID",
        value:
          notification.id != null ? String(notification.id) : "—",
        meta:
          meta.returnedLatestByCreatedAt
            ? `Latest of ${meta.duplicateCount.toLocaleString()} records`
            : "Single record for this run",
      },
    ];
  }, [meta, notification, reportedAt]);

  return (
    <OverviewDataWorkspace
      title="Notification record"
      description="CMS-side failure notification — see Metrics and Issues tabs for counts and logs from job.completed"
      icon={Bell}
      badge={
        meta.returnedLatestByCreatedAt ? (
          <Badge variant="warning">
            Latest of {meta.duplicateCount.toLocaleString()} records
          </Badge>
        ) : notification.fatal === true ? (
          <Badge variant="destructive">Fatal</Badge>
        ) : (
          <Badge variant="outline" className="border-emerald-200 text-emerald-800">
            Recorded
          </Badge>
        )
      }
      metrics={headlineMetrics}
      columns={3}
    />
  );
}

function ExtraMetricFields({
  entries,
}: {
  entries: [string, unknown][];
}) {
  if (entries.length === 0) return null;

  return (
    <OverviewRecordPanel
      title="Notification metric fields"
      description="Additional keys from the CMS notification metrics object"
      badge={
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
          {entries.length} field{entries.length === 1 ? "" : "s"}
        </span>
      }
    >
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2"
          >
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {key}
            </p>
            <p className="mt-1 break-all font-mono text-xs text-slate-900">
              {formatMetricValue(value)}
            </p>
          </div>
        ))}
      </div>
    </OverviewRecordPanel>
  );
}

/** Metrics — CMS throughput fallback and extra metric keys only. */
export function NotificationMetricsSection({
  jobId,
  runId,
  hasCompletionMetrics,
}: NotificationSectionProps & { hasCompletionMetrics: boolean }) {
  return (
    <NotificationRunGate jobId={jobId} runId={runId} requireRecord>
      {(notification) => {
        const metrics =
          notification.metrics &&
          typeof notification.metrics === "object" &&
          !Array.isArray(notification.metrics)
            ? notification.metrics
            : null;
        const logMetrics = asLogMetrics(metrics);
        const metricEntries = metrics ? Object.entries(metrics) : [];
        const extraMetricEntries = metricEntries.filter(
          ([key]) => !THROUGHPUT_METRIC_KEYS.has(key) && key !== "errorRate",
        );
        const showThroughput =
          !hasCompletionMetrics && logMetrics != null;

        if (!showThroughput && extraMetricEntries.length === 0) {
          return null;
        }

        return (
          <div className="space-y-6">
            {showThroughput && logMetrics ? (
              <ReportedMetricsSummary
                metrics={logMetrics}
                description="Throughput from the CMS notification (job.completed had no metrics)"
                fixtureDescription="Fixture processing on the notification record"
                ingestDescription="Downstream ingest on the notification record"
              />
            ) : null}
            <ExtraMetricFields entries={extraMetricEntries} />
          </div>
        );
      }}
    </NotificationRunGate>
  );
}

function ScraperLogJson({ log }: { log: Record<string, unknown> }) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const json = JSON.stringify(log, null, 2);

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
    window.setTimeout(() => setCopyState("idle"), 2000);
  };

  return (
    <OverviewRecordPanel
      title="Linked scraper log"
      description="Raw scraper log object attached to the CMS notification"
      action={
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 border-slate-200 bg-slate-50 shadow-none"
          onClick={copyJson}
        >
          {copyState === "copied" ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-success-700" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copyState === "copied"
            ? "Copied"
            : copyState === "error"
              ? "Copy failed"
              : "Copy JSON"}
        </Button>
      }
    >
      <pre className="max-h-[min(70vh,560px)] overflow-auto rounded-md bg-slate-950 p-4 text-[11px] leading-relaxed text-slate-100">
        {json}
      </pre>
    </OverviewRecordPanel>
  );
}

/** Metadata — linked notification payload JSON. */
export function NotificationMetadataSection({
  jobId,
  runId,
}: NotificationSectionProps) {
  return (
    <NotificationRunGate jobId={jobId} runId={runId} requireRecord>
      {(notification) =>
        notification.scraperLog != null &&
        typeof notification.scraperLog === "object" ? (
          <ScraperLogJson log={notification.scraperLog} />
        ) : null
      }
    </NotificationRunGate>
  );
}
