const DISPLAY_TIME_ZONE = "Australia/Sydney";

function getSydneyDateParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: DISPLAY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";

  return { year, month: Number(month) };
}

/** Current period key for monthlyRevenue maps (YYYY-MM). */
export function getCurrentMonthKey(date = new Date()): string {
  const { year, month } = getSydneyDateParts(date);
  return `${year}-${String(month).padStart(2, "0")}`;
}

/** Current period key for quarterlyRevenue maps (YYYY-Qn). */
export function getCurrentQuarterKey(date = new Date()): string {
  const { year, month } = getSydneyDateParts(date);
  const quarter = Math.ceil(month / 3);
  return `${year}-Q${quarter}`;
}

/** Short label for the current month, e.g. "Jun 2026". */
export function getCurrentMonthLabel(date = new Date()): string {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: DISPLAY_TIME_ZONE,
    month: "short",
    year: "numeric",
  }).format(date);
}

/** Sum monthly revenue entries for the current calendar year (values in cents). */
export function getYearToDateRevenue(
  monthlyRevenue: Record<string, number> | undefined,
  date = new Date(),
): number {
  if (!monthlyRevenue) return 0;

  const { year } = getSydneyDateParts(date);
  const prefix = `${year}-`;

  return Object.entries(monthlyRevenue).reduce((sum, [key, value]) => {
    if (key.startsWith(prefix)) {
      return sum + value;
    }
    return sum;
  }, 0);
}

/** YTD range label, e.g. "Jan–Jun". */
export function getYearToDateLabel(date = new Date()): string {
  const month = new Intl.DateTimeFormat("en-AU", {
    timeZone: DISPLAY_TIME_ZONE,
    month: "short",
  }).format(date);

  return `Jan–${month}`;
}

/** Inclusive YYYY-MM-DD range for the current calendar month (Australia/Sydney). */
export function getCurrentMonthDateRange(date = new Date()): {
  startDate: string;
  endDate: string;
} {
  const monthKey = getCurrentMonthKey(date);
  const [year, month] = monthKey.split("-").map(Number);
  const lastDay = new Date(year, month, 0).getDate();

  return {
    startDate: `${monthKey}-01`,
    endDate: `${monthKey}-${String(lastDay).padStart(2, "0")}`,
  };
}

export function lookupRevenueCents(
  series: Record<string, number> | undefined,
  key: string,
): number | null {
  if (!series) return null;

  if (key in series) {
    return series[key] ?? 0;
  }

  const keys = Object.keys(series).sort();
  if (keys.length === 0) return null;

  return series[keys[keys.length - 1]] ?? 0;
}
