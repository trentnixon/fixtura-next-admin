import { formatDurationReadable } from "@/utils/chart-formatters";

export type HealthTimestampParts = {
  /** e.g. `14:00` */
  time: string;
  /** e.g. `6 Sept 2026,` */
  date: string;
};

/** Split an ISO timestamp into stacked display parts (time bold, date thin). */
export function splitHealthTimestamp(
  iso: string | null,
): HealthTimestampParts | null {
  if (iso == null || iso.trim() === "") return null;

  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;

  try {
    const time = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);

    const date = new Intl.DateTimeFormat(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);

    return { time, date: `${date},` };
  } catch {
    return null;
  }
}

/** Format UTC ISO-ish Strapi datetime for display in user's local timezone. */
export function formatHealthTimestamp(iso: string | null): string {
  if (iso == null || iso.trim() === "") return "—";

  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return d.toLocaleString();
  }
}

/** Same as {@link formatHealthTimestamp} but omits the year (e.g. `2 Jun, 3:45 pm`). */
export function formatHealthTimestampNoYear(iso: string | null): string {
  if (iso == null || iso.trim() === "") return "—";

  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  try {
    return new Intl.DateTimeFormat(undefined, {
      day: "numeric",
      month: "short",
      timeStyle: "short",
    }).format(d);
  } catch {
    return d.toLocaleString();
  }
}

/** Elapsed time between step start and end (e.g. `5m 12s`). */
export function formatHealthStepDuration(
  startedAt: string | null,
  completedAt: string | null,
): string {
  if (startedAt == null || startedAt.trim() === "") return "—";
  if (completedAt == null || completedAt.trim() === "") return "—";

  const start = new Date(startedAt);
  const end = new Date(completedAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "—";

  const ms = end.getTime() - start.getTime();
  if (ms < 0) return "—";

  return formatDurationReadable(ms);
}
