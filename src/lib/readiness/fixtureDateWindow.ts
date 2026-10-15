export const READINESS_DAYS_BEHIND = 14;
export const READINESS_STANDARD_DAYS_BEHIND = 7;
export const READINESS_DAYS_AHEAD = 7;

export type CalendarRange = { start: string; end: string };

function displayType(type: unknown): string {
  if (typeof type === "string") return type.trim();
  if (type && typeof type === "object" && "text" in type) {
    const text = type.text;
    return typeof text === "string" ? text.trim() : "";
  }
  return "";
}

/** Cricket multi-day type. Spacing is ignored so `Two Day +` still matches. */
export function isTwoDayPlusType(type: unknown): boolean {
  return displayType(type).replace(/\s+/g, "").toLowerCase() === "twoday+";
}

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

export function standardReadinessWindow(chosenDate: string): CalendarRange {
  return {
    start: addCalendarDays(chosenDate, -READINESS_STANDARD_DAYS_BEHIND),
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

/** Date-only values stay as written. Instants are the Sydney calendar day. */
export function sydneyCalendarDay(value: string): string {
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return calendarDay(trimmed);
  return sydneyToday(parsed);
}

type PlayDaySource = {
  dates?: {
    dayOne?: string | null;
    finalDaysPlay?: string | null;
  } | null;
};

/** Prefer the Sydney day the match starts. Fall back to the list date. */
export function readinessPlayDay(
  listDate: string | null,
  detail: PlayDaySource | null | undefined,
): string | null {
  const dayOne = detail?.dates?.dayOne;
  if (dayOne) return sydneyCalendarDay(dayOne);
  const finalDay = detail?.dates?.finalDaysPlay;
  if (finalDay) return sydneyCalendarDay(finalDay);
  if (listDate) return calendarDay(listDate);
  return null;
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

export function fixturesInReadinessWindow<
  T extends { date: string | null; type?: unknown },
>(fixtures: T[], chosenDate: string): T[] {
  const wide = readinessWindow(chosenDate);
  const standardStart = standardReadinessWindow(chosenDate).start;
  return fixtures.filter((fixture) => {
    if (fixture.date == null || fixture.date === "") return false;
    const day = calendarDay(fixture.date);
    if (day < wide.start || day > wide.end) return false;
    if (day >= standardStart) return true;
    return isTwoDayPlusType(fixture.type);
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
