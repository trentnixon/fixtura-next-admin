import { describe, expect, it } from "vitest";
import {
  fixturesInReadinessWindow,
  readinessPlayDay,
  readinessWindow,
  splitFixturesByPlayDay,
  standardReadinessWindow,
  sydneyCalendarDay,
} from "@/lib/readiness/fixtureDateWindow";

describe("readinessWindow", () => {
  it("starts 14 days before the date and ends 7 days after it", () => {
    expect(readinessWindow("2026-10-11")).toEqual({
      start: "2026-09-27",
      end: "2026-10-18",
    });
  });

  it("crosses a month boundary on calendar days", () => {
    expect(readinessWindow("2026-03-01")).toEqual({
      start: "2026-02-15",
      end: "2026-03-08",
    });
  });
});

describe("standardReadinessWindow", () => {
  it("starts 7 days before the date and ends 7 days after it", () => {
    expect(standardReadinessWindow("2026-10-11")).toEqual({
      start: "2026-10-04",
      end: "2026-10-18",
    });
  });
});
describe("splitFixturesByPlayDay", () => {
  it("puts future fixtures in upcoming and today or earlier in results", () => {
    const split = splitFixturesByPlayDay(
      [
        { id: 1, date: "2026-10-10" },
        { id: 2, date: "2026-10-11" },
        { id: 3, date: "2026-10-12" },
        { id: 4, date: null },
      ],
      "2026-10-11",
    );
    expect(split.upcoming.map((fixture) => fixture.id)).toEqual([3]);
    expect(split.results.map((fixture) => fixture.id)).toEqual([1, 2, 4]);
  });
});

describe("readinessPlayDay", () => {
  it("reads a UTC day-one instant as the Sydney play day", () => {
    expect(sydneyCalendarDay("2026-10-15T13:00:00.000Z")).toBe("2026-10-16");
    expect(sydneyCalendarDay("2026-10-16")).toBe("2026-10-16");
    expect(
      readinessPlayDay("2026-10-15", {
        dates: {
          dayOne: "2026-10-15T13:00:00.000Z",
          finalDaysPlay: "2026-10-16",
        },
      }),
    ).toBe("2026-10-16");
  });
});

describe("fixturesInReadinessWindow", () => {
  const fixtures = [
    { id: 1, date: "2026-09-26", type: "Two Day+" },
    { id: 2, date: "2026-09-27", type: "Two Day+" },
    { id: 3, date: "2026-10-03", type: "One Day" },
    { id: 4, date: "2026-10-03", type: "Two Day+" },
    { id: 5, date: "2026-10-04", type: "T20" },
    { id: 6, date: "2026-10-11", type: "One Day" },
    { id: 7, date: "2026-10-18", type: "One Day" },
    { id: 8, date: "2026-10-19", type: "Two Day+" },
    { id: 9, date: null, type: "Two Day+" },
    { id: 10, date: "2026-09-27", type: { text: "Two Day +" } },
  ];

  it("keeps only Two Day+ fixtures in the 8 to 14 days before the date", () => {
    expect(
      fixturesInReadinessWindow(fixtures, "2026-10-11").map((fixture) => fixture.id),
    ).toEqual([2, 4, 5, 6, 7, 10]);
  });
});