import type { TodaysRenders } from "@/types/scheduler";
import type { RenderInProgressRow } from "@/types/renderInProgress";
import { formatHealthTimestampNoYear } from "@/lib/account-health/formatHealthTimestamp";

/** Renders processing longer than this are flagged (matches schedulers sidebar). */
export const STUCK_RENDER_THRESHOLD_MS = 30 * 60 * 1000;

export const RENDER_ATTENTION_ISSUE_MS = 2 * 60 * 60 * 1000;
export const RENDER_ATTENTION_ERROR_MS = 24 * 60 * 60 * 1000;

export type StuckRenderingSeverity = "warning" | "issue" | "error";

export interface StuckRenderingAttentionItem {
  schedulerId: number | null;
  accountId: number | null;
  accountName: string;
  accountType: string;
  schedulerName: string;
  renderId: number | null;
  renderName: string | null;
  startedAt: string | null;
  elapsedMs: number | null;
  severity: StuckRenderingSeverity;
  label: string;
}

function isRenderInProgress(item: TodaysRenders): boolean {
  if (item.render?.complete) return false;
  return item.isRendering || item.render?.processing === true;
}

function resolveElapsedMs(
  startedAt: string | null | undefined,
  nowMs: number
): number | null {
  if (!startedAt) return null;
  const start = Date.parse(startedAt);
  if (!Number.isFinite(start)) return null;
  return Math.max(0, nowMs - start);
}

export function resolveStuckRenderingSeverity(
  elapsedMs: number | null
): StuckRenderingSeverity {
  if (elapsedMs == null) return "warning";
  if (elapsedMs >= RENDER_ATTENTION_ERROR_MS) return "error";
  if (elapsedMs >= RENDER_ATTENTION_ISSUE_MS) return "issue";
  return "warning";
}

function buildStuckRenderingLabel(
  item: TodaysRenders,
  severity: StuckRenderingSeverity
): string {
  if (item.isRendering && !item.render) {
    return "Rendering (no render record)";
  }
  const base = item.render?.processing ? "Stuck processing" : "Stuck rendering";
  if (severity === "error") return `${base} · critical`;
  if (severity === "issue") return `${base} · delayed`;
  return base;
}

function displayAccountName(item: TodaysRenders): string {
  return (
    item.accountName?.trim() ||
    item.schedulerName?.trim() ||
    `Scheduler ${item.schedulerId}`
  );
}

/** Human copy for panel descriptions. Source is every Processing render, not today's slot. */
export const STUCK_RENDERING_POLICY_DESCRIPTION =
  "Renders still processing for 30m+, including older scheduler slots (warning 30m · issue 2h · critical 24h+).";

export function formatStuckRenderingElapsedLabel(
  elapsedMs: number | null,
  startedAt: string | null
): string {
  if (elapsedMs == null) return "Duration unknown";

  const sec = Math.floor(elapsedMs / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const parts: string[] = [];
  if (hr > 0) parts.push(`${hr}h`);
  if (min % 60 > 0 || hr > 0) parts.push(`${min % 60}m`);
  if (parts.length === 0) parts.push(`${sec}s`);

  const elapsed = `${parts.join(" ")} (running)`;
  if (elapsedMs >= RENDER_ATTENTION_ERROR_MS && startedAt) {
    const started = formatHealthTimestampNoYear(startedAt);
    return started ? `${elapsed} · since ${started}` : elapsed;
  }
  return elapsed;
}

/**
 * Schedulers/renders stuck or actively processing in the today's-renders payload.
 */
export function getStuckRenderingAttention(
  items: TodaysRenders[],
  nowMs: number = Date.now()
): StuckRenderingAttentionItem[] {
  const results: StuckRenderingAttentionItem[] = [];

  for (const item of items) {
    if (item.render?.complete) continue;

    const accountName = displayAccountName(item);
    const base = {
      schedulerId: item.schedulerId,
      accountId: item.accountId,
      accountName,
      accountType: item.accountType,
      schedulerName: item.schedulerName,
      renderId: item.render?.renderId ?? null,
      renderName: item.render?.renderName ?? null,
    };

    if (item.isRendering && !item.render) {
      const startedAt = item.scheduledTime ?? null;
      const elapsedMs = resolveElapsedMs(startedAt, nowMs);
      results.push({
        ...base,
        startedAt,
        elapsedMs,
        severity: resolveStuckRenderingSeverity(elapsedMs),
        label: buildStuckRenderingLabel(item, resolveStuckRenderingSeverity(elapsedMs)),
      });
      continue;
    }

    if (!isRenderInProgress(item)) continue;

    const startedAt = item.render?.startedAt ?? null;
    const elapsedMs = resolveElapsedMs(startedAt, nowMs);
    const isStuck =
      elapsedMs != null && elapsedMs >= STUCK_RENDER_THRESHOLD_MS;

    if (!isStuck) continue;

    const severity = resolveStuckRenderingSeverity(elapsedMs);
    results.push({
      ...base,
      startedAt,
      elapsedMs,
      severity,
      label: buildStuckRenderingLabel(item, severity),
    });
  }

  const severityRank: Record<StuckRenderingSeverity, number> = {
    error: 0,
    issue: 1,
    warning: 2,
  };

  results.sort((a, b) => {
    const sa = severityRank[a.severity];
    const sb = severityRank[b.severity];
    if (sa !== sb) return sa - sb;
    return (b.elapsedMs ?? 0) - (a.elapsedMs ?? 0);
  });

  return results;
}

/**
 * Currently rendering or processing (including not yet stuck).
 */
export function getActiveRenderingCount(items: TodaysRenders[]): number {
  return items.filter(isRenderInProgress).length;
}

function buildInProgressLabel(
  complete: boolean,
  severity: StuckRenderingSeverity,
  startedAt: string | null
): string {
  if (!startedAt) return "Processing · start time unknown";
  const base = complete ? "Processing and complete" : "Stuck processing";
  if (severity === "error") return `${base} · critical`;
  if (severity === "issue") return `${base} · delayed`;
  return base;
}

function displayInProgressAccountName(row: RenderInProgressRow): string {
  const name = row.accountName?.trim();
  if (name) return name;
  if (row.accountId != null) return `Account ${row.accountId}`;
  return `Render ${row.renderId}`;
}

/**
 * Processing renders from GET /api/render/admin/in-progress that have run 30m+.
 * Rows with no start time stay on the list because elapsed time cannot be ruled out.
 */
export function getStuckRenderingAttentionFromInProgress(
  rows: RenderInProgressRow[],
  nowMs: number = Date.now()
): StuckRenderingAttentionItem[] {
  const results: StuckRenderingAttentionItem[] = [];

  for (const row of rows) {
    if (!row.processing) continue;

    const startedAt = row.startedAt;
    const elapsedMs = resolveElapsedMs(startedAt, nowMs);
    const isUnderThreshold =
      elapsedMs != null && elapsedMs < STUCK_RENDER_THRESHOLD_MS;
    if (isUnderThreshold) continue;

    const severity = resolveStuckRenderingSeverity(elapsedMs);
    results.push({
      schedulerId: row.schedulerId,
      accountId: row.accountId,
      accountName: displayInProgressAccountName(row),
      accountType: row.accountType ?? "",
      schedulerName: row.schedulerName ?? "",
      renderId: row.renderId,
      renderName: row.renderName,
      startedAt,
      elapsedMs,
      severity,
      label: buildInProgressLabel(row.complete, severity, startedAt),
    });
  }

  const severityRank: Record<StuckRenderingSeverity, number> = {
    error: 0,
    issue: 1,
    warning: 2,
  };

  results.sort((a, b) => {
    const sa = severityRank[a.severity];
    const sb = severityRank[b.severity];
    if (sa !== sb) return sa - sb;
    return (b.elapsedMs ?? 0) - (a.elapsedMs ?? 0);
  });

  return results;
}
