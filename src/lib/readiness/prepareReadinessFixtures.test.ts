import { describe, expect, it } from "vitest";
import {
  prepareReadinessFixtures,
  type ReadinessFixture,
} from "@/lib/readiness/prepareReadinessFixtures";

function fixture(overrides: Partial<ReadinessFixture> = {}): ReadinessFixture {
  return {
    id: 1,
    date: "2026-10-19",
    round: "1",
    status: "Final",
    type: "One Day",
    teams: { home: "Riverside", away: "Harbour" },
    grade: { id: 4, name: "First Grade" },
    competition: { id: 8, name: "Premier" },
    association: { id: 10, name: "Metro" },
    playDay: { dayOne: "2026-10-19T03:00:00.000Z", finalDaysPlay: null },
    location: "Riverside Oval",
    scores: {
      homeTotal: "250",
      homeFirstInnings: null,
      awayTotal: "180",
      awayFirstInnings: null,
    },
    tossResult: "bat",
    tossWinner: "Riverside",
    hasPlayerData: true,
    ...overrides,
  };
}

describe("prepareReadinessFixtures", () => {
  it("scores a Two Day+ match on its start day when that day is already past", () => {
    const prepared = prepareReadinessFixtures(
      [
        fixture({
          id: 4,
          date: "2026-10-04",
          type: "Two Day+",
          playDay: {
            dayOne: "2026-10-04T03:00:00.000Z",
            finalDaysPlay: "2026-10-26",
          },
        }),
      ],
      "2026-10-19",
    );

    expect(prepared.upcoming.map((row) => row.id)).toEqual([]);
    expect(prepared.results.map((row) => row.date)).toEqual(["2026-10-04"]);
    expect(prepared.scoreInputs).toEqual([
      {
        id: 4,
        status: "Final",
        date: "2026-10-04",
        homeTeam: "Riverside",
        awayTeam: "Harbour",
        location: "Riverside Oval",
        homeScore: "250",
        awayScore: "180",
        tossResult: "bat",
        tossWinner: "Riverside",
        hasPlayerData: true,
      },
    ]);
  });

  it("keeps a start day outside the span and leaves a future start day unscored", () => {
    const prepared = prepareReadinessFixtures(
      [
        fixture({ id: 8, date: "2026-08-01", type: "Two Day+" }),
        fixture({ id: 27, date: "2026-10-27", type: "Two Day+" }),
      ],
      "2026-10-19",
    );

    expect(prepared.results.map((row) => row.id)).toEqual([8]);
    expect(prepared.upcoming.map((row) => row.id)).toEqual([27]);
    expect(prepared.scoreInputs.map((row) => row.id)).toEqual([8]);
  });

  it("uses the first-innings score when the total is missing", () => {
    const prepared = prepareReadinessFixtures(
      [
        fixture({
          id: 9,
          date: "2026-10-19",
          scores: {
            homeTotal: null,
            homeFirstInnings: "120",
            awayTotal: "   ",
            awayFirstInnings: "90",
          },
          hasPlayerData: false,
        }),
      ],
      "2026-10-19",
    );

    expect(prepared.results.map((row) => row.id)).toEqual([9]);
    expect(prepared.scoreInputs[0]).toMatchObject({
      homeScore: "120",
      awayScore: "90",
      hasPlayerData: false,
    });
  });
});
