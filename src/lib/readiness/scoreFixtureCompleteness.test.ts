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
    isFinished: true,
    homeTeam: "Riverside",
    awayTeam: "Harbour",
    scorecardUrl: "https://playhq.com/game-centre/1",
    hasScorecards: true,
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

  it("scores a complete set at 100 percent", () => {
    expect(scoreFixtureCompleteness([fixture({ id: 4 }), fixture({ id: 5 })])).toEqual({
      percentage: 100,
      completeCount: 2,
      totalCount: 2,
      findings: [],
    });
  });

  it("calls out a finished fixture with no scorecards", () => {
    expect(
      scoreFixtureCompleteness([fixture({ id: 8, hasScorecards: false })]),
    ).toEqual({
      percentage: 0,
      completeCount: 0,
      totalCount: 1,
      findings: [{ fixtureId: 8, reason: "finished without scorecards" }],
    });
  });

  it("calls out a missing scorecard URL", () => {
    expect(
      scoreFixtureCompleteness([fixture({ id: 9, scorecardUrl: "  " })]),
    ).toEqual({
      percentage: 0,
      completeCount: 0,
      totalCount: 1,
      findings: [{ fixtureId: 9, reason: "missing scorecard URL" }],
    });
  });

  it("calls out a missing team", () => {
    expect(
      scoreFixtureCompleteness([fixture({ id: 3, awayTeam: null })]),
    ).toEqual({
      percentage: 0,
      completeCount: 0,
      totalCount: 1,
      findings: [{ fixtureId: 3, reason: "missing team" }],
    });
  });

  it("does not require scorecards when the fixture is not finished", () => {
    expect(
      scoreFixtureCompleteness([
        fixture({
          id: 12,
          status: "Upcoming",
          isFinished: false,
          hasScorecards: false,
        }),
      ]),
    ).toEqual({
      percentage: 100,
      completeCount: 1,
      totalCount: 1,
      findings: [],
    });
  });

  it("counts complete fixtures against the whole set", () => {
    expect(
      scoreFixtureCompleteness([
        fixture({ id: 1 }),
        fixture({ id: 2, scorecardUrl: null }),
      ]).percentage,
    ).toBe(50);
  });
});
