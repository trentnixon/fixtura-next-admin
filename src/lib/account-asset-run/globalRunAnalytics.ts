import { formatDurationMs } from "@/lib/account-health/globalRunAnalytics";
import { buildAssetRunStepTimings } from "@/lib/account-asset-run/itemTiming";
import {
  ASSET_RUN_SCOPE_ORDER,
  isAssetRunActive,
  sortAssetRunItems,
} from "@/lib/account-asset-run/displayRules";
import { getAccountAssetRunScopeLabel } from "@/lib/account-asset-run/scopeLabels";
import type {
  AccountAssetRunDetail,
  AccountAssetRunListRow,
} from "@/types/accountAssetRun";

/** Active asset run with startedAt older than this is "stuck" */
export const ASSET_RUN_STUCK_THRESHOLD_MS = 2 * 60 * 60 * 1000;

export type AssetRunOutlierFilter =
  | "all"
  | "active"
  | "failed"
  | "stuck"
  | "slowest"
  | "repeat_failures";

export type AssetRunRunsByDayRow = {
  date: string;
  total: number;
  completed: number;
  failed: number;
  active: number;
};

export type AssetRunAtAGlanceMetrics = {
  totalRunsInWindow: number;
  activeCount: number;
  failedCount: number;
  completedCount: number;
  failedRatePercent: number | null;
  avgDurationMs: number | null;
  medianDurationMs: number | null;
  p90DurationMs: number | null;
  avgDurationLabel: string;
  medianDurationLabel: string;
  p90DurationLabel: string;
  dateRangeLabel: string;
  runsWithDurationCount: number;
};

export type AssetRunPartitionedOutliers = {
  active: AccountAssetRunListRow[];
  failed: AccountAssetRunListRow[];
  stuck: AccountAssetRunListRow[];
  slowest: AccountAssetRunListRow[];
  repeatFailureAccountIds: number[];
};

export type AssetRunStepDurationAggregate = {
  scope: string;
  label: string;
  sampleCount: number;
  avgDurationMs: number | null;
  maxDurationMs: number | null;
  avgDurationLabel: string;
  maxDurationLabel: string;
};

function parseMs(iso: string | null | undefined): number | null {
  if (iso == null || iso.trim() === "") return null;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : null;
}

/** Parse trailing epoch ms from runKey, e.g. `...:ondemand:full:1779750000000`. */
export function parseRunKeyStartedAt(runKey: string): string | null {
  const parts = runKey.split(":");
  for (let i = parts.length - 1; i >= 0; i -= 1) {
    const n = Number(parts[i]);
    if (Number.isFinite(n) && n > 1_000_000_000_000) {
      return new Date(n).toISOString();
    }
  }
  return null;
}

export function resolveAssetRunStartedAt(
  row: AccountAssetRunListRow
): string | null {
  if (row.startedAt) return row.startedAt;
  if (row.runKey) return parseRunKeyStartedAt(row.runKey);
  return null;
}

export function assetRunListDurationMs(
  row: AccountAssetRunListRow,
  options?: { nowMs?: number }
): number | null {
  const start = parseMs(resolveAssetRunStartedAt(row));
  if (start == null) return null;

  const nowMs = options?.nowMs ?? Date.now();
  const end =
    parseMs(row.completedAt) ??
    parseMs(row.failedAt) ??
    (isAssetRunActive(row.status) ? nowMs : null);

  if (end == null || end < start) return null;
  return end - start;
}

export function isStuckAssetRun(
  row: AccountAssetRunListRow,
  thresholdMs: number = ASSET_RUN_STUCK_THRESHOLD_MS,
  nowMs: number = Date.now()
): boolean {
  if (!isAssetRunActive(row.status)) return false;
  const started = parseMs(resolveAssetRunStartedAt(row));
  if (started == null) return false;
  return nowMs - started > thresholdMs;
}

export function isFailedAssetRun(row: AccountAssetRunListRow): boolean {
  return row.status === "failed" || Boolean(row.failureReason?.trim());
}

function percentile(sorted: number[], p: number): number | null {
  if (sorted.length === 0) return null;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(idx, sorted.length - 1))] ?? null;
}

export function computeAssetRunAtAGlanceMetrics(
  rows: AccountAssetRunListRow[],
  nowMs: number = Date.now()
): AssetRunAtAGlanceMetrics {
  const totalRunsInWindow = rows.length;
  const activeCount = rows.filter((r) => isAssetRunActive(r.status)).length;
  const failedCount = rows.filter(isFailedAssetRun).length;
  const completedCount = rows.filter((r) => r.status === "completed").length;

  const failedRatePercent =
    totalRunsInWindow > 0
      ? Math.round((failedCount / totalRunsInWindow) * 100)
      : null;

  const durations = rows
    .map((r) => assetRunListDurationMs(r, { nowMs }))
    .filter((ms): ms is number => ms != null)
    .sort((a, b) => a - b);

  const avgDurationMs =
    durations.length > 0
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : null;
  const medianDurationMs = percentile(durations, 50);
  const p90DurationMs = percentile(durations, 90);

  const starts = rows
    .map((r) => parseMs(resolveAssetRunStartedAt(r)))
    .filter((t): t is number => t != null);
  const ends = rows
    .flatMap((r) => [
      parseMs(r.completedAt),
      parseMs(r.failedAt),
    ])
    .filter((t): t is number => t != null);

  let dateRangeLabel = "No runs in window";
  if (starts.length > 0) {
    const min = new Date(Math.min(...starts));
    const max = new Date(Math.max(...(ends.length ? ends : starts)));
    dateRangeLabel = `${min.toLocaleDateString()} – ${max.toLocaleDateString()}`;
  }

  return {
    totalRunsInWindow,
    activeCount,
    failedCount,
    completedCount,
    failedRatePercent,
    avgDurationMs,
    medianDurationMs,
    p90DurationMs,
    avgDurationLabel: formatDurationMs(avgDurationMs),
    medianDurationLabel: formatDurationMs(medianDurationMs),
    p90DurationLabel: formatDurationMs(p90DurationMs),
    dateRangeLabel,
    runsWithDurationCount: durations.length,
  };
}

export function partitionAssetRunOutliers(
  rows: AccountAssetRunListRow[],
  nowMs: number = Date.now()
): AssetRunPartitionedOutliers {
  const active = rows.filter((r) => isAssetRunActive(r.status));
  const failed = rows.filter(isFailedAssetRun);
  const stuck = rows.filter((r) => isStuckAssetRun(r, ASSET_RUN_STUCK_THRESHOLD_MS, nowMs));

  const withDuration = rows
    .map((row) => ({ row, ms: assetRunListDurationMs(row, { nowMs }) }))
    .filter(
      (x): x is { row: AccountAssetRunListRow; ms: number } =>
        x.ms != null && x.row.status === "completed"
    )
    .sort((a, b) => b.ms - a.ms);

  const slowest = withDuration.slice(0, 8).map((x) => x.row);

  const failedByAccount = new Map<number, number>();
  for (const r of failed) {
    failedByAccount.set(
      r.accountId,
      (failedByAccount.get(r.accountId) ?? 0) + 1
    );
  }
  const repeatFailureAccountIds = [...failedByAccount.entries()]
    .filter(([, count]) => count >= 2)
    .map(([id]) => id);

  return {
    active,
    failed,
    stuck,
    slowest,
    repeatFailureAccountIds,
  };
}

function runSortPriority(row: AccountAssetRunListRow, nowMs: number): number {
  if (row.status === "failed") return 0;
  if (isStuckAssetRun(row, ASSET_RUN_STUCK_THRESHOLD_MS, nowMs)) return 1;
  if (isAssetRunActive(row.status)) return 2;
  return 3;
}

export function sortAssetRunsForDisplay(
  rows: AccountAssetRunListRow[],
  nowMs: number = Date.now()
): AccountAssetRunListRow[] {
  return [...rows].sort((a, b) => {
    const pa = runSortPriority(a, nowMs);
    const pb = runSortPriority(b, nowMs);
    if (pa !== pb) return pa - pb;
    const ta = parseMs(resolveAssetRunStartedAt(a)) ?? 0;
    const tb = parseMs(resolveAssetRunStartedAt(b)) ?? 0;
    return tb - ta;
  });
}

export function filterAssetRunsByOutlier(
  rows: AccountAssetRunListRow[],
  filter: AssetRunOutlierFilter,
  partitioned: AssetRunPartitionedOutliers,
  nowMs: number = Date.now()
): AccountAssetRunListRow[] {
  if (filter === "all") return sortAssetRunsForDisplay(rows, nowMs);

  const idSet = (list: AccountAssetRunListRow[]) =>
    new Set(list.map((r) => r.id));

  switch (filter) {
    case "active":
      return sortAssetRunsForDisplay(
        rows.filter((r) => idSet(partitioned.active).has(r.id)),
        nowMs
      );
    case "failed":
      return sortAssetRunsForDisplay(
        rows.filter((r) => idSet(partitioned.failed).has(r.id)),
        nowMs
      );
    case "stuck":
      return sortAssetRunsForDisplay(
        rows.filter((r) => idSet(partitioned.stuck).has(r.id)),
        nowMs
      );
    case "slowest":
      return sortAssetRunsForDisplay(
        rows.filter((r) => idSet(partitioned.slowest).has(r.id)),
        nowMs
      );
    case "repeat_failures":
      return sortAssetRunsForDisplay(
        rows.filter(
          (r) =>
            partitioned.repeatFailureAccountIds.includes(r.accountId) &&
            isFailedAssetRun(r)
        ),
        nowMs
      );
    default:
      return sortAssetRunsForDisplay(rows, nowMs);
  }
}

export function assetRunsByDay(
  rows: AccountAssetRunListRow[]
): AssetRunRunsByDayRow[] {
  const byDate = new Map<string, AssetRunRunsByDayRow>();

  for (const row of rows) {
    const started = parseMs(resolveAssetRunStartedAt(row));
    const date = started
      ? new Date(started).toISOString().slice(0, 10)
      : row.scheduledDate?.slice(0, 10) ?? "unknown";

    const bucket = byDate.get(date) ?? {
      date,
      total: 0,
      completed: 0,
      failed: 0,
      active: 0,
    };
    bucket.total += 1;
    if (row.status === "failed") bucket.failed += 1;
    else if (row.status === "completed") bucket.completed += 1;
    else if (isAssetRunActive(row.status)) bucket.active += 1;
    byDate.set(date, bucket);
  }

  return [...byDate.values()]
    .filter((r) => r.date !== "unknown")
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getAssetRunOutlierCounts(
  partitioned: AssetRunPartitionedOutliers
) {
  return {
    active: partitioned.active.length,
    failed: partitioned.failed.length,
    stuck: partitioned.stuck.length,
    slowest: partitioned.slowest.length,
    repeat_failures: partitioned.repeatFailureAccountIds.length,
  };
}

/** Pick completed runs to sample for fleet-wide step timing (slowest first). */
export function pickRunsForStepMetricsSample(
  rows: AccountAssetRunListRow[],
  limit = 8,
  nowMs: number = Date.now()
): number[] {
  return rows
    .filter((r) => r.status === "completed")
    .map((row) => ({ id: row.id, ms: assetRunListDurationMs(row, { nowMs }) }))
    .filter((x): x is { id: number; ms: number } => x.ms != null)
    .sort((a, b) => b.ms - a.ms)
    .slice(0, limit)
    .map((x) => x.id);
}

export function aggregateStepDurationsFromRuns(
  runs: AccountAssetRunDetail[]
): AssetRunStepDurationAggregate[] {
  const totals = new Map<string, { sum: number; count: number; max: number }>();

  for (const scope of ASSET_RUN_SCOPE_ORDER) {
    totals.set(scope, { sum: 0, count: 0, max: 0 });
  }

  for (const run of runs) {
    const items = sortAssetRunItems(run.items ?? []);
    const timings = buildAssetRunStepTimings(items, run);

    for (const item of items) {
      if (item.status === "skipped") continue;
      const timing = timings.get(item.id);
      if (timing?.durationMs == null || timing.durationMs <= 0) continue;

      const bucket = totals.get(item.scope) ?? { sum: 0, count: 0, max: 0 };
      bucket.sum += timing.durationMs;
      bucket.count += 1;
      bucket.max = Math.max(bucket.max, timing.durationMs);
      totals.set(item.scope, bucket);
    }
  }

  return ASSET_RUN_SCOPE_ORDER.map((scope) => {
    const bucket = totals.get(scope) ?? { sum: 0, count: 0, max: 0 };
    const avgDurationMs =
      bucket.count > 0 ? Math.round(bucket.sum / bucket.count) : null;
    const maxDurationMs = bucket.max > 0 ? bucket.max : null;

    return {
      scope,
      label: getAccountAssetRunScopeLabel(scope),
      sampleCount: bucket.count,
      avgDurationMs,
      maxDurationMs,
      avgDurationLabel: formatDurationMs(avgDurationMs),
      maxDurationLabel: formatDurationMs(maxDurationMs),
    };
  }).filter((row) => row.sampleCount > 0);
}
