import type {
  AccountHealthGlobalLatestRunRow,
  AccountHealthRunStatus,
  AccountHealthRunSummary,
  StatusCounts,
} from "@/types/accountHealth";
import {
  getSummaryEmptyReason,
  isHealthRunActive,
} from "@/lib/account-health/displayRules";

/** Default: active run with startedAt older than this is "stuck" */
export const STUCK_RUN_THRESHOLD_MS = 2 * 60 * 60 * 1000;

export type RunWithTimestamps = {
  id: number;
  accountId?: number;
  status: AccountHealthRunStatus;
  startedAt: string | null;
  finalizedAt: string | null;
  failedAt?: string | null;
  failureReason?: string | null;
  summary?: AccountHealthRunSummary | null;
};

export type OutlierFilter =
  | "all"
  | "failed"
  | "stuck"
  | "slowest"
  | "empty"
  | "repeat_failures";

export type PartitionedOutliers = {
  failed: RunWithTimestamps[];
  stuck: RunWithTimestamps[];
  slowest: RunWithTimestamps[];
  emptyResult: RunWithTimestamps[];
  repeatFailureAccountIds: number[];
};

export type RunsByDayRow = {
  date: string;
  total: number;
  failed: number;
  empty: number;
  active: number;
  finalized: number;
};

export type AtAGlanceMetrics = {
  totalRunsInWindow: number;
  failedCount: number;
  failedRatePercent: number | null;
  emptyResultCount: number;
  avgDurationMs: number | null;
  avgDurationLabel: string;
  dateRangeLabel: string;
};

function parseMs(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : null;
}

export function runDurationMs(run: RunWithTimestamps): number | null {
  const start = parseMs(run.startedAt);
  const end = parseMs(run.finalizedAt) ?? parseMs(run.failedAt);
  if (start == null || end == null || end < start) return null;
  return end - start;
}

export function formatDurationMs(ms: number | null): string {
  if (ms == null || ms < 0) return "—";
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ${sec % 60}s`;
  const hr = Math.floor(min / 60);
  return `${hr}h ${min % 60}m`;
}

export function isStuckActiveRun(
  run: RunWithTimestamps,
  thresholdMs: number = STUCK_RUN_THRESHOLD_MS
): boolean {
  if (!isHealthRunActive(run.status)) return false;
  const started = parseMs(run.startedAt);
  if (started == null) return false;
  return Date.now() - started > thresholdMs;
}

export function isFailedRun(run: RunWithTimestamps): boolean {
  return (
    run.status === "failed" ||
    Boolean(run.failureReason?.trim())
  );
}

function toRunWithTimestamps(
  row: AccountHealthGlobalLatestRunRow
): RunWithTimestamps {
  return {
    id: row.id,
    accountId: row.accountId,
    status: row.status,
    startedAt: row.startedAt,
    finalizedAt: row.finalizedAt,
    failedAt: row.failedAt,
    failureReason: row.failureReason,
    summary: row.summary,
  };
}

export function partitionOutliers(
  latestRuns: AccountHealthGlobalLatestRunRow[]
): PartitionedOutliers {
  const runs = latestRuns.map(toRunWithTimestamps);

  const failed = runs.filter(isFailedRun);
  const stuck = runs.filter((r) => isStuckActiveRun(r));
  const emptyResult = runs.filter(
    (r) => getSummaryEmptyReason(r.summary ?? null).isEmptyResult
  );

  const withDuration = runs
    .map((r) => ({ run: r, ms: runDurationMs(r) }))
    .filter((x): x is { run: RunWithTimestamps; ms: number } => x.ms != null)
    .sort((a, b) => b.ms - a.ms);

  const slowest = withDuration.slice(0, 5).map((x) => x.run);

  const failedByAccount = new Map<number, number>();
  for (const r of failed) {
    if (r.accountId == null) continue;
    failedByAccount.set(
      r.accountId,
      (failedByAccount.get(r.accountId) ?? 0) + 1
    );
  }
  const repeatFailureAccountIds = [...failedByAccount.entries()]
    .filter(([, count]) => count >= 2)
    .map(([id]) => id);

  return {
    failed,
    stuck,
    slowest,
    emptyResult,
    repeatFailureAccountIds,
  };
}

export function filterRunsByOutlier(
  runs: AccountHealthGlobalLatestRunRow[],
  filter: OutlierFilter,
  partitioned: PartitionedOutliers
): AccountHealthGlobalLatestRunRow[] {
  if (filter === "all") return sortRunsForDisplay(runs);

  const idSet = (list: RunWithTimestamps[]) =>
    new Set(list.map((r) => r.id));

  switch (filter) {
    case "failed":
      return sortRunsForDisplay(
        runs.filter((r) => idSet(partitioned.failed).has(r.id))
      );
    case "stuck":
      return sortRunsForDisplay(
        runs.filter((r) => idSet(partitioned.stuck).has(r.id))
      );
    case "slowest":
      return sortRunsForDisplay(
        runs.filter((r) => idSet(partitioned.slowest).has(r.id))
      );
    case "empty":
      return sortRunsForDisplay(
        runs.filter((r) => idSet(partitioned.emptyResult).has(r.id))
      );
    case "repeat_failures":
      return sortRunsForDisplay(
        runs.filter(
          (r) =>
            partitioned.repeatFailureAccountIds.includes(r.accountId) &&
            isFailedRun(toRunWithTimestamps(r))
        )
      );
    default:
      return sortRunsForDisplay(runs);
  }
}

function runSortPriority(run: AccountHealthGlobalLatestRunRow): number {
  if (run.status === "failed") return 0;
  if (isStuckActiveRun(toRunWithTimestamps(run))) return 1;
  if (isHealthRunActive(run.status)) return 2;
  return 3;
}

export function sortRunsForDisplay(
  runs: AccountHealthGlobalLatestRunRow[]
): AccountHealthGlobalLatestRunRow[] {
  return [...runs].sort((a, b) => {
    const pa = runSortPriority(a);
    const pb = runSortPriority(b);
    if (pa !== pb) return pa - pb;
    const ta = parseMs(a.startedAt) ?? 0;
    const tb = parseMs(b.startedAt) ?? 0;
    return tb - ta;
  });
}

export function runsByDay(
  latestRuns: AccountHealthGlobalLatestRunRow[]
): RunsByDayRow[] {
  const byDate = new Map<string, RunsByDayRow>();

  for (const run of latestRuns) {
    const started = parseMs(run.startedAt);
    const date = started
      ? new Date(started).toISOString().slice(0, 10)
      : "unknown";
    const row = byDate.get(date) ?? {
      date,
      total: 0,
      failed: 0,
      empty: 0,
      active: 0,
      finalized: 0,
    };
    row.total += 1;
    if (run.status === "failed") row.failed += 1;
    else if (getSummaryEmptyReason(run.summary).isEmptyResult) row.empty += 1;
    else if (isHealthRunActive(run.status)) row.active += 1;
    else if (run.status === "finalized" || run.status === "completed")
      row.finalized += 1;
    byDate.set(date, row);
  }

  return [...byDate.values()]
    .filter((r) => r.date !== "unknown")
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function computeAtAGlanceMetrics(
  runs: RunWithTimestamps[],
  runCounts?: StatusCounts
): AtAGlanceMetrics {
  const totalRunsInWindow = runs.length;
  const failedCount = runs.filter(isFailedRun).length;
  const emptyResultCount = runs.filter(
    (r) => getSummaryEmptyReason(r.summary ?? null).isEmptyResult
  ).length;

  const failedRatePercent =
    totalRunsInWindow > 0
      ? Math.round((failedCount / totalRunsInWindow) * 100)
      : null;

  const durations = runs
    .map(runDurationMs)
    .filter((ms): ms is number => ms != null);
  const avgDurationMs =
    durations.length > 0
      ? Math.round(
          durations.reduce((a, b) => a + b, 0) / durations.length
        )
      : null;

  const starts = runs
    .map((r) => parseMs(r.startedAt))
    .filter((t): t is number => t != null);
  const ends = runs
    .map((r) => parseMs(r.finalizedAt) ?? parseMs(r.failedAt))
    .filter((t): t is number => t != null);

  let dateRangeLabel = "No runs in window";
  if (starts.length > 0) {
    const min = new Date(Math.min(...starts));
    const max = new Date(Math.max(...ends.length ? ends : starts));
    dateRangeLabel = `${min.toLocaleDateString()} – ${max.toLocaleDateString()}`;
  }

  const terminalFromCounts = runCounts
    ? Object.entries(runCounts).reduce((sum, [, n]) => sum + n, 0)
    : null;
  if (terminalFromCounts != null && terminalFromCounts > totalRunsInWindow) {
    dateRangeLabel += ` (${totalRunsInWindow} recent shown)`;
  }

  return {
    totalRunsInWindow,
    failedCount,
    failedRatePercent,
    emptyResultCount,
    avgDurationMs,
    avgDurationLabel: formatDurationMs(avgDurationMs),
    dateRangeLabel,
  };
}

export function getOutlierCounts(partitioned: PartitionedOutliers) {
  return {
    failed: partitioned.failed.length,
    stuck: partitioned.stuck.length,
    slowest: partitioned.slowest.length,
    empty: partitioned.emptyResult.length,
    repeat_failures: partitioned.repeatFailureAccountIds.length,
  };
}
