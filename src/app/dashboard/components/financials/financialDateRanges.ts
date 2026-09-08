const DISPLAY_TIME_ZONE = "Australia/Sydney";

export type FinancialPeriodMonths = 1 | 3 | 6;

function formatDateInSydney(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: DISPLAY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function parseMonthKey(key: string): Date | null {
  const match = /^(\d{4})-(\d{2})$/.exec(key);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, 1);
}

function toMonthKey(year: number, monthIndex: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

/** Calendar month keys (YYYY-MM) for the selected financial period, inclusive. */
export function getFinancialPeriodMonthKeys(
  months: FinancialPeriodMonths,
  date = new Date()
): string[] {
  const { startDate, endDate } = getFinancialPeriodDateRange(months, date);
  const startMatch = /^(\d{4})-(\d{2})/.exec(startDate);
  const endMatch = /^(\d{4})-(\d{2})/.exec(endDate);
  if (!startMatch || !endMatch) return [];

  let year = Number(startMatch[1]);
  let month = Number(startMatch[2]) - 1;
  const endYear = Number(endMatch[1]);
  const endMonth = Number(endMatch[2]) - 1;

  const keys: string[] = [];
  while (year < endYear || (year === endYear && month <= endMonth)) {
    keys.push(toMonthKey(year, month));
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }

  return keys;
}

/** Inclusive YYYY-MM-DD range ending today (Australia/Sydney). */
export function getFinancialPeriodDateRange(
  months: FinancialPeriodMonths,
  date = new Date()
): { startDate: string; endDate: string; label: string } {
  const endDate = formatDateInSydney(date);
  const start = new Date(date);
  start.setMonth(start.getMonth() - (months - 1));
  start.setDate(1);

  const label =
    months === 1 ? "Last month" : months === 3 ? "Last 3 months" : "Last 6 months";

  return {
    startDate: formatDateInSydney(start),
    endDate,
    label,
  };
}

/** Monthly revenue for each calendar month in the period (values in cents, 0 when missing). */
export function getRecentMonthlyRevenue(
  monthlyRevenue: Record<string, number> | undefined,
  months: FinancialPeriodMonths,
  date = new Date()
): Array<{ month: string; revenueCents: number }> {
  return getFinancialPeriodMonthKeys(months, date).map((month) => ({
    month,
    revenueCents: monthlyRevenue?.[month] ?? 0,
  }));
}

/** Sum monthly revenue for the last N months (values in cents). */
export function sumRecentMonthlyRevenue(
  monthlyRevenue: Record<string, number> | undefined,
  months: FinancialPeriodMonths,
  date = new Date()
): number {
  return getRecentMonthlyRevenue(monthlyRevenue, months, date).reduce(
    (sum, entry) => sum + entry.revenueCents,
    0
  );
}

export function formatMonthKeyLabel(monthKey: string): string {
  const date = parseMonthKey(monthKey);
  if (!date) return monthKey;

  return new Intl.DateTimeFormat("en-AU", {
    timeZone: DISPLAY_TIME_ZONE,
    month: "short",
    year: "2-digit",
  }).format(date);
}
