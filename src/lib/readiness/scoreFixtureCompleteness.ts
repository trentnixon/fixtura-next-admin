export type FixtureCompletenessInput = {
  id: number;
  status: string | null;
  date: string | null;
  homeTeam: string | null;
  awayTeam: string | null;
  location: string | null;
  homeScore: string | null;
  awayScore: string | null;
  tossResult: string | null;
  tossWinner: string | null;
  hasPlayerData: boolean;
};

export type FixtureCompletenessFinding = {
  fixtureId: number;
  percentage: number;
  reason: string | null;
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

function isFinalStatus(status: string | null): boolean {
  const value = status?.trim().toLowerCase() ?? "";
  return value === "final" || value === "completed" || value === "finished";
}

function hasScore(fixture: FixtureCompletenessInput): boolean {
  return filled(fixture.homeScore) || filled(fixture.awayScore);
}

const metaChecks: {
  reason: string;
  present: (fixture: FixtureCompletenessInput) => boolean;
}[] = [
  { reason: "not final", present: (fixture) => isFinalStatus(fixture.status) },
  { reason: "no score", present: hasScore },
  { reason: "missing date", present: (fixture) => filled(fixture.date) },
  { reason: "missing team", present: (fixture) => filled(fixture.homeTeam) && filled(fixture.awayTeam) },
  { reason: "missing location", present: (fixture) => filled(fixture.location) },
  { reason: "missing toss", present: (fixture) => filled(fixture.tossResult) },
  { reason: "missing toss winner", present: (fixture) => filled(fixture.tossWinner) },
  { reason: "missing player data", present: (fixture) => fixture.hasPlayerData },
];

function scoreResultFixture(fixture: FixtureCompletenessInput): FixtureCompletenessFinding {
  const checks = metaChecks.map((check) => ({
    reason: check.reason,
    present: check.present(fixture),
  }));
  const included = checks[0]?.present === true && checks[1]?.present === true;
  if (!included) {
    return {
      fixtureId: fixture.id,
      percentage: 0,
      reason: checks.find((check) => !check.present)?.reason ?? "not final",
    };
  }

  const presentCount = checks.filter((check) => check.present).length;
  const percentage = Math.round((presentCount / checks.length) * 100);
  return {
    fixtureId: fixture.id,
    percentage,
    reason: checks.find((check) => !check.present)?.reason ?? null,
  };
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

  const findings = fixtures.map(scoreResultFixture);
  const percentage = Math.round(
    findings.reduce((sum, finding) => sum + finding.percentage, 0) / findings.length,
  );
  return {
    percentage,
    completeCount: findings.filter((finding) => finding.percentage === 100).length,
    totalCount: findings.length,
    findings,
  };
}
