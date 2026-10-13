import type { NotificationIssueRow } from "@/types/notificationIssues";
import { formatStepLabel } from "../issues/utils/notificationIssuesTableUi";
import {
  isFailureSignatureRow,
  isWarningRow,
} from "../issues/utils/notificationIssueGroups";

/** Visible lines per chart. Remaining types roll into Other. */
export const ISSUE_TYPE_SERIES_LIMIT = 6;

const NET_ERROR = /net::ERR_[A-Z0-9_]+/;

/**
 * Stable label for one error or warning.
 * Page URLs and ids are stripped so the same failure stays one line.
 */
export function issueTypeKey(
  message: string | null | undefined,
  step: string | null | undefined,
): string {
  const raw = (message ?? "").replace(/\s+/g, " ").trim();
  const netError = raw.match(NET_ERROR);
  if (netError) return netError[0];

  const stripped = raw
    .replace(/https?:\/\/\S+/gi, " ")
    .replace(
      /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi,
      " ",
    )
    .replace(/\s+/g, " ")
    .replace(/\s+at\s*$/i, "")
    .trim();
  const sentence = (stripped.split(/(?<=[.!?])\s/)[0] ?? stripped)
    .replace(/[.\s]+$/, "")
    .trim();

  if (sentence) {
    return sentence.length > 96 ? `${sentence.slice(0, 93)}…` : sentence;
  }

  return formatStepLabel(step);
}

const DAY_MS = 86_400_000;

const ERROR_PALETTE = [
  "hsl(0, 72%, 51%)",
  "hsl(16, 80%, 46%)",
  "hsl(330, 70%, 46%)",
  "hsl(262, 60%, 52%)",
  "hsl(199, 80%, 40%)",
  "hsl(25, 85%, 42%)",
] as const;

const WARNING_PALETTE = [
  "hsl(38, 92%, 40%)",
  "hsl(48, 90%, 36%)",
  "hsl(28, 85%, 44%)",
  "hsl(72, 55%, 34%)",
  "hsl(168, 50%, 34%)",
  "hsl(210, 55%, 42%)",
] as const;

const OTHER_COLOR = "hsl(215, 16%, 47%)";

export type IssueTypeLane = "error" | "warning";

export type IssueTypeTrend = "growing" | "steady" | "falling" | "fixed";

export interface IssueTypeSeries {
  key: string;
  label: string;
  color: string;
  total: number;
  trend: IssueTypeTrend;
}

export interface IssueTypeTimelinePoint {
  bucket: string;
  [seriesKey: string]: string | number;
}

export interface IssueTypeTimeline {
  points: IssueTypeTimelinePoint[];
  series: IssueTypeSeries[];
  total: number;
}

export interface IssueTypeWindow {
  fromMs: number;
  toMs: number;
}

function utcDayStart(ms: number): number {
  const date = new Date(ms);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function bucketIso(dayStartMs: number): string {
  return new Date(dayStartMs).toISOString();
}

export function eachUtcDay(fromMs: number, toMs: number): string[] {
  const start = utcDayStart(fromMs);
  const end = utcDayStart(toMs);
  if (end < start) return [];
  const days: string[] = [];
  for (let cursor = start; cursor <= end; cursor += DAY_MS) {
    days.push(bucketIso(cursor));
  }
  return days;
}

function rowLane(row: NotificationIssueRow): IssueTypeLane | null {
  if (isFailureSignatureRow(row)) return "error";
  if (isWarningRow(row)) return "warning";
  return null;
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

/**
 * Compares the first half of the window with the second.
 * A type that has gone quiet in the latest days is fixed.
 */
export function classifyIssueTypeTrend(counts: number[]): IssueTypeTrend {
  if (counts.length === 0 || counts.every((count) => count === 0)) {
    return "steady";
  }

  const recentWindow = Math.min(3, Math.max(1, Math.ceil(counts.length * 0.2)));
  const recent = counts.slice(-recentWindow);
  const earlier = counts.slice(0, counts.length - recentWindow);
  if (recent.every((count) => count === 0) && earlier.some((count) => count > 0)) {
    return "fixed";
  }

  const split = Math.floor(counts.length / 2);
  if (split === 0) return "steady";

  const firstSum = sum(counts.slice(0, split));
  const secondSum = sum(counts.slice(split));
  if (secondSum > firstSum && secondSum >= firstSum * 1.25) return "growing";
  if (secondSum < firstSum && secondSum <= firstSum * 0.75) return "falling";
  return "steady";
}

export function buildIssueTypeTimeline(
  issues: NotificationIssueRow[],
  lane: IssueTypeLane,
  window?: IssueTypeWindow,
): IssueTypeTimeline {
  const countsByType = new Map<string, Map<string, number>>();

  for (const issue of issues) {
    if (rowLane(issue) !== lane) continue;
    const createdAt = issue.notification.createdAt;
    if (!createdAt) continue;
    const createdMs = Date.parse(createdAt);
    if (!Number.isFinite(createdMs)) continue;
    const bucket = bucketIso(utcDayStart(createdMs));
    const typeKey = issueTypeKey(issue.message, issue.step);
    const byDay = countsByType.get(typeKey) ?? new Map<string, number>();
    byDay.set(bucket, (byDay.get(bucket) ?? 0) + 1);
    countsByType.set(typeKey, byDay);
  }

  const ranked = [...countsByType.entries()]
    .map(([typeKey, byDay]) => ({
      typeKey,
      total: sum([...byDay.values()]),
    }))
    .sort((a, b) => b.total - a.total || a.typeKey.localeCompare(b.typeKey));

  const visible = ranked.slice(0, ISSUE_TYPE_SERIES_LIMIT);
  const overflow = ranked.slice(ISSUE_TYPE_SERIES_LIMIT);
  const palette = lane === "error" ? ERROR_PALETTE : WARNING_PALETTE;

  const seriesMeta = visible.map((entry, index) => {
    const color: string = palette[index] ?? OTHER_COLOR;
    return {
      key: `s${index}`,
      typeKey: entry.typeKey,
      label: entry.typeKey,
      color,
    };
  });

  if (overflow.length > 0) {
    seriesMeta.push({
      key: "other",
      typeKey: "__other__",
      label: "Other",
      color: OTHER_COLOR,
    });
  }

  const daySet = new Set<string>();
  if (window) {
    for (const day of eachUtcDay(window.fromMs, window.toMs)) daySet.add(day);
  }
  for (const byDay of countsByType.values()) {
    for (const day of byDay.keys()) daySet.add(day);
  }

  const days = [...daySet].sort();
  const points: IssueTypeTimelinePoint[] = days.map((bucket) => {
    const point: IssueTypeTimelinePoint = { bucket };
    for (const series of seriesMeta) {
      if (series.typeKey === "__other__") {
        point[series.key] = overflow.reduce(
          (total, entry) =>
            total + (countsByType.get(entry.typeKey)?.get(bucket) ?? 0),
          0,
        );
      } else {
        point[series.key] = countsByType.get(series.typeKey)?.get(bucket) ?? 0;
      }
    }
    return point;
  });

  const series: IssueTypeSeries[] = seriesMeta.map((meta) => {
    const counts = points.map((point) => {
      const value = point[meta.key];
      return typeof value === "number" ? value : 0;
    });
    return {
      key: meta.key,
      label: meta.label,
      color: meta.color,
      total: sum(counts),
      trend: classifyIssueTypeTrend(counts),
    };
  });

  return {
    points,
    series,
    total: sum(series.map((entry) => entry.total)),
  };
}

function pointCount(point: IssueTypeTimelinePoint, key: string): number {
  const value = point[key];
  return typeof value === "number" ? value : 0;
}

/** Issues recorded on each day, across every lane passed in. */
export function dailyIssueTotals(
  timelines: IssueTypeTimeline[],
): Map<string, number> {
  const totals = new Map<string, number>();
  for (const timeline of timelines) {
    for (const point of timeline.points) {
      const pointTotal = timeline.series.reduce(
        (total, series) => total + pointCount(point, series.key),
        0,
      );
      totals.set(point.bucket, (totals.get(point.bucket) ?? 0) + pointTotal);
    }
  }
  return totals;
}

/**
 * Replaces each day's count with its share of that day's issues.
 * Raw counts stay on `${key}Count` for the tooltip.
 * Series `total` stays the window count.
 */
export function toDailyIssueShare(
  timeline: IssueTypeTimeline,
  dayTotals: Map<string, number>,
): IssueTypeTimeline {
  const points = timeline.points.map((point) => {
    const dayTotal = dayTotals.get(point.bucket) ?? 0;
    const next: IssueTypeTimelinePoint = { bucket: point.bucket };
    for (const series of timeline.series) {
      const count = pointCount(point, series.key);
      next[series.key] = dayTotal > 0 ? (count / dayTotal) * 100 : 0;
      next[`${series.key}Count`] = count;
    }
    return next;
  });

  const series = timeline.series.map((entry) => {
    const shares = points.map((point) => pointCount(point, entry.key));
    return {
      ...entry,
      trend: classifyIssueTypeTrend(shares),
    };
  });

  return {
    points,
    series,
    total: timeline.total,
  };
}
