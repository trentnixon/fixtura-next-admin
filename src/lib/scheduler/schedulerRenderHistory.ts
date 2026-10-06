import { resolveDownloadPrimaryErrorMessage } from "@/lib/downloads/downloadAttention";
import { STUCK_RENDER_THRESHOLD_MS } from "@/lib/scheduler/renderAttention";
import type { Render } from "@/types/render";

const SYDNEY_TIME_ZONE = "Australia/Sydney";

/** History table shows this many newest attempts. */
export const LATEST_SCHEDULER_RENDER_COUNT = 25;

export type SchedulerRenderOutcome = "running" | "success" | "failed";

export function schedulerRenderOutcome(input: {
  complete: boolean;
  processing: boolean;
}): SchedulerRenderOutcome {
  if (input.complete) return "success";
  if (input.processing) return "running";
  return "failed";
}

export function renderStartedAt(render: Render): string | null {
  return render.attributes.createdAt || render.attributes.publishedAt || null;
}

export function renderRecencyMs(render: Render): number {
  const stamp =
    render.attributes.createdAt ||
    render.attributes.publishedAt ||
    render.attributes.updatedAt;
  const time = stamp ? Date.parse(stamp) : Number.NaN;
  return Number.isFinite(time) ? time : 0;
}

export function latestSchedulerRenders(renders: readonly Render[]): {
  rows: Render[];
  total: number;
} {
  const sorted = [...renders].sort((a, b) => {
    const byTime = renderRecencyMs(b) - renderRecencyMs(a);
    if (byTime !== 0) return byTime;
    return b.id - a.id;
  });
  return {
    rows: sorted.slice(0, LATEST_SCHEDULER_RENDER_COUNT),
    total: sorted.length,
  };
}

export function formatSydneyDateTime(iso: string | null | undefined): string {
  if (!iso) return "--";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "--";

  const datePart = new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: SYDNEY_TIME_ZONE,
  }).format(date);
  const timePart = new Intl.DateTimeFormat("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: SYDNEY_TIME_ZONE,
  }).format(date);

  return `${datePart}, ${timePart}`;
}

/** Scheduler `Time` is a clock value. Label it so 09:00 is Sydney wall time. */
export function formatSydneyScheduleTime(time: string | null | undefined): string {
  const match = time ? /^(\d{1,2}):(\d{2})/.exec(time.trim()) : null;
  if (!match) return "time not set";
  return `${match[1].padStart(2, "0")}:${match[2]} Sydney`;
}

export function renderDurationMs(input: {
  startedAt: string | null;
  updatedAt: string | null;
  processing: boolean;
  nowMs: number;
}): number | null {
  if (!input.startedAt) return null;
  const start = Date.parse(input.startedAt);
  if (!Number.isFinite(start)) return null;
  const end = input.processing
    ? input.nowMs
    : input.updatedAt
      ? Date.parse(input.updatedAt)
      : input.nowMs;
  if (!Number.isFinite(end)) return null;
  return Math.max(0, end - start);
}

export function isStalledRender(input: {
  processing: boolean;
  durationMs: number | null;
}): boolean {
  return (
    input.processing &&
    input.durationMs != null &&
    input.durationMs >= STUCK_RENDER_THRESHOLD_MS
  );
}

export function formatRenderDuration(durationMs: number | null): string {
  if (durationMs == null) return "--";
  return `${Math.floor(durationMs / 60_000)}m`;
}

/**
 * Seconds from the scheduler clock time on the Sydney date of `startedAt`
 * until the render was created. Early pickup is 0.
 */
export function queueWaitSeconds(input: {
  scheduleTime: string | null | undefined;
  startedAt: string | null;
}): number | null {
  if (!input.startedAt || !input.scheduleTime) return null;
  const clock = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(input.scheduleTime.trim());
  if (!clock) return null;
  const started = new Date(input.startedAt);
  if (Number.isNaN(started.getTime())) return null;

  const day = sydneyDateParts(started);
  if (!day) return null;

  const dueMs = sydneyWallTimeToUtcMs({
    year: day.year,
    month: day.month,
    day: day.day,
    hour: Number(clock[1]),
    minute: Number(clock[2]),
    second: clock[3] ? Number(clock[3]) : 0,
  });
  return Math.max(0, Math.round((started.getTime() - dueMs) / 1000));
}

export function formatQueueWait(waitSeconds: number | null): string {
  if (waitSeconds == null) return "--";
  return `${waitSeconds}s`;
}

export function renderFailureMessage(render: Render): string | null {
  const downloads = render.attributes.downloads?.data ?? [];
  for (const download of downloads) {
    const message = resolveDownloadPrimaryErrorMessage(
      download.attributes?.UserErrorMessage,
      download.attributes?.errorHandler,
    );
    if (message) return message;
  }
  return null;
}

export function relationCount(relation: unknown): number {
  if (typeof relation !== "object" || relation === null) return 0;
  if ("count" in relation && typeof relation.count === "number") {
    return relation.count;
  }
  if ("data" in relation && Array.isArray(relation.data)) {
    return relation.data.length;
  }
  return 0;
}

function sydneyDateParts(
  instant: Date,
): { year: number; month: number; day: number } | null {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SYDNEY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);
  const year = Number(partValue(parts, "year"));
  const month = Number(partValue(parts, "month"));
  const day = Number(partValue(parts, "day"));
  if (!year || !month || !day) return null;
  return { year, month, day };
}

function sydneyWallTimeToUtcMs(input: {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}): number {
  const guess = Date.UTC(
    input.year,
    input.month - 1,
    input.day,
    input.hour,
    input.minute,
    input.second,
  );
  const offset = sydneyOffsetMs(new Date(guess));
  const utc = guess - offset;
  const offsetAtUtc = sydneyOffsetMs(new Date(utc));
  if (offsetAtUtc === offset) return utc;
  return guess - offsetAtUtc;
}

function sydneyOffsetMs(instant: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SYDNEY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instant);
  const hour = Number(partValue(parts, "hour"));
  const asUtc = Date.UTC(
    Number(partValue(parts, "year")),
    Number(partValue(parts, "month")) - 1,
    Number(partValue(parts, "day")),
    hour === 24 ? 0 : hour,
    Number(partValue(parts, "minute")),
    Number(partValue(parts, "second")),
  );
  return asUtc - instant.getTime();
}

function partValue(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): string {
  return parts.find((part) => part.type === type)?.value ?? "";
}
