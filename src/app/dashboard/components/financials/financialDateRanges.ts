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

/** Last N monthly revenue entries sorted chronologically (values in cents). */
export function getRecentMonthlyRevenue(
  monthlyRevenue: Record<string, number> | undefined,
  months: FinancialPeriodMonths
): Array<{ month: string; revenueCents: number }> {
  if (!monthlyRevenue) return [];

  return Object.entries(monthlyRevenue)
    .map(([month, revenueCents]) => ({ month, revenueCents, date: parseMonthKey(month) }))
    .filter((entry) => entry.date != null)
    .sort((a, b) => a.date!.getTime() - b.date!.getTime())
    .slice(-months)
    .map(({ month, revenueCents }) => ({ month, revenueCents }));
}

/** Sum monthly revenue for the last N months (values in cents). */
export function sumRecentMonthlyRevenue(
  monthlyRevenue: Record<string, number> | undefined,
  months: FinancialPeriodMonths
): number {
  return getRecentMonthlyRevenue(monthlyRevenue, months).reduce(
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
