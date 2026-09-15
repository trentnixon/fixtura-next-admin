import type { SummaryPeriod } from "../PeriodControls";

export const PERIOD_LABELS: Record<SummaryPeriod, string> = {
  "current-month": "Current month",
  "last-month": "Last month",
  "current-year": "Current year",
  "all-time": "All time",
};

export function periodLabel(period: SummaryPeriod): string {
  return PERIOD_LABELS[period] ?? PERIOD_LABELS["current-month"];
}

/** Sensible default comparison window for each summary period. */
export function getComparePeriod(period: SummaryPeriod): SummaryPeriod {
  switch (period) {
    case "current-month":
      return "last-month";
    case "last-month":
      return "current-month";
    case "current-year":
      return "all-time";
    case "all-time":
      return "current-year";
    default:
      return "last-month";
  }
}
