import type { TrendGranularity } from "../PeriodControls";

function toYmd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Matches the budget workspace trend window (Trends tab). */
export function getWorkspaceTrendRange(granularity: TrendGranularity): {
  startDate: string;
  endDate: string;
} {
  const end = new Date();
  const start = new Date(end);
  if (granularity === "daily") {
    start.setDate(end.getDate() - 29);
  } else if (granularity === "weekly") {
    start.setDate(end.getDate() - 7 * 12);
  } else {
    start.setMonth(end.getMonth() - 11);
  }
  return { startDate: toYmd(start), endDate: toYmd(end) };
}

/** Longer history for statistical forecast models. */
export function getExtendedForecastRange(granularity: TrendGranularity): {
  startDate: string;
  endDate: string;
} {
  const end = new Date();
  const start = new Date(end);
  if (granularity === "daily") {
    start.setDate(end.getDate() - 59);
  } else if (granularity === "weekly") {
    start.setDate(end.getDate() - 7 * 24);
  } else {
    start.setMonth(end.getMonth() - 23);
  }
  return { startDate: toYmd(start), endDate: toYmd(end) };
}
