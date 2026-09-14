"use client";

import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Database,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardLinkButton } from "../live-snapshot/DashboardLinkButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ErrorState from "@/components/ui-library/states/ErrorState";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { Skeleton } from "@/components/ui/skeleton";
import { useLiveRunClock } from "@/hooks/account-asset-run/useLiveRunClock";
import {
  getAccountHealthRunDetailHref,
  getAccountPagePath,
} from "@/lib/account-health/accountRoutes";
import { formatHealthTimestampNoYear } from "@/lib/account-health/formatHealthTimestamp";
import {
  activeRunElapsedMs,
  formatDurationMs,
  maxDataRefreshAttentionSeverity,
  resolveDataRefreshAttentionSeverity,
  type DataRefreshAttentionRun,
  type DataRefreshAttentionSeverity,
} from "@/lib/account-health/globalRunAnalytics";
import AbortAccountHealthRunButton from "@/app/dashboard/accounts/components/account-health/AbortAccountHealthRunButton";
import ReconcileAccountHealthRunButton from "@/app/dashboard/accounts/components/account-health/ReconcileAccountHealthRunButton";
import { cn } from "@/lib/utils";

interface DataRefreshAttentionPanelProps {
  runs: DataRefreshAttentionRun[];
  activeCount: number;
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
  /** Active runs reported by API but missing from latestRuns window. */
  hiddenActiveCount?: number;
  /** When true, omit outer title — parent section provides the heading. */
  embedded?: boolean;
  /** Compact record rows for overview panels; default table for full views. */
  layout?: "table" | "rows";
  /** Reconcile / abort shortcuts on fleet views. */
  showOperatorActions?: boolean;
}

function SyncRunOperatorActions({ run }: { run: DataRefreshAttentionRun }) {
  if (run.attentionKind === "completed_limbo") {
    return (
      <ReconcileAccountHealthRunButton
        runId={run.id}
        accountId={run.accountId}
        size="sm"
      />
    );
  }
  if (
    run.attentionKind === "stuck" ||
    (run.attentionKind === "active" && run.severity === "error")
  ) {
    return (
      <AbortAccountHealthRunButton
        runId={run.id}
        accountId={run.accountId}
        size="sm"
      />
    );
  }
  return null;
}

const PANEL_THEME: Record<
  DataRefreshAttentionSeverity,
  {
    border: string;
    bg: string;
    headerText: string;
    subText: string;
    tableBorder: string;
    tableHeader: string;
    iconClass: string;
  }
> = {
  normal: {
    border: "border-sky-200",
    bg: "bg-sky-50/70",
    headerText: "text-sky-950",
    subText: "text-sky-900/80",
    tableBorder: "border-sky-200/80",
    tableHeader: "bg-sky-100/60 hover:bg-sky-100/60",
    iconClass: "text-sky-700",
  },
  warning: {
    border: "border-amber-200",
    bg: "bg-amber-50/70",
    headerText: "text-amber-950",
    subText: "text-amber-900/80",
    tableBorder: "border-amber-200/80",
    tableHeader: "bg-amber-100/60 hover:bg-amber-100/60",
    iconClass: "text-amber-700",
  },
  issue: {
    border: "border-orange-300",
    bg: "bg-orange-50/75",
    headerText: "text-orange-950",
    subText: "text-orange-900/80",
    tableBorder: "border-orange-200/80",
    tableHeader: "bg-orange-100/70 hover:bg-orange-100/70",
    iconClass: "text-orange-700",
  },
  error: {
    border: "border-red-300",
    bg: "bg-red-50/75",
    headerText: "text-red-950",
    subText: "text-red-900/80",
    tableBorder: "border-red-200/80",
    tableHeader: "bg-red-100/70 hover:bg-red-100/70",
    iconClass: "text-red-700",
  },
};

function severityBadgeClass(severity: DataRefreshAttentionSeverity): string {
  switch (severity) {
    case "error":
      return "border-red-300 bg-red-100 text-red-900";
    case "issue":
      return "border-orange-300 bg-orange-100 text-orange-900";
    case "warning":
      return "border-amber-300 bg-amber-100 text-amber-900";
    default:
      return "border-sky-300 bg-sky-100 text-sky-900";
  }
}

function severityRowClass(severity: DataRefreshAttentionSeverity): string {
  switch (severity) {
    case "error":
      return "bg-red-50/80";
    case "issue":
      return "bg-orange-50/70";
    case "warning":
      return "bg-amber-50/70";
    default:
      return "";
  }
}

function PanelIcon({ severity }: { severity: DataRefreshAttentionSeverity }) {
  if (severity === "error") {
    return <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />;
  }
  if (severity === "issue" || severity === "warning") {
    return (
      <AlertTriangle
        className={cn("mt-0.5 h-5 w-5 shrink-0", PANEL_THEME[severity].iconClass)}
      />
    );
  }
  return <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />;
}

function toRunRow(run: DataRefreshAttentionRun) {
  return {
    id: run.id,
    accountId: run.accountId,
    status: run.status,
    startedAt: run.startedAt,
    finalizedAt: run.finalizedAt,
    failedAt: run.failedAt,
    failureReason: run.failureReason,
    summary: run.summary,
  };
}

function formatElapsedCell(
  run: DataRefreshAttentionRun,
  elapsedMs: number | null
): string {
  if (run.attentionKind === "completed_limbo") {
    return "Not finalized";
  }

  if (elapsedMs == null) {
    return "No start time";
  }

  return `${formatDurationMs(elapsedMs)} (running)`;
}

function runActionLabel(run: DataRefreshAttentionRun): string {
  if (run.attentionKind === "completed_limbo") {
    return "Reconcile run";
  }
  if (run.attentionKind === "stuck") {
    return "View stuck run";
  }
  return "View run";
}

function runActionVariant(
  run: DataRefreshAttentionRun
): "destructive" | "accent" | "primary" {
  if (run.attentionKind === "completed_limbo" || run.severity === "error") {
    return "destructive";
  }
  if (run.severity === "issue" || run.severity === "warning") {
    return "accent";
  }
  return "primary";
}

/**
 * Dashboard alert list for account sync runs that are active, stuck, or in completed limbo.
 */
function HiddenActiveRunsBanner({ count }: { count: number }) {
  return (
    <div className="rounded-md border border-red-300 bg-red-50/90 px-4 py-3 text-sm text-red-950">
      <p className="font-medium">
        {count} active account sync{count === 1 ? "" : "s"} not shown in the
        recent run window
      </p>
      <p className="mt-1 text-xs text-red-900/85">
        Long-running or stalled syncs may be missing from the list below. Open
        Data Collection or Strapi account-health runs to inspect the full fleet.
      </p>
    </div>
  );
}

export function DataRefreshAttentionPanel({
  runs,
  activeCount,
  isLoading,
  error,
  onRetry,
  hiddenActiveCount = 0,
  embedded = false,
  layout = "table",
  showOperatorActions = false,
}: DataRefreshAttentionPanelProps) {
  const hasLiveClock = runs.some((run) => run.attentionKind !== "completed_limbo");
  const nowMs = useLiveRunClock(hasLiveClock);

  if (!isLoading && !error && runs.length === 0 && hiddenActiveCount === 0) {
    return null;
  }

  const panelSeverity = maxDataRefreshAttentionSeverity(runs) ?? "normal";
  const theme = PANEL_THEME[panelSeverity];

  const errorCount = runs.filter((run) => run.severity === "error").length;
  const issueCount = runs.filter((run) => run.severity === "issue").length;
  const warningCount = runs.filter((run) => run.severity === "warning").length;

  const visibleActive = runs.filter(
    (run) => run.attentionKind === "active" || run.attentionKind === "stuck"
  ).length;
  const hiddenActive =
    activeCount > visibleActive ? activeCount - visibleActive : 0;

  const summaryParts = [
    errorCount > 0 ? `${errorCount} error` : null,
    issueCount > 0 ? `${issueCount} issue` : null,
    warningCount > 0 ? `${warningCount} warning` : null,
  ].filter(Boolean);

  if (isLoading) {
    return (
      <LoadingState variant="skeleton">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </LoadingState>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "rounded-lg border border-red-200 bg-red-50/60 p-4",
          embedded && "border-0 bg-transparent p-0"
        )}
      >
        <ErrorState
          variant="default"
          title="Could not load account sync status"
          error={error}
          onRetry={onRetry}
        />
      </div>
    );
  }

  const runRows = runs.map((run) => {
    const rowMeta = toRunRow(run);
    const elapsedMs = activeRunElapsedMs(rowMeta, nowMs);
    const liveSeverity = resolveDataRefreshAttentionSeverity(
      { ...run, attentionKind: run.attentionKind },
      nowMs
    );
    const elapsedLabel = formatElapsedCell(run, elapsedMs);
    const accountLabel =
      run.accountName?.trim() ||
      run.primaryOrgLabel?.trim() ||
      `Account ${run.accountId}`;
    const runHref = getAccountHealthRunDetailHref(run.id, run.accountId);

    return {
      run,
      liveSeverity,
      elapsedLabel,
      accountLabel,
      runHref,
    };
  });

  if (!isLoading && !error && runs.length === 0 && hiddenActiveCount > 0) {
    return (
      <HiddenActiveRunsBanner count={hiddenActiveCount} />
    );
  }

  if (embedded && layout === "rows") {
    return (
      <div className="space-y-3">
        {hiddenActiveCount > 0 ? (
          <HiddenActiveRunsBanner count={hiddenActiveCount} />
        ) : null}
        {hiddenActive > 0 ? (
          <p className={cn("text-xs", theme.subText)}>
            Showing {visibleActive} of {activeCount} active runs from the recent
            window. Older active runs may not appear here.
          </p>
        ) : null}

        <div className="overflow-hidden rounded-md border border-slate-200">
          {runRows.map(
            ({ run, liveSeverity, elapsedLabel, accountLabel, runHref }) => (
              <div
                key={run.id}
                className={cn(
                  "grid grid-cols-1 gap-2 border-b border-slate-200 px-3 py-2.5 last:border-b-0 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-3",
                  severityRowClass(liveSeverity)
                )}
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-slate-900">
                    {accountLabel}
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                    <span className="capitalize">{run.accountType}</span>
                    <span className="text-muted-foreground/60">·</span>
                    <span>{elapsedLabel}</span>
                    {run.startedAt ? (
                      <>
                        <span className="text-muted-foreground/60">·</span>
                        <span>
                          {formatHealthTimestampNoYear(run.startedAt) ?? "—"}
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={cn("w-fit shrink-0", severityBadgeClass(liveSeverity))}
                >
                  {run.attentionKind === "completed_limbo" ? (
                    <Database className="mr-1 h-3 w-3" />
                  ) : null}
                  {run.attentionLabel}
                </Badge>

                <div className="flex w-fit shrink-0 flex-wrap items-center gap-2 sm:justify-self-end">
                  {showOperatorActions ? (
                    <SyncRunOperatorActions run={run} />
                  ) : null}
                  <Button
                    variant={runActionVariant(run)}
                    size="sm"
                    className="w-fit shrink-0"
                    asChild
                  >
                    <Link href={runHref}>
                      {runActionLabel(run)}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border shadow-sm",
        embedded ? "p-0" : "p-4",
        theme.border,
        embedded ? "bg-white" : theme.bg
      )}
    >
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-2",
          embedded ? "border-b px-4 py-3" : "mb-3",
          embedded && theme.tableHeader
        )}
      >
        {embedded ? (
          <p className={cn("text-xs", theme.subText)}>
            {runs.length} run{runs.length === 1 ? "" : "s"}
            {summaryParts.length > 0 ? ` · ${summaryParts.join(" · ")}` : ""}
            <span className="mx-2 text-muted-foreground/60">·</span>
            Warning 20m · Issue 30m · Error 1h+
          </p>
        ) : (
          <div className="flex items-start gap-2">
            <PanelIcon severity={panelSeverity} />
            <div>
              <h3 className={cn("text-sm font-semibold", theme.headerText)}>
                Account sync — needs attention
              </h3>
              <p className={cn("text-xs", theme.subText)}>
                {runs.length} account{runs.length === 1 ? "" : "s"} with an
                active, stuck, or unreconciled data refresh
                {summaryParts.length > 0
                  ? ` · ${summaryParts.join(" · ")}`
                  : ""}
              </p>
            </div>
          </div>
        )}

        <DashboardLinkButton
          href="/dashboard?tab=collection"
          trailingIcon="external"
          className="bg-white/80"
        >
          Data Collection
        </DashboardLinkButton>
      </div>

      {hiddenActiveCount > 0 && runs.length > 0 ? (
        <div className={cn(embedded ? "px-4 pt-3" : "mb-3")}>
          <HiddenActiveRunsBanner count={hiddenActiveCount} />
        </div>
      ) : null}

      {hiddenActive > 0 ? (
        <p className={cn("text-xs", embedded ? "px-4 pt-3" : "mb-3", theme.subText)}>
          Showing {visibleActive} of {activeCount} active runs from the recent
          window. Older active runs may not appear here.
        </p>
      ) : null}

      <div
        className={cn(
          "overflow-x-auto",
          embedded ? "" : "rounded-md border bg-white/80",
          !embedded && theme.tableBorder
        )}
      >
        <Table>
          <TableHeader>
            <TableRow className={theme.tableHeader}>
              <TableHead>Account</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Elapsed</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runRows.map(
              ({ run, liveSeverity, elapsedLabel, accountLabel, runHref }) => (
                <TableRow
                  key={run.id}
                  className={severityRowClass(liveSeverity)}
                >
                  <TableCell>
                    <div className="text-sm font-medium">{accountLabel}</div>
                    <div className="text-xs capitalize text-muted-foreground">
                      {run.accountType}
                      <span className="mx-1.5 text-muted-foreground/60">·</span>
                      <Link
                        href={getAccountPagePath(run.accountId, run.accountType)}
                        className="text-primary hover:underline"
                      >
                        Account
                      </Link>
                      <span className="mx-1.5 text-muted-foreground/60">·</span>
                      <span className="font-mono">#{run.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={severityBadgeClass(liveSeverity)}
                    >
                      {run.attentionKind === "completed_limbo" ? (
                        <Database className="mr-1 h-3 w-3" />
                      ) : null}
                      {run.attentionLabel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {run.severityLabel ? (
                      <Badge
                        variant="outline"
                        className={severityBadgeClass(liveSeverity)}
                      >
                        {run.severityLabel}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {formatHealthTimestampNoYear(run.startedAt) ?? "—"}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "whitespace-nowrap text-sm font-medium tabular-nums",
                      liveSeverity === "error" && "text-red-800",
                      liveSeverity === "issue" && "text-orange-800",
                      liveSeverity === "warning" && "text-amber-800"
                    )}
                  >
                    {elapsedLabel}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      {showOperatorActions ? (
                        <SyncRunOperatorActions run={run} />
                      ) : null}
                      <Button
                        variant={runActionVariant(run)}
                        size="sm"
                        className="shrink-0"
                        asChild
                      >
                        <Link href={runHref}>
                          {runActionLabel(run)}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
