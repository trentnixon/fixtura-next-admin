import { describe, expect, it } from "vitest";
import {
  fixturesInReadinessWindow,
  readinessWindow,
  splitFixturesByPlayDay,
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

describe("fixturesInReadinessWindow", () => {
  const fixtures = [
    { id: 1, date: "2026-09-26" },
    { id: 2, date: "2026-09-27" },
    { id: 3, date: "2026-10-11" },
    { id: 4, date: "2026-10-18" },
    { id: 5, date: "2026-10-19" },
    { id: 6, date: null },
  ];

  it("keeps fixtures from two weeks before the date through one week after", () => {
    expect(fixturesInReadinessWindow(fixtures, "2026-10-11").map((fixture) => fixture.id)).toEqual([
      2, 3, 4,
    ]);
  });
});