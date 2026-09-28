import type { FixtureSummary } from "@/types/fixtureInsights";
import { toFixtureDisplayText } from "./fixtureDisplayText";

/**
 * Group fixtures by grade name
 */
export function groupByGrade(
  fixtures: FixtureSummary[]
): Record<string, FixtureSummary[]> {
  return fixtures.reduce((acc, fixture) => {
    const gradeName = fixture.grade?.name || "Uncategorized";
    if (!acc[gradeName]) {
      acc[gradeName] = [];
    }
    acc[gradeName].push(fixture);
    return acc;
  }, {} as Record<string, FixtureSummary[]>);
}

/**
 * Format teams display string
 */
export function getTeamsDisplay(fixture: FixtureSummary): string {
  const home = toFixtureDisplayText(fixture.teams?.home, "TBD");
  const away = toFixtureDisplayText(fixture.teams?.away, "TBD");
  return `${home} vs ${away}`;
}

