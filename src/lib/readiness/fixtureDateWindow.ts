export function calendarDay(value: string): string {
  return value.slice(0, 10);
}

export function chosenDateIsOutsideWindow(
  chosenDate: string,
  ranges: { start: string; end: string }[],
): boolean {
  if (ranges.length === 0) return false;
  return ranges.every((range) => {
    const start = calendarDay(range.start);
    const end = calendarDay(range.end);
    return chosenDate < start || chosenDate > end;
  });
}

export function fixturesOnChosenDate<T extends { date: string | null }>(
  fixtures: T[],
  chosenDate: string,
): T[] {
  return fixtures.filter((fixture) => fixture.date === chosenDate);
}

export function sydneyWeekday(chosenDate: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    weekday: "long",
    timeZone: "Australia/Sydney",
  }).format(new Date(`${chosenDate}T12:00:00+11:00`));
}
