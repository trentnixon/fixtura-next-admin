"use client";

import { useState, type ReactNode } from "react";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNotificationByJobRun } from "@/hooks/data-collection/useNotificationByJobRun";
import type { ScraperNotificationByRun } from "@/types/notificationByRun";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Info,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPercentage } from "@/utils/chart-formatters";

export type NotificationByRunIdSource = "query" | "job" | "completed";

interface NotificationByRunSectionProps {
  jobId: string;
  runId: string | undefined;
  runIdSource?: NotificationByRunIdSource;
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

function issueRow(
  issue: unknown,
  reportedAt: string | null,
): {
  step: string;
  severity: string;
  message: string;
  url: string;
  timeLabel: "Occurred" | "Reported";
  time: string;
  fixtureKey: string;
  failureClass: string;
  retryable: boolean | null;
} {
  if (!issue || typeof issue !== "object") {
    return {
      step: "—",
      severity: "OTHER",
      message: String(issue),
      url: "",
      timeLabel: "Reported",
      time: formatDateTime(reportedAt),
      fixtureKey: "",
      failureClass: "",
      retryable: null,
    };
  }
  const o = issue as Record<string, unknown>;
  const occurredAt = [o.occurredAt, o.timestamp, o.createdAt].find(
    (value): value is string => typeof value === "string" && value.length > 0,
  );
  return {
    step: typeof o.step === "string" ? o.step : "—",
    severity:
      typeof o.severity === "string" ? o.severity.toUpperCase() : "OTHER",
    message: typeof o.message === "string" ? o.message : JSON.stringify(issue),
    url: typeof o.url === "string" ? o.url : "",
    timeLabel: occurredAt ? "Occurred" : "Reported",
    time: formatDateTime(occurredAt ?? reportedAt),
    fixtureKey: typeof o.fixtureKey === "string" ? o.fixtureKey : "",
    failureClass: typeof o.failureClass === "string" ? o.failureClass : "",
    retryable: typeof o.retryable === "boolean" ? o.retryable : null,
  };
}

function severityBadgeClass(severity: string): string {
  switch (severity) {
    case "FATAL":
      return "border-error-200 bg-error-100 text-error-900";
    case "ERROR":
    case "ERR":
      return "border-orange-200 bg-orange-100 text-orange-950";
    case "WARN":
      return "border-warning-200 bg-warning-100 text-warning-900";
    case "INFO":
      return "border-info-200 bg-info-100 text-info-900";
    default:
      return "border-slate-200 bg-slate-100 text-slate-800";
  }
}

function SummaryTile({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`min-h-[76px] rounded-lg border p-3 ${className ?? "border-slate-200 bg-white"}`}
    >
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 text-sm font-semibold text-slate-900">
        {children}
      </div>
    </div>
  );
}

function NotificationDetail({
  notification,
  meta,
}: {
  notification: ScraperNotificationByRun;
  meta: { duplicateCount: number; returnedLatestByCreatedAt: boolean };
}) {
  const issues = Array.isArray(notification.issues) ? notification.issues : [];
  const metrics =
    notification.metrics &&
    typeof notification.metrics === "object" &&
    !Array.isArray(notification.metrics)
      ? notification.metrics
      : null;

  const metricEntries = metrics ? Object.entries(metrics) : [];
  const reportedAt = notification.timestamp ?? notification.createdAt ?? null;

  return (
    <div className="space-y-6">
      {meta.returnedLatestByCreatedAt ? (
        <div className="flex justify-end">
          <Badge variant="warning">
            Latest of {meta.duplicateCount.toLocaleString()} records
          </Badge>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <SummaryTile
          label="Outcome"
          className={
            notification.fatal === true
              ? "border-error-200 bg-error-50"
              : "border-success-200 bg-success-50"
          }
        >
          <span className="inline-flex items-center gap-1.5">
            {notification.fatal === true ? (
              <AlertTriangle className="h-4 w-4 text-error-700" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-success-700" />
            )}
            {notification.fatal === true ? "Fatal" : "Non-fatal"}
          </span>
        </SummaryTile>
        <SummaryTile
          label="Error rate"
          className="border-warning-200 bg-warning-50"
        >
          {notification.errorRate != null &&
          !Number.isNaN(notification.errorRate)
            ? formatDecimalErrorRate(Number(notification.errorRate))
            : "—"}
        </SummaryTile>
        <SummaryTile label="Issues" className="border-error-200 bg-error-50">
          <span className="tabular-nums">{issues.length.toLocaleString()}</span>
        </SummaryTile>
        <SummaryTile label="Reported" className="border-info-200 bg-info-50">
          <span className="text-xs font-medium">
            {formatDateTime(reportedAt)}
          </span>
        </SummaryTile>
      </div>

      <div className="flex flex-wrap gap-x-8 gap-y-2 rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3 text-xs">
        {[
          ["Service", notification.service],
          ["Scope", notification.scope],
          ["Queue", notification.queueName],
          ["Kind", notification.kind],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-mono text-slate-800">{value || "—"}</span>
          </div>
        ))}
      </div>

      {metricEntries.length > 0 ? (
        <section className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            Reported metrics
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {metricEntries.map(([key, value]) => (
              <div
                key={key}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2"
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
        </section>
      ) : null}

      {issues.length > 0 ? (
        <NotificationIssues issues={issues} reportedAt={reportedAt} />
      ) : null}

      {notification.scraperLog != null &&
        typeof notification.scraperLog === "object" && (
          <ScraperLogJson log={notification.scraperLog} />
        )}
    </div>
  );
}

function NotificationIssues({
  issues,
  reportedAt,
}: {
  issues: unknown[];
  reportedAt: string | null;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-foreground">Issues</p>
        <Badge variant="outline">
          {issues.length.toLocaleString()} issue{issues.length === 1 ? "" : "s"}
        </Badge>
      </div>
      <div className="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 bg-white">
        {issues.map((issue, index) => {
          const row = issueRow(issue, reportedAt);
          return (
            <article
              key={`${row.severity}-${row.message}-${index}`}
              className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1.35fr)_190px_minmax(280px,1fr)]"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${severityBadgeClass(row.severity)}`}
                  >
                    {row.severity}
                  </Badge>
                  {row.step !== "—" ? (
                    <Badge
                      variant="secondary"
                      className="font-mono text-[10px]"
                    >
                      {row.step}
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-2 break-words text-sm font-medium leading-snug text-slate-900">
                  {row.message || "No issue message supplied"}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                  {row.fixtureKey ? (
                    <span className="font-mono">Fixture {row.fixtureKey}</span>
                  ) : null}
                  {row.failureClass ? (
                    <span className="font-mono">{row.failureClass}</span>
                  ) : null}
                  {row.retryable != null ? (
                    <span>{row.retryable ? "Retryable" : "Not retryable"}</span>
                  ) : null}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {row.timeLabel}
                </p>
                <p className="mt-1 text-xs text-slate-800">{row.time}</p>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Affected URL
                </p>
                <div className="mt-1 break-all text-xs">
                  {row.url ? (
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-1 text-info-700 hover:underline"
                    >
                      <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" />
                      {row.url}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">
                      No URL supplied
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
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
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-3 py-2">
        <p className="text-sm font-medium text-slate-900">Linked scraper log</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5"
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
      </div>
      <pre className="max-h-[min(70vh,560px)] overflow-auto bg-slate-950 p-4 text-[11px] leading-relaxed text-slate-100">
        {json}
      </pre>
    </section>
  );
}

export function NotificationByRunSection({
  jobId,
  runId,
}: NotificationByRunSectionProps) {
  const trimmedRun = runId?.trim() ?? "";
  const hasRunId = trimmedRun.length > 0;

  const { data, isLoading, error, refetch, isError, isFetching } =
    useNotificationByJobRun(
      hasRunId ? jobId : undefined,
      hasRunId ? trimmedRun : undefined,
    );

  return (
    <div className="space-y-4">
      {hasRunId ? (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2"
          >
            <RefreshCw
              className={cn("h-4 w-4", isFetching && "animate-spin")}
            />
            Refresh
          </Button>
        </div>
      ) : null}

      {!hasRunId && (
        <p className="text-sm text-muted-foreground">
          No run id is available for this job yet. Add{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
            ?runId=…
          </code>{" "}
          to the URL, or wait until the job summary or completion log includes a
          run id.
        </p>
      )}

      {hasRunId && (
        <>
          {isLoading && (
            <LoadingState variant="skeleton" message="Loading notification…" />
          )}

          {isError && error != null && !isLoading && (
            <ErrorState
              variant="card"
              error={error}
              title="Could not load notification"
              description="The notification API may be unavailable or the request was invalid."
              onRetry={() => refetch()}
            />
          )}

          {!isLoading && !isError && data === null && (
            <div
              className="flex gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800"
              role="status"
            >
              <Info
                className="h-5 w-5 shrink-0 text-slate-600 mt-0.5"
                aria-hidden
              />
              <div>
                <p className="font-medium text-foreground">
                  No failure notification for this run
                </p>
                <p className="mt-1 text-muted-foreground">
                  No CMS failure notification was recorded for this run.
                </p>
              </div>
            </div>
          )}

          {!isLoading && !isError && data != null && (
            <NotificationDetail notification={data.data} meta={data.meta} />
          )}
        </>
      )}
    </div>
  );
}
