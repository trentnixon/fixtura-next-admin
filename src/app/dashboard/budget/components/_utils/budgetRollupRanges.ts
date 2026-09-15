/** Shared default ranges for daily / weekly / monthly rollup hooks. */

export function getWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function getDailyRollupRangeParams(dayCount = 30) {
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - (dayCount - 1));
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
    limit: dayCount,
  };
}

export function getWeeklyRollupRangeParams(weekCount = 12) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentWeek = getWeekNumber(now);
  return {
    startYear: currentYear,
    startWeek: Math.max(1, currentWeek - (weekCount - 1)),
    endYear: currentYear,
    endWeek: currentWeek,
    limit: weekCount,
  };
}

export function getMonthlyRollupRangeParams(monthCount = 12) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  return {
    startYear: currentYear,
    startMonth: Math.max(1, currentMonth - (monthCount - 1)),
    endYear: currentYear,
    endMonth: currentMonth,
    limit: monthCount,
  };
}
