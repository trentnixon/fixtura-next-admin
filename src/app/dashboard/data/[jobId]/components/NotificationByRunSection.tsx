"use client";

import { useMemo, useState } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNotificationByJobRun } from "@/hooks/data-collection/useNotificationByJobRun";
import type { ScraperNotificationByRun } from "@/types/notificationByRun";
import { Bell, ChevronDown, Info, RefreshCw, Skull } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPercentage } from "@/utils/chart-formatters";

export type NotificationByRunIdSource = "query" | "job" | "completed";

interface NotificationByRunSectionProps {
  jobId: string;
  runId: string | undefined;
  runIdSource?: NotificationByRunIdSource;
}

function runIdSourceHint(
  source: NotificationByRunIdSource | undefined,
): string {
  switch (source) {
    case "query":
      return "Run id from URL (?runId=).";
    case "job":
      return "Run id from job summary.";
    case "completed":
      return "Run id from latest job.completed event in the fetched log.";
    default:
      return "";
  }
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

function issueRow(issue: unknown): {
  step: string;
  severity: string;
  message: string;
  url: string;
} {
  if (!issue || typeof issue !== "object") {
    return { step: "—", severity: "—", message: String(issue), url: "" };
  }
  const o = issue as Record<string, unknown>;
  return {
    step: typeof o.step === "string" ? o.step : "—",
    severity: typeof o.severity === "string" ? o.severity : "—",
    message: typeof o.message === "string" ? o.message : JSON.stringify(issue),
    url: typeof o.url === "string" ? o.url : "",
  };
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {notification.fatal === true && (
          <Badge variant="destructive" className="gap-1">
            <Skull className="h-3 w-3" aria-hidden />
            Fatal
          </Badge>
        )}
        {meta.returnedLatestByCreatedAt && (
          <Badge variant="warning">
            Multiple records; showing latest ({meta.duplicateCount} found)
          </Badge>
        )}
        {notification.errorRate != null &&
          !Number.isNaN(notification.errorRate) && (
            <span className="text-sm text-muted-foreground">
              Error rate:{" "}
              <span className="font-medium text-foreground">
                {formatDecimalErrorRate(Number(notification.errorRate))}
              </span>
            </span>
          )}
      </div>

      {metricEntries.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-medium text-foreground">Metrics</h4>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {metricEntries.map(([key, val]) => (
              <div
                key={key}
                className="rounded-md border bg-white px-3 py-2 text-sm"
              >
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {key}
                </p>
                <p className="mt-0.5 font-mono text-xs break-all">
                  {formatMetricValue(val)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {issues.length > 0 && <IssuesCollapsible issues={issues} />}

      {notification.scraperLog != null &&
        typeof notification.scraperLog === "object" && (
          <ScraperLogCollapsible log={notification.scraperLog} />
        )}
    </div>
  );
}

function IssuesCollapsible({ issues }: { issues: unknown[] }) {
  const [open, setOpen] = useState(issues.length <= 8);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-medium text-foreground">
          Issues ({issues.length})
        </h4>
        {issues.length > 8 && (
          <CollapsibleTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="gap-1">
              {open ? "Collapse" : "Expand"}
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  open && "rotate-180",
                )}
              />
            </Button>
          </CollapsibleTrigger>
        )}
      </div>
      <CollapsibleContent className="mt-2">
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="w-[100px]">Step</TableHead>
                <TableHead className="w-[90px]">Severity</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[120px]">URL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map((issue, i) => {
                const row = issueRow(issue);
                return (
                  <TableRow key={i}>
                    <TableCell className="font-mono text-xs">
                      {row.step}
                    </TableCell>
                    <TableCell className="text-xs">{row.severity}</TableCell>
                    <TableCell className="text-xs max-w-md break-words">
                      {row.message}
                    </TableCell>
                    <TableCell className="text-xs">
                      {row.url ? (
                        <a
                          href={row.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline-offset-2 hover:underline break-all"
                        >
                          Link
                        </a>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function ScraperLogCollapsible({ log }: { log: Record<string, unknown> }) {
  const [open, setOpen] = useState(false);
  const preview = useMemo(() => {
    try {
      return JSON.stringify(log, null, 2);
    } catch {
      return String(log);
    }
  }, [log]);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="gap-2">
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          />
          Linked scraper log (raw)
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <pre className="max-h-80 overflow-auto rounded-md border bg-slate-950 p-3 text-xs text-slate-100">
          {preview}
        </pre>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function NotificationByRunSection({
  jobId,
  runId,
  runIdSource,
}: NotificationByRunSectionProps) {
  const trimmedRun = runId?.trim() ?? "";
  const hasRunId = trimmedRun.length > 0;

  const { data, isLoading, error, refetch, isError, isFetching } =
    useNotificationByJobRun(
      hasRunId ? jobId : undefined,
      hasRunId ? trimmedRun : undefined,
    );

  const description = [
    "CMS failure notification for this job id and run id (if one was stored). Clean runs may have no row.",
    runIdSourceHint(runIdSource),
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <SectionContainer
      title="Notification by run"
      description={description}
      icon={<Bell className="h-6 w-6 text-slate-600" />}
      action={
        hasRunId ? (
          <Button
            type="button"
            variant="accent"
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
        ) : undefined
      }
    >
      <div className="space-y-4">
        {!hasRunId && (
          <p className="text-sm text-muted-foreground">
            No run id is available for this job yet. Add{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
              ?runId=…
            </code>{" "}
            to the URL, or wait until the job summary or completion log includes
            a run id.
          </p>
        )}

        {hasRunId && (
          <>
            <p className="text-xs text-muted-foreground font-mono break-all">
              jobId: {jobId} · runId: {trimmedRun}
            </p>

            {isLoading && (
              <LoadingState
                variant="skeleton"
                message="Loading notification…"
              />
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
                    A 404 here means there is no{" "}
                    <code className="rounded bg-white px-1 py-0.5 text-xs">
                      fixtura-scraper-notification
                    </code>{" "}
                    row for this job and run — for example the run completed
                    without issues/fatal, or no CMS row was created.
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
    </SectionContainer>
  );
}
