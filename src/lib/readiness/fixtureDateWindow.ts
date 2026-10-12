export const READINESS_DAYS_BEHIND = 14;
export const READINESS_DAYS_AHEAD = 7;

export type CalendarRange = { start: string; end: string };

export function calendarDay(value: string): string {
  return value.slice(0, 10);
}

export function addCalendarDays(isoDate: string, days: number): string {
  const [year, month, day] = calendarDay(isoDate).split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day));
  utc.setUTCDate(utc.getUTCDate() + days);
  const nextYear = utc.getUTCFullYear();
  const nextMonth = String(utc.getUTCMonth() + 1).padStart(2, "0");
  const nextDay = String(utc.getUTCDate()).padStart(2, "0");
  return `${nextYear}-${nextMonth}-${nextDay}`;
}

export function readinessWindow(chosenDate: string): CalendarRange {
  return {
    start: addCalendarDays(chosenDate, -READINESS_DAYS_BEHIND),
    end: addCalendarDays(chosenDate, READINESS_DAYS_AHEAD),
  };
}

export function sydneyToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Sydney",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function splitFixturesByPlayDay<T extends { date: string | null }>(
  fixtures: T[],
  today: string,
): { upcoming: T[]; results: T[] } {
  const upcoming: T[] = [];
  const results: T[] = [];
  for (const fixture of fixtures) {
    const day = fixture.date ? calendarDay(fixture.date) : "";
    if (day > today) upcoming.push(fixture);
    else results.push(fixture);
  }
  return { upcoming, results };
}

export function fixturesInReadinessWindow<T extends { date: string | null }>(
  fixtures: T[],
  chosenDate: string,
): T[] {
  const window = readinessWindow(chosenDate);
  return fixtures.filter((fixture) => {
    if (fixture.date == null || fixture.date === "") return false;
    const day = calendarDay(fixture.date);
    return day >= window.start && day <= window.end;
  });
}

export function listCoversReadinessWindow(
  window: CalendarRange,
  ranges: CalendarRange[],
): boolean {
  if (ranges.length === 0) return true;
  const covered = (day: string) =>
    ranges.some((range) => {
      const start = calendarDay(range.start);
      const end = calendarDay(range.end);
      return day >= start && day <= end;
    });
  return covered(window.start) && covered(window.end);
}

export function sydneyWeekday(chosenDate: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    weekday: "long",
    timeZone: "Australia/Sydney",
  }).format(new Date(`${chosenDate}T12:00:00+11:00`));
}
