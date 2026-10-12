import { describe, expect, it } from "vitest";
import {
  scoreFixtureCompleteness,
  type FixtureCompletenessInput,
} from "@/lib/readiness/scoreFixtureCompleteness";

function fixture(
  overrides: Partial<FixtureCompletenessInput> = {},
): FixtureCompletenessInput {
  return {
    id: 1,
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
    ...overrides,
  };
}

describe("scoreFixtureCompleteness", () => {
  it("gives an empty set no percentage", () => {
    expect(scoreFixtureCompleteness([])).toEqual({
      percentage: null,
      completeCount: 0,
      totalCount: 0,
      findings: [],
    });
  });

  it("scores a results fixture with every meta field at 100 percent", () => {
    expect(scoreFixtureCompleteness([fixture({ id: 4 })])).toEqual({
      percentage: 100,
      completeCount: 1,
      totalCount: 1,
      findings: [{ fixtureId: 4, percentage: 100, reason: null }],
    });
  });

  it("scores a scheduled fixture with no result at 0", () => {
    expect(
      scoreFixtureCompleteness([
        fixture({
          id: 8,
          status: "Scheduled",
          homeScore: null,
          awayScore: null,
          tossResult: null,
          tossWinner: null,
          hasPlayerData: false,
        }),
      ]),
    ).toEqual({
      percentage: 0,
      completeCount: 0,
      totalCount: 1,
      findings: [{ fixtureId: 8, percentage: 0, reason: "not final" }],
    });
  });

  it("stays at 0 when the status is final and the score is missing", () => {
    expect(
      scoreFixtureCompleteness([
        fixture({ id: 9, homeScore: null, awayScore: "  " }),
      ]).findings[0],
    ).toEqual({ fixtureId: 9, percentage: 0, reason: "no score" });
  });

  it("scores the meta fields once a final status and a score are present", () => {
    const scored = scoreFixtureCompleteness([
      fixture({
        id: 3,
        location: null,
        tossResult: null,
        tossWinner: null,
        hasPlayerData: false,
      }),
    ]);
    expect(scored.findings[0]?.percentage).toBe(50);
    expect(scored.findings[0]?.reason).toBe("missing location");
  });

  it("averages every results fixture", () => {
    expect(
      scoreFixtureCompleteness([
        fixture({ id: 1 }),
        fixture({
          id: 2,
          status: "Scheduled",
          homeScore: null,
          awayScore: null,
        }),
      ]).percentage,
    ).toBe(50);
  });
});