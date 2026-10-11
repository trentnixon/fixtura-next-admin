export type FixtureCompletenessInput = {
  id: number;
  status: string | null;
  isFinished: boolean;
  homeTeam: string | null;
  awayTeam: string | null;
  scorecardUrl: string | null;
  hasScorecards: boolean;
};

export type FixtureCompletenessReason =
  | "missing status"
  | "missing team"
  | "missing scorecard URL"
  | "finished without scorecards";

export type FixtureCompletenessFinding = {
  fixtureId: number;
  reason: FixtureCompletenessReason;
};

export type FixtureCompletenessScore = {
  percentage: number | null;
  completeCount: number;
  totalCount: number;
  findings: FixtureCompletenessFinding[];
};

function filled(value: string | null): boolean {
  return value != null && value.trim() !== "";
}

function reasonFor(
  fixture: FixtureCompletenessInput,
): FixtureCompletenessReason | null {
  if (!filled(fixture.status)) return "missing status";
  if (!filled(fixture.homeTeam) || !filled(fixture.awayTeam)) {
    return "missing team";
  }
  if (!filled(fixture.scorecardUrl)) return "missing scorecard URL";
  if (fixture.isFinished && !fixture.hasScorecards) {
    return "finished without scorecards";
  }
  return null;
}

export function scoreFixtureCompleteness(
  fixtures: FixtureCompletenessInput[],
): FixtureCompletenessScore {
  if (fixtures.length === 0) {
    return {
      percentage: null,
      completeCount: 0,
      totalCount: 0,
      findings: [],
    };
  }

  const findings: FixtureCompletenessFinding[] = [];
  for (const fixture of fixtures) {
    const reason = reasonFor(fixture);
    if (reason) findings.push({ fixtureId: fixture.id, reason });
  }

  const completeCount = fixtures.length - findings.length;
  return {
    percentage: Math.round((completeCount / fixtures.length) * 100),
    completeCount,
    totalCount: fixtures.length,
    findings,
  };
}
