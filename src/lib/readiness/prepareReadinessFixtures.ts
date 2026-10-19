import type { FixtureCompletenessInput } from "@/lib/readiness/scoreFixtureCompleteness";

export type ReadinessFixture = {
  id: number;
  date: string;
  round: string | null;
  status: string | null;
  type: string | null;
  teams: { home: string | null; away: string | null };
  grade: { id: number; name: string | null } | null;
  competition: { id: number; name: string | null } | null;
  association: { id: number; name: string | null } | null;
  playDay: {
    dayOne: string | null;
    finalDaysPlay: string | null;
  };
  location: string | null;
  scores: {
    homeTotal: string | null;
    homeFirstInnings: string | null;
    awayTotal: string | null;
    awayFirstInnings: string | null;
  };
  tossResult: string | null;
  tossWinner: string | null;
  hasPlayerData: boolean;
};

export type PreparedReadinessFixtures = {
  upcoming: ReadinessFixture[];
  results: ReadinessFixture[];
  scoreInputs: FixtureCompletenessInput[];
};

function recordedScore(
  total: string | null,
  innings: string | null,
): string | null {
  if (total != null && total.trim() !== "") return total;
  if (innings != null && innings.trim() !== "") return innings;
  return null;
}

function toScoreInput(fixture: ReadinessFixture): FixtureCompletenessInput {
  return {
    id: fixture.id,
    status: fixture.status,
    date: fixture.date,
    homeTeam: fixture.teams.home,
    awayTeam: fixture.teams.away,
    location: fixture.location,
    homeScore: recordedScore(
      fixture.scores.homeTotal,
      fixture.scores.homeFirstInnings,
    ),
    awayScore: recordedScore(
      fixture.scores.awayTotal,
      fixture.scores.awayFirstInnings,
    ),
    tossResult: fixture.tossResult,
    tossWinner: fixture.tossWinner,
    hasPlayerData: fixture.hasPlayerData,
  };
}

export function prepareReadinessFixtures(
  fixtures: ReadinessFixture[],
  today: string,
): PreparedReadinessFixtures {
  const upcoming: ReadinessFixture[] = [];
  const results: ReadinessFixture[] = [];
  for (const fixture of fixtures) {
    if (fixture.date > today) upcoming.push(fixture);
    else results.push(fixture);
  }
  return {
    upcoming,
    results,
    scoreInputs: results.map(toScoreInput),
  };
}
