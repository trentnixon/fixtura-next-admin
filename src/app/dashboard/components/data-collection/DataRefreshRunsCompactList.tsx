"use client";

import Link from "next/link";
import { Database, ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { useLiveRunClock } from "@/hooks/account-asset-run/useLiveRunClock";
import {
  getAccountHealthRunDetailHref,
  getAccountPagePath,
} from "@/lib/account-health/accountRoutes";
import { formatHealthTimestampNoYear } from "@/lib/account-health/formatHealthTimestamp";
import {
  EMPTY_RUN_RESULT_LABEL,
  getSummaryEmptyReason,
  healthRunStatusBadgeClass,
  isHealthRunActive,
} from "@/lib/account-health/displayRules";
import {
  activeRunElapsedMs,
  formatDurationMs,
  isStuckActiveRun,
  runDurationMs,
  type RunWithTimestamps,
} from "@/lib/account-health/globalRunAnalytics";
import type { AccountHealthGlobalLatestRunRow } from "@/types/accountHealth";
import { cn } from "@/lib/utils";

function toRunRow(run: AccountHealthGlobalLatestRunRow): RunWithTimestamps {
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

function accountLabel(run: AccountHealthGlobalLatestRunRow): string {
  return (
    run.accountName?.trim() ||
    run.primaryOrgLabel?.trim() ||
    `Account ${run.accountId}`
  );
}

interface DataRefreshRunsCompactListProps {
  runs: AccountHealthGlobalLatestRunRow[];
  limit?: number;
}

export function DataRefreshRunsCompactList({
  runs,
  limit = 10,
}: DataRefreshRunsCompactListProps) {
  const hasActive = runs.some((run) => isHealthRunActive(run.status));
  const nowMs = useLiveRunClock(hasActive);
  const visible = runs.slice(0, limit);

  if (visible.length === 0) {
    return (
      <EmptyState
        variant="minimal"
        title="No refresh runs"
        description="No runs match this filter in the recent window."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200">
      {visible.map((run) => {
        const rowMeta = toRunRow(run);
        const stuck = isStuckActiveRun(rowMeta);
        const failed = run.status === "failed";
        const empty = getSummaryEmptyReason(run.summary);
        const accountHref = getAccountPagePath(run.accountId, run.accountType);
        const runHref = getAccountHealthRunDetailHref(run.id, run.accountId);
        const durationMs = isHealthRunActive(run.status)
          ? activeRunElapsedMs(rowMeta, nowMs)
          : runDurationMs(rowMeta);

        return (
          <div
            key={run.id}
            className={cn(
              "grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-slate-200 px-3 py-2.5 text-sm last:border-b-0",
              failed && "bg-red-50/40",
              stuck && !failed && "bg-amber-50/40"
            )}
          >
            <div
              className={cn(
                "rounded-md p-1.5",
                failed
                  ? "bg-red-100 text-red-700"
                  : stuck
                    ? "bg-amber-100 text-amber-700"
                    : "bg-sky-50 text-sky-700"
              )}
            >
              <Database className="h-3.5 w-3.5" />
            </div>

            <div className="min-w-0">
              <Link
                href={accountHref}
                className="truncate font-medium text-slate-800 hover:text-primary hover:underline"
              >
                {accountLabel(run)}
              </Link>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                <span className="capitalize">{run.accountType}</span>
                <span className="text-muted-foreground/60">·</span>
                <span>{formatHealthTimestampNoYear(run.startedAt)}</span>
                <span className="text-muted-foreground/60">·</span>
                <span className="tabular-nums font-medium">
                  {formatDurationMs(durationMs)}
                  {stuck ? " (stuck)" : ""}
                </span>
                {empty.isEmptyResult ? (
                  <>
                    <span className="text-muted-foreground/60">·</span>
                    <span title={empty.reasonDisplay ?? undefined}>
                      {EMPTY_RUN_RESULT_LABEL}
                    </span>
                  </>
                ) : null}
                {run.failureReason ? (
                  <>
                    <span className="text-muted-foreground/60">·</span>
                    <span className="text-red-700">{run.failureReason}</span>
                  </>
                ) : null}
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <Badge
                variant="outline"
                className={cn("capitalize", healthRunStatusBadgeClass(run.status))}
              >
                {run.status}
                {stuck ? " · stuck" : ""}
              </Badge>
              <Link
                href={runHref}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <ListChecks className="h-3 w-3" />
                Open run
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
