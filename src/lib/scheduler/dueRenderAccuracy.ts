const SYDNEY_TIME_ZONE = "Australia/Sydney";

/** Inclusive day count. CMS rejects a span longer than 90 Sydney days. */
export const DUE_RENDER_RANGE_MAX_DAYS = 90;

export type DueRenderSlot = {
  dueAt: string;
  isRendering: boolean;
  queued: boolean;
  render: {
    complete: boolean;
    processing: boolean;
  } | null;
};

export type DueRenderAccuracy =
  | { kind: "none" }
  | { kind: "upcoming"; upcoming: number }
  | {
      kind: "scored";
      percent: number;
      processed: number;
      due: number;
      inProgress: number;
      missed: number;
      failed: number;
      upcoming: number;
    };

export function sydneyCalendarDate(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SYDNEY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function readDateKey(dateKey: string): { year: number; month: number; day: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) return null;
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

/** Calendar shift on the YYYY-MM-DD key. Daylight saving does not change the date math. */
export function shiftSydneyDate(dateKey: string, dayDelta: number): string {
  const parts = readDateKey(dateKey);
  if (!parts) return dateKey;
  const utc = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + dayDelta));
  const year = utc.getUTCFullYear();
  const month = String(utc.getUTCMonth() + 1).padStart(2, "0");
  const day = String(utc.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Inclusive range ending on endDate. dayCount 7 ending 5 Oct starts 29 Sep. */
export function lastSydneyDays(
  endDate: string,
  dayCount: number,
): { from: string; to: string } {
  const count = Math.max(1, dayCount);
  return { from: shiftSydneyDate(endDate, -(count - 1)), to: endDate };
}

/**
 * Inclusive Sydney dates from `from` through `to`.
 * Returns null when the span is longer than DUE_RENDER_RANGE_MAX_DAYS.
 */
export function sydneyDatesInRange(from: string, to: string): string[] | null {
  const start = from <= to ? from : to;
  const end = from <= to ? to : from;
  const dates: string[] = [];
  let cursor = start;

  while (cursor <= end) {
    dates.push(cursor);
    if (dates.length > DUE_RENDER_RANGE_MAX_DAYS) return null;
    cursor = shiftSydneyDate(cursor, 1);
  }

  return dates;
}

export function formatSydneyDayLabel(dateKey: string): string {
  const parts = readDateKey(dateKey);
  if (!parts) return dateKey;
  const utc = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(utc);
}

export function formatSydneyRangeLabel(from: string, to: string): string {
  const start = from <= to ? from : to;
  const end = from <= to ? to : from;
  if (start === end) return formatSydneyDayLabel(start);
  return `${formatSydneyDayLabel(start)} to ${formatSydneyDayLabel(end)}`;
}

function hasComeUp(dueAt: string, nowMs: number): boolean {
  const dueMs = Date.parse(dueAt);
  if (!Number.isFinite(dueMs)) return true;
  return dueMs <= nowMs;
}

function isInProgress(slot: DueRenderSlot): boolean {
  if (slot.render?.complete) return false;
  return slot.isRendering || slot.queued || slot.render?.processing === true;
}

export type DueRenderOutcome =
  | "upcoming"
  | "processed"
  | "inProgress"
  | "missed"
  | "failed";

export function classifyDueRender(
  slot: DueRenderSlot,
  nowMs: number,
): DueRenderOutcome {
  if (!hasComeUp(slot.dueAt, nowMs)) return "upcoming";
  if (slot.render?.complete) return "processed";
  if (isInProgress(slot)) return "inProgress";
  if (slot.render == null) return "missed";
  return "failed";
}

export function dueRenderDateKey(dueAt: string): string {
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(dueAt);
  return match?.[1] ?? dueAt;
}

export type DueRenderDayRow = {
  date: string;
  label: string;
  processed: number;
  inProgress: number;
  missed: number;
  failed: number;
  upcoming: number;
};

export function dueRendersByDay(
  slots: DueRenderSlot[],
  nowMs: number,
): DueRenderDayRow[] {
  const byDate = new Map<string, DueRenderDayRow>();

  for (const slot of slots) {
    const date = dueRenderDateKey(slot.dueAt);
    const row = byDate.get(date) ?? {
      date,
      label: formatSydneyDayLabel(date),
      processed: 0,
      inProgress: 0,
      missed: 0,
      failed: 0,
      upcoming: 0,
    };
    row[classifyDueRender(slot, nowMs)] += 1;
    byDate.set(date, row);
  }

  return Array.from(byDate.values()).sort((left, right) =>
    left.date < right.date ? -1 : left.date > right.date ? 1 : 0,
  );
}

export type DueRenderAttentionSlot = DueRenderSlot & {
  schedulerId: number;
  accountId: number;
  accountName: string;
  accountType: string;
  scheduledTime: string;
  render:
    | ({
        complete: boolean;
        processing: boolean;
        renderId: number;
        failureReason: string | null;
      })
    | null;
};

export type DueRenderAttentionOutcome = "missed" | "failed" | "inProgress";

export type DueRenderAttentionRow = {
  key: string;
  schedulerId: number;
  accountId: number;
  accountName: string;
  accountType: string;
  scheduledTime: string;
  dateKey: string;
  outcome: DueRenderAttentionOutcome;
  renderId: number | null;
  failureReason: string | null;
};

const ATTENTION_ORDER: Record<DueRenderAttentionOutcome, number> = {
  missed: 0,
  failed: 1,
  inProgress: 2,
};

export function dueRenderAttentionRows(
  slots: DueRenderAttentionSlot[],
  nowMs: number,
): DueRenderAttentionRow[] {
  const rows: DueRenderAttentionRow[] = [];

  for (const slot of slots) {
    const outcome = classifyDueRender(slot, nowMs);
    if (outcome === "processed" || outcome === "upcoming") continue;
    rows.push({
      key: `${slot.schedulerId}-${slot.dueAt}`,
      schedulerId: slot.schedulerId,
      accountId: slot.accountId,
      accountName: slot.accountName.trim() || `Account ${slot.accountId}`,
      accountType: slot.accountType,
      scheduledTime: slot.scheduledTime.slice(0, 5),
      dateKey: dueRenderDateKey(slot.dueAt),
      outcome,
      renderId: slot.render?.renderId ?? null,
      failureReason: slot.render?.failureReason ?? null,
    });
  }

  rows.sort((left, right) => {
    const outcomeDelta = ATTENTION_ORDER[left.outcome] - ATTENTION_ORDER[right.outcome];
    if (outcomeDelta !== 0) return outcomeDelta;
    return left.dateKey < right.dateKey ? -1 : left.dateKey > right.dateKey ? 1 : 0;
  });

  return rows;
}

/**
 * Accuracy for one Sydney day.
 * Slots whose dueAt is still ahead stay out of the percentage.
 */
export function scoreDueRenders(
  slots: DueRenderSlot[],
  nowMs: number,
): DueRenderAccuracy {
  if (slots.length === 0) return { kind: "none" };

  let processed = 0;
  let inProgress = 0;
  let missed = 0;
  let failed = 0;
  let upcoming = 0;

  for (const slot of slots) {
    const outcome = classifyDueRender(slot, nowMs);
    if (outcome === "upcoming") upcoming += 1;
    else if (outcome === "processed") processed += 1;
    else if (outcome === "inProgress") inProgress += 1;
    else if (outcome === "missed") missed += 1;
    else failed += 1;
  }

  const due = processed + inProgress + missed + failed;
  if (due === 0) return { kind: "upcoming", upcoming };

  return {
    kind: "scored",
    percent: Math.round((processed / due) * 100),
    processed,
    due,
    inProgress,
    missed,
    failed,
    upcoming,
  };
}

export function dueRenderAccuracyMeta(
  score: DueRenderAccuracy,
  rangeLabel: string,
): string {
  if (score.kind === "none") return `No renders were due · ${rangeLabel}`;
  if (score.kind === "upcoming") {
    const waiting =
      score.upcoming === 1 ? "1 still to come" : `${score.upcoming} still to come`;
    return `${waiting} · ${rangeLabel}`;
  }

  const parts = [`${score.processed} of ${score.due} finished`];
  if (score.inProgress > 0) parts.push(`${score.inProgress} in progress`);
  if (score.missed > 0) parts.push(`${score.missed} missed`);
  if (score.failed > 0) parts.push(`${score.failed} failed`);
  if (score.upcoming > 0) parts.push(`${score.upcoming} still to come`);
  parts.push(rangeLabel);
  return parts.join(" · ");
}
