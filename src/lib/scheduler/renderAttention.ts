import type { TodaysRenders } from "@/types/scheduler";

/** Renders processing longer than this are flagged as stuck (matches schedulers sidebar). */
export const STUCK_RENDER_THRESHOLD_MS = 30 * 60 * 1000;

export type StuckRenderingSeverity = "warning" | "stuck";

export interface StuckRenderingAttentionItem {
  schedulerId: number;
  accountId: number;
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

function displayAccountName(item: TodaysRenders): string {
  return (
    item.accountName?.trim() ||
    item.schedulerName?.trim() ||
    `Scheduler ${item.schedulerId}`
  );
}

/**
 * Accounts/schedulers stuck or actively processing today's renders.
 * Stuck = processing/rendering for at least {@link STUCK_RENDER_THRESHOLD_MS}.
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
      results.push({
        ...base,
        startedAt: item.scheduledTime ?? null,
        elapsedMs: resolveElapsedMs(item.scheduledTime, nowMs),
        severity: "warning",
        label: "Rendering (no render record)",
      });
      continue;
    }

    if (!isRenderInProgress(item)) continue;

    const startedAt = item.render?.startedAt ?? null;
    const elapsedMs = resolveElapsedMs(startedAt, nowMs);
    const isStuck =
      elapsedMs != null && elapsedMs >= STUCK_RENDER_THRESHOLD_MS;

    if (!isStuck) continue;

    results.push({
      ...base,
      startedAt,
      elapsedMs,
      severity: "stuck",
      label: item.render?.processing ? "Stuck processing" : "Stuck rendering",
    });
  }

  results.sort((a, b) => (b.elapsedMs ?? 0) - (a.elapsedMs ?? 0));

  return results;
}

/**
 * Currently rendering or processing (including not yet stuck).
 */
export function getActiveRenderingCount(items: TodaysRenders[]): number {
  return items.filter(isRenderInProgress).length;
}
