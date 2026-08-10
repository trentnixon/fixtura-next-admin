import { formatDurationMs } from "@/lib/account-health/globalRunAnalytics";
import type {
  AccountAssetRunDetail,
  AccountAssetRunItem,
  AccountAssetRunItemStatus,
} from "@/types/accountAssetRun";
import { sortAssetRunItems } from "@/lib/account-asset-run/displayRules";

const ACTIVE_ITEM_STATUSES: AccountAssetRunItemStatus[] = [
  "pending",
  "queued",
  "running",
];

export type ResolvedAssetRunStepTiming = {
  startedAt: string | null;
  endedAt: string | null;
  durationMs: number | null;
  startLabel: string;
  endLabel: string;
  durationLabel: string;
  inferred: boolean;
};

function parseMs(iso: string | null | undefined): number | null {
  if (iso == null || iso.trim() === "") return null;
  const ms = new Date(iso).getTime();
  return Number.isNaN(ms) ? null : ms;
}

function toIso(ms: number): string {
  return new Date(ms).toISOString();
}

function readNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function readSummaryTiming(summary: Record<string, unknown> | null): {
  startedAt: string | null;
  completedAt: string | null;
  failedAt: string | null;
  durationMs: number | null;
  durationFormatted: string | null;
} {
  if (!summary) {
    return {
      startedAt: null,
      completedAt: null,
      failedAt: null,
      durationMs: null,
      durationFormatted: null,
    };
  }

  const metrics =
    summary.metrics && typeof summary.metrics === "object"
      ? (summary.metrics as Record<string, unknown>)
      : null;
  const metadata =
    summary.metadata && typeof summary.metadata === "object"
      ? (summary.metadata as Record<string, unknown>)
      : null;

  return {
    startedAt:
      readString(summary.startedAt) ??
      readString(summary.started_at) ??
      readString(metadata?.startedAt),
    completedAt:
      readString(summary.completedAt) ??
      readString(summary.completed_at) ??
      readString(summary.endedAt) ??
      readString(summary.finishedAt) ??
      readString(metadata?.completedAt),
    failedAt:
      readString(summary.failedAt) ??
      readString(summary.failed_at) ??
      readString(metadata?.failedAt),
    durationMs:
      readNumber(summary.durationMs) ??
      readNumber(summary.elapsedMs) ??
      readNumber(metrics?.durationMs) ??
      readNumber(metadata?.durationMs),
    durationFormatted:
      readString(summary.durationFormatted) ??
      readString(metrics?.durationFormatted),
  };
}

function itemCompletionIso(
  item: AccountAssetRunItem,
  summaryTiming: ReturnType<typeof readSummaryTiming>,
): string | null {
  return (
    item.failedAt ??
    item.completedAt ??
    summaryTiming.failedAt ??
    summaryTiming.completedAt ??
    item.updatedAt ??
    null
  );
}

function itemStartIso(
  item: AccountAssetRunItem,
  summaryTiming: ReturnType<typeof readSummaryTiming>,
): string | null {
  return item.startedAt ?? summaryTiming.startedAt ?? item.createdAt ?? null;
}

/** Bull queue ids often end with enqueue epoch ms, e.g. `...:1780051711704`. */
function parseTrailingEpochMs(value: string): number | null {
  const parts = value.split(":");
  for (let i = parts.length - 1; i >= 0; i -= 1) {
    const n = Number(parts[i]);
    if (Number.isFinite(n) && n > 1_000_000_000_000) return n;
  }
  return null;
}

function readBullJobTiming(item: AccountAssetRunItem): {
  startMs: number | null;
  endMs: number | null;
} {
  const ids: string[] = [];
  if (item.bullJobId) ids.push(item.bullJobId);
  if (Array.isArray(item.bullJobIds)) {
    for (const id of item.bullJobIds) {
      if (typeof id === "string") ids.push(id);
    }
  }

  const epochs = ids
    .map(parseTrailingEpochMs)
    .filter((value): value is number => value != null);

  if (epochs.length === 0) {
    return { startMs: null, endMs: null };
  }

  return {
    startMs: Math.min(...epochs),
    endMs: Math.max(...epochs),
  };
}

function durationLabelFromMs(
  ms: number | null,
  options?: { running?: boolean; formatted?: string | null },
): string {
  if (options?.formatted) return options.formatted;
  if (ms == null || ms < 0) return "—";
  const label = formatDurationMs(ms);
  return options?.running ? `${label} (running)` : label;
}

/** Whole-run elapsed time from startedAt to completedAt, failedAt, or live clock. */
export function assetRunDurationMs(
  run: Pick<
    AccountAssetRunDetail,
    "startedAt" | "completedAt" | "failedAt"
  >,
  options?: { isLive?: boolean; nowMs?: number },
): number | null {
  const start = parseMs(run.startedAt);
  if (start == null) return null;

  const end =
    parseMs(run.completedAt) ??
    parseMs(run.failedAt) ??
    (options?.isLive ? (options.nowMs ?? Date.now()) : null);

  if (end == null || end < start) return null;
  return end - start;
}

export function formatAssetRunDuration(
  run: Pick<
    AccountAssetRunDetail,
    "startedAt" | "completedAt" | "failedAt"
  >,
  options?: { isLive?: boolean; nowMs?: number },
): string {
  const ms = assetRunDurationMs(run, options);
  if (ms == null) return "—";
  const label = formatDurationMs(ms);
  if (options?.isLive && run.completedAt == null && run.failedAt == null) {
    return `${label} (running)`;
  }
  return label;
}

/**
 * Resolve per-step start/end/duration from item fields, resultSummary, Strapi
 * timestamps, and sequential chaining against the run envelope.
 */
export function buildAssetRunStepTimings(
  items: AccountAssetRunItem[],
  run: Pick<
    AccountAssetRunDetail,
    "startedAt" | "completedAt" | "failedAt" | "status"
  >,
  options?: { isLive?: boolean; nowMs?: number },
): Map<number, ResolvedAssetRunStepTiming> {
  const sorted = sortAssetRunItems(items);
  const runStartMs = parseMs(run.startedAt);
  const runEndMs =
    parseMs(run.completedAt) ??
    parseMs(run.failedAt) ??
    (options?.isLive ? (options.nowMs ?? Date.now()) : null);

  const starts: Array<number | null> = [];
  const ends: Array<number | null> = [];
  const durationFromSummary: Array<number | null> = [];
  const durationFormatted: Array<string | null> = [];
  const skipped: boolean[] = [];

  for (const item of sorted) {
    const summaryTiming = readSummaryTiming(item.resultSummary);
    skipped.push(item.status === "skipped");
    durationFromSummary.push(summaryTiming.durationMs);
    durationFormatted.push(summaryTiming.durationFormatted);

    const bullTiming = readBullJobTiming(item);

    const startMs =
      parseMs(itemStartIso(item, summaryTiming)) ??
      parseMs(item.createdAt) ??
      bullTiming.startMs;

    let endMs =
      parseMs(itemCompletionIso(item, summaryTiming)) ??
      bullTiming.endMs ??
      null;

    if (
      endMs == null &&
      summaryTiming.durationMs != null &&
      startMs != null
    ) {
      endMs = startMs + summaryTiming.durationMs;
    }

    starts.push(startMs);
    ends.push(endMs);
  }

  // Forward-fill starts from previous step completion or run start.
  for (let i = 0; i < sorted.length; i += 1) {
    if (skipped[i]) continue;
    if (starts[i] != null) continue;
    if (i === 0) {
      starts[i] = runStartMs;
      continue;
    }
    if (ends[i - 1] != null) {
      starts[i] = ends[i - 1];
    }
  }

  // Backward-fill ends from next step start or run end.
  for (let i = sorted.length - 1; i >= 0; i -= 1) {
    if (skipped[i]) continue;
    if (ends[i] != null) continue;

    const nextStart = i < sorted.length - 1 ? starts[i + 1] : null;
    if (nextStart != null) {
      ends[i] = nextStart;
      continue;
    }

    const isLast = i === sorted.length - 1;
    const item = sorted[i];
    const isActive = ACTIVE_ITEM_STATUSES.includes(
      item.status as AccountAssetRunItemStatus,
    );

    if (isLast && runEndMs != null && !isActive) {
      ends[i] = runEndMs;
      continue;
    }

    if (isActive && options?.isLive) {
      ends[i] = options.nowMs ?? Date.now();
      continue;
    }

    if (
      durationFromSummary[i] != null &&
      starts[i] != null
    ) {
      ends[i] = starts[i]! + durationFromSummary[i]!;
    }
  }

  // Fill any remaining gaps where only duration is known.
  for (let i = 0; i < sorted.length; i += 1) {
    if (skipped[i]) continue;
    if (ends[i] == null && starts[i] != null && durationFromSummary[i] != null) {
      ends[i] = starts[i]! + durationFromSummary[i]!;
    }
  }

  const result = new Map<number, ResolvedAssetRunStepTiming>();

  sorted.forEach((item, index) => {
    if (skipped[index]) {
      result.set(item.id, {
        startedAt: null,
        endedAt: null,
        durationMs: null,
        startLabel: "—",
        endLabel: "—",
        durationLabel: "Skipped",
        inferred: false,
      });
      return;
    }

    const startMs = starts[index];
    let endMs = ends[index];
    const isActive = ACTIVE_ITEM_STATUSES.includes(
      item.status as AccountAssetRunItemStatus,
    );

    if (isActive && options?.isLive && endMs == null && startMs != null) {
      endMs = options.nowMs ?? Date.now();
    }

    const durationMs =
      startMs != null && endMs != null && endMs >= startMs
        ? endMs - startMs
        : durationFromSummary[index];

    const hadExplicitItemTiming = Boolean(
      item.startedAt ||
        item.completedAt ||
        item.failedAt ||
        item.updatedAt ||
        readSummaryTiming(item.resultSummary).durationMs ||
        readBullJobTiming(item).startMs ||
        readBullJobTiming(item).endMs,
    );

    const inferred =
      !hadExplicitItemTiming &&
      (startMs != null || endMs != null || durationMs != null);

    result.set(item.id, {
      startedAt: startMs != null ? toIso(startMs) : null,
      endedAt: endMs != null ? toIso(endMs) : null,
      durationMs,
      startLabel: startMs != null ? formatTimestamp(startMs) : "—",
      endLabel:
        endMs != null
          ? formatTimestamp(endMs)
          : isActive && options?.isLive
            ? "In progress"
            : "—",
      durationLabel: durationLabelFromMs(durationMs, {
        running: isActive && options?.isLive === true,
        formatted: durationFormatted[index],
      }),
      inferred,
    });
  });

  return result;
}

function formatTimestamp(ms: number): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(ms));
  } catch {
    return new Date(ms).toLocaleString();
  }
}

export function formatAssetRunStepStart(
  timing: ResolvedAssetRunStepTiming | undefined,
): string {
  return timing?.startLabel ?? "—";
}

export function formatAssetRunStepEnd(
  timing: ResolvedAssetRunStepTiming | undefined,
): string {
  return timing?.endLabel ?? "—";
}

export function formatAssetRunStepDuration(
  timing: ResolvedAssetRunStepTiming | undefined,
): string {
  return timing?.durationLabel ?? "—";
}
