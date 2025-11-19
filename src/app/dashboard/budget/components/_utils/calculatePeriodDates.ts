/**
 * Calculate start and end dates for a given granularity
 * @param granularity - The time granularity (daily, weekly, monthly)
 * @returns Object with startDate and endDate in YYYY-MM-DD format
 */
export function calculatePeriodDates(granularity: "daily" | "weekly" | "monthly"): {
  startDate: string;
  endDate: string;
} {
  const end = new Date();
  const start = new Date(end);

  if (granularity === "daily") {
    start.setDate(end.getDate() - 29); // Last 30 days
  } else if (granularity === "weekly") {
    start.setDate(end.getDate() - 7 * 12); // Last 12 weeks
  } else {
    start.setMonth(end.getMonth() - 11); // Last 12 months
  }

  const toYmd = (d: Date) => d.toISOString().slice(0, 10);
  return { startDate: toYmd(start), endDate: toYmd(end) };
}

